"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import type { HeroData, HeroSlot } from "@/lib/hero-utils";
import UploadProgress from "./UploadProgress";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

type PendingUpload = {
  url: string;
  publicId: string;
  previewUrl?: string;
};

const slots: { key: HeroSlot; label: string; accept: string; icon: typeof Video }[] = [
  { key: "video", label: "Hero Video (MP4)", accept: "video/mp4,video/*", icon: Video },
  { key: "image1", label: "Hero Image 1", accept: "image/*", icon: ImageIcon },
  { key: "image2", label: "Hero Image 2", accept: "image/*", icon: ImageIcon },
  { key: "image3", label: "Hero Image 3", accept: "image/*", icon: ImageIcon },
];

const emptyHero: HeroData = {
  video: { url: "", publicId: "" },
  image1: { url: "", publicId: "" },
  image2: { url: "", publicId: "" },
  image3: { url: "", publicId: "" },
};

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroData>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Partial<Record<HeroSlot, PendingUpload>>>({});
  const [uploadPercent, setUploadPercent] = useState<Partial<Record<HeroSlot, number>>>({});
  const [uploading, setUploading] = useState<HeroSlot | null>(null);
  const [saving, setSaving] = useState<HeroSlot | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<HeroSlot | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/hero", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setHero({
        video: data.video || emptyHero.video,
        image1: data.image1 || emptyHero.image1,
        image2: data.image2 || emptyHero.image2,
        image3: data.image3 || emptyHero.image3,
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to load hero", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function previewUrl(slot: HeroSlot): string | undefined {
    const p = pending[slot];
    if (p?.previewUrl) return p.previewUrl;
    if (p?.url) return p.url;
    const saved = hero[slot]?.url;
    return saved || undefined;
  }

  async function handleFileSelect(slot: HeroSlot, file: File) {
    const blobPreview = URL.createObjectURL(file);
    setUploading(slot);
    setUploadPercent((prev) => ({ ...prev, [slot]: 0 }));
    setPending((prev) => ({
      ...prev,
      [slot]: { url: blobPreview, publicId: "", previewUrl: blobPreview },
    }));

    const folder = slot === "video" ? "hero/video" : "hero/images";
    try {
      const data = await uploadWithProgress(file, folder, (pct) =>
        setUploadPercent((p) => ({ ...p, [slot]: pct }))
      );
      setPending((prev) => ({
        ...prev,
        [slot]: {
          url: data.url,
          publicId: data.publicId,
          previewUrl: blobPreview,
        },
      }));
      toast("Upload complete — click Save Changes to publish to the website");
    } catch (err) {
      setPending((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(null);
    }
  }

  async function saveSlot(slot: HeroSlot) {
    const p = pending[slot];
    if (!p?.url || !p.publicId) {
      toast("Upload a file first, then save", "error");
      return;
    }
    setSaving(slot);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, url: p.url, publicId: p.publicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      toast("Saved to database — homepage hero will update on next visit");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(null);
    }
  }

  async function confirmDelete() {
    if (!deleteSlot) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: deleteSlot, action: "delete" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[deleteSlot];
        return next;
      });
      toast("Asset removed from hero");
    } catch (err) {
      toast("Failed to remove asset", "error");
    } finally {
      setDeleting(false);
      setDeleteSlot(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin" /> Loading hero assets...
    </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900">Hero Banner</h1>
        <p className="text-slate-500">
          Upload to Cloudinary, then click Save Changes. The live homepage reads from{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">/api/hero</code>.
        </p>
      </header>

      <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
        {slots.map(({ key, label, accept, icon: Icon }) => {
          const url = previewUrl(key);
          const hasAsset = Boolean(url);
          const hasPending = Boolean(pending[key]?.publicId);
          const isUploading = uploading === key;
          const isSaving = saving === key;
          const savedUrl = hero[key]?.url;

          return (
            <li
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Icon className="h-5 w-5 text-accent" />
                <h2 className="font-semibold text-slate-900">{label}</h2>
                {hasPending && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Unsaved
                  </span>
                )}
                {savedUrl && !hasPending && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Live
                  </span>
                )}
              </div>

              <div className="mb-4 flex min-h-[200px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                {hasAsset ? (
                  key === "video" ? (
                    <video
                      key={url}
                      src={url}
                      controls
                      className="max-h-56 w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={label}
                      className="max-h-56 w-full object-contain"
                    />
                  )
                ) : (
                  <p className="text-sm text-slate-400">No asset uploaded yet</p>
                )}
              </div>

              {isUploading && (
                <UploadProgress
                  percent={uploadPercent[key] ?? 0}
                  label="Uploading to Cloudinary..."
                />
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : hasAsset ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    disabled={isUploading || isSaving}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(key, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {hasPending && (
                  <button
                    type="button"
                    onClick={() => saveSlot(key)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-primary shadow-sm disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                )}
                {(savedUrl || hasAsset) && !hasPending && (
                  <button
                    type="button"
                    onClick={() => setDeleteSlot(key)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
              {savedUrl && (
                <p className="mt-2 truncate text-xs text-slate-400" title={savedUrl}>
                  Saved: {savedUrl}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={Boolean(deleteSlot)}
        title="Remove hero asset?"
        message="This will delete the file from Cloudinary and clear the slot on the live site."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteSlot(null)}
      />
    </section>
  );
}

