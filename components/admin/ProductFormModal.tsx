"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import UploadProgress from "./UploadProgress";
import { useToast } from "./ToastProvider";

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
  onSave: (data: ProductFormData) => Promise<boolean>;
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
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormData>(initial || empty);
  const [uploadPercent, setUploadPercent] = useState(0);
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
    setUploadPercent(0);
    try {
      const data = await uploadWithProgress(file, "products", setUploadPercent);
      setForm((f) => ({
        ...f,
        image: data.url,
        imagePublicId: data.publicId,
      }));
      toast("Image uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (ok) {
      toast(form._id ? "Product updated" : "Product created");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="block text-sm font-medium text-gray-700">
            Name *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Category *
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Price
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product image
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                disabled={uploading}
                className="mt-1 block w-full text-sm"
              />
            </label>
            {uploading && <UploadProgress percent={uploadPercent} />}
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 h-28 w-28 rounded-lg border object-cover"
              />
            )}
          </div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="rounded"
            />
            In Stock
          </label>
          <div className="flex gap-3 border-t pt-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-semibold text-primary disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : form._id ? "Save Changes" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

