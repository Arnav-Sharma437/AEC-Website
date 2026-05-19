"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import {
  EMPTY_HERO_ASSET,
  type HeroAsset,
  type HeroData,
  type HeroSlot,
} from "@/lib/hero-utils";
import UploadProgress from "./UploadProgress";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

type PendingUpload = {
  url: string;
  publicId: string;
  previewUrl?: string;
};

type CopyDraft = Pick<HeroAsset, "heading" | "subheading" | "buttonText" | "buttonLink">;

const slots: { key: HeroSlot; label: string; accept: string; icon: typeof Video }[] = [
  {
    key: "video",
    label: "Hero Video",
    accept: ".mp4,.mov,.webm,.mkv,.avi,.m4v,video/*",
    icon: Video,
  },
  { key: "image1", label: "Hero Image 1", accept: "image/*", icon: ImageIcon },
  { key: "image2", label: "Hero Image 2", accept: "image/*", icon: ImageIcon },
  { key: "image3", label: "Hero Image 3", accept: "image/*", icon: ImageIcon },
];

const emptyHero: HeroData = {
  video: { ...EMPTY_HERO_ASSET },
  image1: { ...EMPTY_HERO_ASSET },
  image2: { ...EMPTY_HERO_ASSET },
  image3: { ...EMPTY_HERO_ASSET },
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroData>(emptyHero);
  const [copyDrafts, setCopyDrafts] = useState<Record<HeroSlot, CopyDraft>>({
    video: { heading: "", subheading: "", buttonText: "", buttonLink: "" },
    image1: { heading: "", subheading: "", buttonText: "", buttonLink: "" },
    image2: { heading: "", subheading: "", buttonText: "", buttonLink: "" },
    image3: { heading: "", subheading: "", buttonText: "", buttonLink: "" },
  });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Partial<Record<HeroSlot, PendingUpload>>>({});
  const [uploadPercent, setUploadPercent] = useState<Partial<Record<HeroSlot, number>>>({});
  const [uploading, setUploading] = useState<HeroSlot | null>(null);
  const [saving, setSaving] = useState<HeroSlot | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<HeroSlot | null>(null);
  const [deleting, setDeleting] = useState(false);

  function syncCopyFromHero(data: HeroData) {
    setCopyDrafts({
      video: copyFromAsset(data.video),
      image1: copyFromAsset(data.image1),
      image2: copyFromAsset(data.image2),
      image3: copyFromAsset(data.image3),
    });
  }

  async function load() {
    try {
      const res = await fetch("/api/admin/hero", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const next: HeroData = {
        video: data.video || emptyHero.video,
        image1: data.image1 || emptyHero.image1,
        image2: data.image2 || emptyHero.image2,
        image3: data.image3 || emptyHero.image3,
      };
      setHero(next);
      syncCopyFromHero(next);
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

  function copyFromAsset(asset: HeroAsset): CopyDraft {
    return {
      heading: asset.heading,
      subheading: asset.subheading,
      buttonText: asset.buttonText,
      buttonLink: asset.buttonLink,
    };
  }

  function previewUrl(slot: HeroSlot): string | undefined {
    const p = pending[slot];
    if (p?.previewUrl) return p.previewUrl;
    if (p?.url && p.publicId) return p.url;
    const saved = hero[slot]?.url;
    return saved || undefined;
  }

  function updateCopy(slot: HeroSlot, patch: Partial<CopyDraft>) {
    setCopyDrafts((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], ...patch },
    }));
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
      toast("Upload complete — click Save Changes to publish");
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
    const copy = copyDrafts[slot];
    const hasMedia = Boolean(p?.url && p.publicId);
    const hasSavedMedia = Boolean(hero[slot]?.url);

    if (!hasMedia && !hasSavedMedia) {
      toast("Upload a file first, then save", "error");
      return;
    }

    setSaving(slot);
    try {
      const body: Record<string, string> = {
        slot,
        heading: copy.heading,
        subheading: copy.subheading,
        buttonText: copy.buttonText,
        buttonLink: copy.buttonLink,
      };
      if (hasMedia) {
        body.url = p!.url;
        body.publicId = p!.publicId;
      }

      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setHero(data);
      syncCopyFromHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      toast("Saved — homepage hero will update on next visit");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(null);
    }
  }

  async function saveCopyOnly(slot: HeroSlot) {
    if (!hero[slot]?.url) {
      toast("Upload media for this slide first", "error");
      return;
    }
    await saveSlot(slot);
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
      syncCopyFromHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[deleteSlot];
        return next;
      });
      toast("Asset removed from hero");
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
          Upload video or images to Cloudinary, set heading and button text per slide, then save.
          Videos upload directly to Cloudinary (supports MP4, MOV, WebM, MKV up to 100MB+).
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
          const copy = copyDrafts[key];
          const copyDirty =
            copy.heading !== hero[key].heading ||
            copy.subheading !== hero[key].subheading ||
            copy.buttonText !== hero[key].buttonText ||
            copy.buttonLink !== hero[key].buttonLink;

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
                    <img src={url} alt={label} className="max-h-56 w-full object-contain" />
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

              <div className="mt-4 space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Slide text &amp; button
                </p>
                <label className="block text-sm font-medium text-slate-700">
                  Heading
                  <input
                    type="text"
                    value={copy.heading}
                    onChange={(e) => updateCopy(key, { heading: e.target.value })}
                    placeholder="Engineering Solutions You Can Trust"
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Sub-heading
                  <input
                    type="text"
                    value={copy.subheading}
                    onChange={(e) => updateCopy(key, { subheading: e.target.value })}
                    placeholder="25+ Years of Precision. Certified. Reliable."
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Button label
                    <input
                      type="text"
                      value={copy.buttonText}
                      onChange={(e) => updateCopy(key, { buttonText: e.target.value })}
                      placeholder="Explore Products"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Button link
                    <input
                      type="text"
                      value={copy.buttonLink}
                      onChange={(e) => updateCopy(key, { buttonLink: e.target.value })}
                      placeholder="/shop"
                      className={fieldClass}
                    />
                  </label>
                </div>
                {savedUrl && copyDirty && !hasPending && (
                  <button
                    type="button"
                    onClick={() => saveCopyOnly(key)}
                    disabled={isSaving}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Save text only
                  </button>
                )}
              </div>

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
                {(hasPending || (savedUrl && copyDirty)) && (
                  <button
                    type="button"
                    onClick={() => saveSlot(key)}
                    disabled={isSaving || (hasPending && !pending[key]?.publicId)}
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
