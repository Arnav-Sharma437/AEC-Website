"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon } from "lucide-react";

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

const slots: { key: Slot; label: string; accept: string; icon: typeof Video }[] = [
  { key: "video", label: "Hero Video (MP4)", accept: "video/mp4,video/*", icon: Video },
  { key: "image1", label: "Hero Image 1", accept: "image/*", icon: ImageIcon },
  { key: "image2", label: "Hero Image 2", accept: "image/*", icon: ImageIcon },
  { key: "image3", label: "Hero Image 3", accept: "image/*", icon: ImageIcon },
];

export default function HeroManager() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Slot | null>(null);

  async function load() {
    const res = await fetch("/api/admin/hero");
    const data = await res.json();
    setHero(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(slot: Slot, file: File) {
    setUploading(slot);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", slot === "video" ? "hero/video" : "hero/images");
    const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url, publicId } = await up.json();
    if (up.ok) {
      await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, url, publicId }),
      });
      await load();
    }
    setUploading(null);
  }

  async function remove(slot: Slot) {
    if (!confirm(`Remove ${slot}?`)) return;
    await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, action: "delete" }),
    });
    load();
  }

  if (loading) return <p className="text-gray-500">Loading hero assets...</p>;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Hero Banner</h1>
        <p className="text-gray-500">Upload video and images for the homepage slider</p>
      </header>

      <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
        {slots.map(({ key, label, accept, icon: Icon }) => {
          const asset = hero?.[key];
          const hasAsset = Boolean(asset?.url);
          return (
            <li
              key={key}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-accent" />
                <h2 className="font-semibold text-gray-900">{label}</h2>
              </div>
              <div className="mb-4 flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {hasAsset ? (
                  key === "video" ? (
                    <video
                      src={asset!.url}
                      controls
                      className="max-h-48 w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset!.url}
                      alt={label}
                      className="max-h-48 w-full object-contain"
                    />
                  )
                ) : (
                  <p className="text-sm text-gray-400">No asset uploaded</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary">
                  <Upload className="h-4 w-4" />
                  {uploading === key ? "Uploading..." : hasAsset ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    disabled={uploading === key}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) upload(key, f);
                    }}
                  />
                </label>
                {hasAsset && (
                  <button
                    type="button"
                    onClick={() => remove(key)}
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
    </section>
  );
}
