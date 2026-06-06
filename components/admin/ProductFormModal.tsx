"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import {
  CATEGORIES,
  getSubCategoriesByCategory,
  isEnquiryOnlyCategory,
} from "@/data/categories";
import { uploadWithProgress } from "@/lib/admin-upload-client";
import { resolveProductImage, PRODUCT_PLACEHOLDER } from "@/lib/products-api";
import { normalizeStockFields } from "@/lib/product-stock";
import UploadProgress from "./UploadProgress";
import { useToast } from "./ToastProvider";

export interface ProductFormData {
  _id?: string;
  name: string;
  category: string;
  subCategory: string;
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

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => !isEnquiryOnlyCategory(c.slug));

const empty: ProductFormData = {
  name: "",
  category: PRODUCT_CATEGORIES[0]?.slug || "lifting-solutions",
  subCategory: getSubCategoriesByCategory(PRODUCT_CATEGORIES[0]?.slug || "lifting-solutions")[0]
    ?.slug || "",
  description: "",
  price: "XXX",
  image: "",
  imagePublicId: "",
  quantity: 0,
  inStock: true,
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  initial,
  title,
}: ProductFormModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormData>(empty);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const subCategoryOptions = useMemo(
    () => getSubCategoriesByCategory(form.category),
    [form.category]
  );

  useEffect(() => {
    if (!open) return;
    const next = initial || empty;
    setForm(next);
    setImagePreview(next.image ? resolveProductImage(next.image) : "");
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    if (subCategoryOptions.some((s) => s.slug === form.subCategory)) return;
    setForm((f) => ({ ...f, subCategory: subCategoryOptions[0]?.slug || "" }));
  }, [form.subCategory, open, subCategoryOptions]);

  function updateStock(patch: { quantity?: number; inStock?: boolean }) {
    const stock = normalizeStockFields(patch, {
      quantity: form.quantity,
      inStock: form.inStock,
    });
    setForm((f) => ({ ...f, ...stock }));
  }

  if (!open) return null;

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setUploadPercent(0);
    try {
      const data = await uploadWithProgress(file, "products", setUploadPercent);
      setForm((f) => ({
        ...f,
        image: data.url,
        imagePublicId: data.publicId,
      }));
      setImagePreview(data.url);
      toast("Image uploaded");
    } catch (err) {
      setImagePreview(form.image ? resolveProductImage(form.image) : "");
      toast(err instanceof Error ? err.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subCategory) {
      toast("Please select a sub-category", "error");
      return;
    }
    const stock = normalizeStockFields(
      { quantity: form.quantity, inStock: form.inStock },
      { quantity: form.quantity, inStock: form.inStock }
    );
    setSaving(true);
    const ok = await onSave({ ...form, ...stock });
    setSaving(false);
    if (ok) {
      toast(form._id ? "Product updated" : "Product created");
      onClose();
    }
  }

  const previewSrc =
    imagePreview || (form.image ? resolveProductImage(form.image) : PRODUCT_PLACEHOLDER);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6">
          <label className="block text-sm font-medium text-gray-800">
            Name *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Main Category *
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory: getSubCategoriesByCategory(e.target.value)[0]?.slug || "",
                })
              }
              className={fieldClass}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Sub-Category *
            <select
              required
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              className={fieldClass}
            >
              {subCategoryOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Price
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={fieldClass}
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-800">
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
            <Image
              src={previewSrc}
              alt="Preview"
              width={280}
              height={200}
              className="mt-3 max-h-48 w-full rounded-lg border border-gray-200 object-contain bg-gray-50"
              unoptimized
              onError={() => setImagePreview(PRODUCT_PLACEHOLDER)}
            />
            <p className="mt-1 text-xs text-gray-500">Current image preview</p>
          </div>
          <label className="block text-sm font-medium text-gray-800">
            Quantity (stock count)
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => updateStock({ quantity: Number(e.target.value) })}
              className={fieldClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => updateStock({ inStock: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 accent-accent"
            />
            In Stock (hidden on shop when off or qty is 0)
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
