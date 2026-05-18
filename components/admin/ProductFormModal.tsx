"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export interface ProductFormData {
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  imagePublicId: string;
  quantity: number;
  inStock: boolean;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  initial?: ProductFormData | null;
  title: string;
}

const empty: ProductFormData = {
  name: "",
  category: CATEGORIES[0]?.slug || "material-handling",
  description: "",
  price: "XXX",
  image: "",
  imagePublicId: "",
  quantity: 0,
  inStock: true,
};

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  initial,
  title,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(initial || empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial || empty);
  }, [open, initial]);

  if (!open) return null;

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "products");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm((f) => ({ ...f, image: data.url, imagePublicId: data.publicId }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="block text-sm">
            Name *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Category *
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Price
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Image {uploading && "(uploading...)"}
            <input type="file" accept="image/*" onChange={handleImage} className="mt-1" />
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="" className="mt-2 h-24 rounded object-cover" />
            )}
          </label>
          <label className="block text-sm">
            Quantity
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            In Stock
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-accent py-2 font-semibold text-primary"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
