"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Trash2,
  Video,
  Image as ImageIcon,
  Loader2,
  Save,
  Plus,
} from "lucide-react";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import { BRAND_TAGLINE } from "@/data/categories";
import {
  EMPTY_HERO_ASSET,
  imageSlot,
  mobilePendingKey,
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

const VIDEO_SLOT: HeroSlot = "video";

const emptyHero: HeroData = {
  video: { ...EMPTY_HERO_ASSET },
  images: [],
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

function copyFromAsset(asset: HeroAsset): CopyDraft {
  return {
    heading: asset.heading,
    subheading: asset.subheading,
    buttonText: asset.buttonText,
    buttonLink: asset.buttonLink,
  };
}

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroData>(emptyHero);
  const [copyDrafts, setCopyDrafts] = useState<Record<string, CopyDraft>>({
    video: copyFromAsset(emptyHero.video),
  });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Partial<Record<string, PendingUpload>>>({});
  const [uploadPercent, setUploadPercent] = useState<Partial<Record<string, number>>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<string | null>(null);
  const [deleteMobileSlot, setDeleteMobileSlot] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addingImage, setAddingImage] = useState(false);

  const imageSlots = useMemo(
    () => hero.images.map((_, index) => imageSlot(index)),
    [hero.images]
  );

  function syncCopyFromHero(data: HeroData) {
    const drafts: Record<string, CopyDraft> = {
      video: copyFromAsset(data.video),
    };
    data.images.forEach((asset, index) => {
      drafts[imageSlot(index)] = copyFromAsset(asset);
    });
    setCopyDrafts(drafts);
  }

  async function load() {
    try {
      const res = await fetch("/api/admin/hero", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const next: HeroData = {
        video: data.video || emptyHero.video,
        images: Array.isArray(data.images) ? data.images : [],
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

  function previewUrl(slot: string): string | undefined {
    const p = pending[slot];
    if (p?.previewUrl) return p.previewUrl;
    if (p?.url && p.publicId) return p.url;
    if (slot === VIDEO_SLOT) return hero.video.url || undefined;
    const match = /^image-(\d+)$/.exec(slot);
    if (match) return hero.images[Number(match[1])]?.url || undefined;
    return undefined;
  }

  function assetForSlot(slot: string): HeroAsset {
    if (slot === VIDEO_SLOT) return hero.video;
    const match = /^image-(\d+)$/.exec(slot);
    if (match) return hero.images[Number(match[1])] ?? { ...EMPTY_HERO_ASSET };
    return { ...EMPTY_HERO_ASSET };
  }

  function mobilePreviewUrl(slot: string): string | undefined {
    const mobileKey = mobilePendingKey(slot);
    const p = pending[mobileKey];
    if (p?.previewUrl) return p.previewUrl;
    if (p?.url && p.publicId) return p.url;
    return assetForSlot(slot).mobileUrl || undefined;
  }

  function updateCopy(slot: string, patch: Partial<CopyDraft>) {
    setCopyDrafts((prev) => ({
      ...prev,
      [slot]: { ...(prev[slot] ?? copyFromAsset(EMPTY_HERO_ASSET)), ...patch },
    }));
  }

  async function handleFileSelect(slot: string, file: File) {
    const blobPreview = URL.createObjectURL(file);
    setUploading(slot);
    setUploadPercent((prev) => ({ ...prev, [slot]: 0 }));
    setPending((prev) => ({
      ...prev,
      [slot]: { url: blobPreview, publicId: "", previewUrl: blobPreview },
    }));

    const isMobileUpload = slot.endsWith(":mobile");
    const baseSlot = isMobileUpload ? slot.slice(0, -":mobile".length) : slot;
    const folder =
      baseSlot === VIDEO_SLOT && !isMobileUpload ? "hero/video" : "hero/images";
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

  async function saveSlot(slot: string) {
    const p = pending[slot];
    const copy = copyDrafts[slot] ?? copyFromAsset(EMPTY_HERO_ASSET);
    const saved = assetForSlot(slot);
    const hasMedia = Boolean(p?.url && p.publicId);
    const hasSavedMedia = Boolean(saved.url);

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

  async function saveCopyOnly(slot: string) {
    if (!assetForSlot(slot).url) {
      toast("Upload media for this slide first", "error");
      return;
    }
    await saveSlot(slot);
  }

  async function addImageSlot() {
    setAddingImage(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add image slot");
      setHero(data);
      syncCopyFromHero(data);
      toast("New image slot added — upload and save when ready");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add image", "error");
    } finally {
      setAddingImage(false);
    }
  }

  async function saveMobileSlot(slot: string) {
    const mobileKey = mobilePendingKey(slot);
    const p = pending[mobileKey];
    if (!p?.url || !p.publicId) {
      toast("Upload a mobile banner first", "error");
      return;
    }
    if (!assetForSlot(slot).url) {
      toast("Save the desktop banner before adding mobile", "error");
      return;
    }

    setSaving(mobileKey);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          variant: "mobile",
          url: p.url,
          publicId: p.publicId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setHero(data);
      syncCopyFromHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[mobileKey];
        return next;
      });
      toast("Mobile banner saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save mobile banner", "error");
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
      syncCopyFromHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[deleteSlot];
        delete next[mobilePendingKey(deleteSlot)];
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

  async function confirmDeleteMobile() {
    if (!deleteMobileSlot) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: deleteMobileSlot, action: "delete-mobile" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setHero(data);
      syncCopyFromHero(data);
      setPending((prev) => {
        const next = { ...prev };
        delete next[mobilePendingKey(deleteMobileSlot)];
        return next;
      });
      toast("Mobile banner removed");
    } catch {
      toast("Failed to remove mobile banner", "error");
    } finally {
      setDeleting(false);
      setDeleteMobileSlot(null);
    }
  }

  function renderSlotCard(
    key: string,
    label: string,
    accept: string,
    icon: typeof Video,
    isVideo: boolean
  ) {
    const Icon = icon;
    const url = previewUrl(key);
    const hasAsset = Boolean(url);
    const hasPending = Boolean(pending[key]?.publicId);
    const isUploading = uploading === key;
    const isSaving = saving === key;
    const savedUrl = assetForSlot(key).url;
    const saved = assetForSlot(key);
    const copy = copyDrafts[key] ?? copyFromAsset(saved);
    const copyDirty =
      copy.heading !== saved.heading ||
      copy.subheading !== saved.subheading ||
      copy.buttonText !== saved.buttonText ||
      copy.buttonLink !== saved.buttonLink;

    const mobileKey = mobilePendingKey(key);
    const mobileUrl = mobilePreviewUrl(key);
    const savedMobileUrl = saved.mobileUrl;
    const hasMobileAsset = Boolean(mobileUrl);
    const hasMobilePending = Boolean(pending[mobileKey]?.publicId);
    const isMobileUploading = uploading === mobileKey;
    const isMobileSaving = saving === mobileKey;

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
            isVideo ? (
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
              placeholder="Your headline for this slide"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Sub-heading
            <input
              type="text"
              value={copy.subheading}
              onChange={(e) => updateCopy(key, { subheading: e.target.value })}
              placeholder={BRAND_TAGLINE}
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
            Desktop: {savedUrl}
          </p>
        )}

        {savedUrl && (
          <div className="mt-6 space-y-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ImageIcon className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-800">Mobile banner (optional)</p>
              {hasMobilePending && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Unsaved
                </span>
              )}
              {savedMobileUrl && !hasMobilePending && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Live on mobile
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Portrait image shown on phones. If empty, the desktop banner is used on mobile.
            </p>

            <div className="flex min-h-[140px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              {hasMobileAsset ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mobileUrl}
                  alt={`${label} mobile`}
                  className="max-h-40 w-full object-contain"
                />
              ) : (
                <p className="text-sm text-slate-400">No mobile banner</p>
              )}
            </div>

            {isMobileUploading && (
              <UploadProgress
                percent={uploadPercent[mobileKey] ?? 0}
                label="Uploading mobile banner..."
              />
            )}

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                {isMobileUploading
                  ? "Uploading..."
                  : hasMobileAsset
                    ? "Replace mobile"
                    : "Upload mobile"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isMobileUploading || isMobileSaving}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(mobileKey, f);
                    e.target.value = "";
                  }}
                />
              </label>
              {hasMobilePending && (
                <button
                  type="button"
                  onClick={() => saveMobileSlot(key)}
                  disabled={isMobileSaving || !pending[mobileKey]?.publicId}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-primary shadow-sm disabled:opacity-60"
                >
                  {isMobileSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save mobile
                </button>
              )}
              {(savedMobileUrl || hasMobileAsset) && !hasMobilePending && (
                <button
                  type="button"
                  onClick={() => setDeleteMobileSlot(key)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Remove mobile
                </button>
              )}
            </div>
          </div>
        )}
      </li>
    );
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
          Upload a video or any number of images, optionally add a mobile-only banner per slide,
          set heading and button text, then save. Videos support MP4, MOV, WebM, MKV up to 100MB+.
        </p>
      </header>

      <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
        {renderSlotCard(
          VIDEO_SLOT,
          "Hero Video",
          ".mp4,.mov,.webm,.mkv,.avi,.m4v,video/*",
          Video,
          true
        )}
        {imageSlots.map((slot, index) =>
          renderSlotCard(slot, `Hero Image ${index + 1}`, "image/*", ImageIcon, false)
        )}
      </ul>

      <div>
        <button
          type="button"
          onClick={addImageSlot}
          disabled={addingImage}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {addingImage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Hero Image
        </button>
        {imageSlots.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            No image slots yet — click above to add your first banner image.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteSlot)}
        title="Remove hero asset?"
        message="This will delete the file from Cloudinary and remove it from the live banner."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteSlot(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteMobileSlot)}
        title="Remove mobile banner?"
        message="This removes the mobile-only image. Phones will show the desktop banner instead."
        loading={deleting}
        onConfirm={confirmDeleteMobile}
        onCancel={() => setDeleteMobileSlot(null)}
      />
    </section>
  );
}
