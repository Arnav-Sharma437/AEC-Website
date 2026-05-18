"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import UploadProgress from "./UploadProgress";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

type Slot = "video" | "image1" | "image2" | "image3";

interface Asset {
  url?: string;
  publicId?: string;
}

interface HeroData {
  video: Asset;
  image1: Asset;
  image2: Asset;
  image3: Asset;
}

type PendingUpload = { url: string; publicId: string; file?: File };

const slots: { key: Slot; label: string; accept: string; icon: typeof Video }[] = [
  { key: "video", label: "Hero Video (MP4)", accept: "video/mp4,video/*", icon: Video },
  { key: "image1", label: "Hero Image 1", accept: "image/*", icon: ImageIcon },
  { key: "image2", label: "Hero Image 2", accept: "image/*", icon: ImageIcon },
  { key: "image3", label: "Hero Image 3", accept: "image/*", icon: ImageIcon },
];

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Partial<Record<Slot, PendingUpload>>>({});
  const [uploadPercent, setUploadPercent] = useState<Partial<Record<Slot, number>>>({});
  const [uploading, setUploading] = useState<Slot | null>(null);
  const [saving, setSaving] = useState<Slot | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<Slot | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHero(data);
    } catch {
      toast("Failed to load hero settings", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function previewUrl(slot: Slot): string | undefined {
    return pending[slot]?.url || hero?.[slot]?.url;
  }

  async function handleFileSelect(slot: Slot, file: File) {
    setUploading(slot);
    setUploadPercent((p) => ({ ...p, [slot]: 0 }));
    const folder = slot === "video" ? "hero/video" : "hero/images";
    try {
      const data = await uploadWithProgress(file, folder, (pct) =>
        setUploadPercent((p) => ({ ...p, [slot]: pct }))
      );
      setPending((prev) => ({
        ...prev,
        [slot]: { url: data.url, publicId: data.publicId, file },
      }));
      toast(`${slots.find((s) => s.key === slot)?.label} uploaded — click Save to apply`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(null);
    }
  }

  async function saveSlot(slot: Slot) {
    const p = pending[slot];
    if (!p) return;
    setSaving(slot);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, url: p.url, publicId: p.publicId }),
      });
      if (!res.ok) throw new Error("Save failed");
      setPending((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      toast("Hero asset saved");
      await load();
    } catch {
      toast("Failed to save hero asset", "error");
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
      if (!res.ok) throw new Error("Delete failed");
      setPending((prev) => {
        const next = { ...prev };
        delete next[deleteSlot];
        return next;
      });
      toast("Asset removed");
      await load();
    } catch {
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
          Upload video and images for the homepage slider. Upload first, then save each slot.
        </p>
      </header>

      <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
        {slots.map(({ key, label, accept, icon: Icon }) => {
          const url = previewUrl(key);
          const hasAsset = Boolean(url);
          const hasPending = Boolean(pending[key]);
          const isUploading = uploading === key;
          const isSaving = saving === key;

          return (
            <li
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-accent" />
                <h2 className="font-semibold text-slate-900">{label}</h2>
                {hasPending && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Unsaved
                  </span>
                )}
              </div>
              <div className="mb-4 flex min-h-[180px] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {hasAsset ? (
                  key === "video" ? (
                    <video
                      src={url}
                      controls
                      className="max-h-52 w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={label}
                      className="max-h-52 w-full object-contain"
                    />
                  )
                ) : (
                  <p className="text-sm text-slate-400">No asset uploaded</p>
                )}
              </div>

              {isUploading && uploadPercent[key] !== undefined && (
                <UploadProgress percent={uploadPercent[key]!} />
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : hasAsset ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    disabled={isUploading}
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
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                )}
                {hasAsset && !hasPending && (
                  <button
                    type="button"
                    onClick={() => setDeleteSlot(key)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={Boolean(deleteSlot)}
        title="Remove hero asset?"
        message="This will delete the file from Cloudinary and clear the slot."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteSlot(null)}
      />
    </section>
  );
}
