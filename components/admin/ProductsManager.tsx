"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Eye,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Loader2,
  Zap,
  Filter,
  Check,
  X,
} from "lucide-react";
import { normalizeStockFields } from "@/lib/product-stock";
import { CATEGORIES } from "@/data/categories";
import { PRODUCT_COUNT } from "@/data/products";
import { resolveProductImage, PRODUCT_PLACEHOLDER } from "@/lib/products-api";
import ProductFormModal, { ProductFormData } from "./ProductFormModal";
import ConfirmDialog from "./ConfirmDialog";
import StockPillToggle from "./StockPillToggle";
import IconTooltipButton from "./IconTooltipButton";
import { useToast } from "./ToastProvider";

interface Product {
  _id: string;
  name: string;
  category: string;
  categoryName: string;
  subCategory: string;
  subCategoryName: string;
  price: string;
  image: string;
  inStock: boolean;
  quantity: number;
  description?: string;
  imagePublicId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ProductsManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [quickEditRow, setQuickEditRow] = useState<string | null>(null);
  const [quickEditDraft, setQuickEditDraft] = useState<{
    name: string;
    price: string;
    quantity: number;
    inStock: boolean;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    try {
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to load products", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page, toast]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  async function syncCatalog() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/products/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      const removed = data.removed ? ` Removed ${data.removed} old items.` : "";
      toast(`Synced ${data.synced} products.${removed}`);
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Sync failed", "error");
    } finally {
      setSyncing(false);
    }
  }

  async function patchProduct(id: string, body: Record<string, unknown>) {
    const prev = products;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setProducts((list) =>
        list.map((p) =>
          p._id === id
            ? {
                ...p,
                name: data.name ?? p.name,
                price: data.price ?? p.price,
                quantity: data.quantity ?? p.quantity,
                inStock: data.inStock ?? p.inStock,
                categoryName: data.categoryName ?? p.categoryName,
              }
            : p
        )
      );
      toast("Saved");
      return data;
    } catch (err) {
      setProducts(prev);
      toast(err instanceof Error ? err.message : "Update failed", "error");
      return null;
    }
  }

  function startQuickEdit(p: Product) {
    setQuickEditRow(p._id);
    setQuickEditDraft({
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      inStock: p.inStock,
    });
  }

  function cancelQuickEdit() {
    setQuickEditRow(null);
    setQuickEditDraft(null);
  }

  async function saveQuickEdit(id: string) {
    if (!quickEditDraft) return;
    setActionLoading(`save-${id}`);
    const stock = normalizeStockFields(
      { quantity: quickEditDraft.quantity, inStock: quickEditDraft.inStock },
      { quantity: quickEditDraft.quantity, inStock: quickEditDraft.inStock }
    );
    const ok = await patchProduct(id, {
      name: quickEditDraft.name,
      price: quickEditDraft.price,
      quantity: stock.quantity,
      inStock: stock.inStock,
    });
    setActionLoading(null);
    if (ok) {
      cancelQuickEdit();
    }
  }

  function updateQuickDraft(patch: Partial<NonNullable<typeof quickEditDraft>>) {
    if (!quickEditDraft) return;
    const next = { ...quickEditDraft, ...patch };
    if ("quantity" in patch || "inStock" in patch) {
      const stock = normalizeStockFields(
        { quantity: next.quantity, inStock: next.inStock },
        { quantity: next.quantity, inStock: next.inStock }
      );
      setQuickEditDraft({ ...next, ...stock });
    } else {
      setQuickEditDraft(next);
    }
  }

  async function handleSave(data: ProductFormData): Promise<boolean> {
    try {
      const url = data._id
        ? `/api/admin/products/${data._id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: data._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      await load();
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
      return false;
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast("Product deleted");
      setDeleteTarget(null);
      await load();
    } catch {
      toast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDuplicate(id: string) {
    setActionLoading(`dup-${id}`);
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Duplicate failed");
      toast("Product duplicated");
      await load();
    } catch {
      toast("Duplicate failed", "error");
    } finally {
      setActionLoading(null);
    }
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setModalOpen(true);
  }

  function openNew() {
    setEditProduct(null);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {pagination.total} products in catalogue
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={syncCatalog}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync Catalogue
          </button>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-primary shadow-md transition hover:brightness-105"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Add Product
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search products by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 shadow-inner transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="relative sm:w-56">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm font-medium text-slate-700 shadow-inner focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <PackageOpen className="h-12 w-12 text-slate-300" />
            <p className="font-medium text-slate-700">No products found</p>
            <p className="max-w-sm text-sm text-slate-500">
              Sync the frontend catalogue to MongoDB or add a new product manually.
            </p>
            <button
              type="button"
              onClick={syncCatalog}
              disabled={syncing}
              className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary"
            >
              {syncing ? "Syncing..." : `Sync ${PRODUCT_COUNT} Products`}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Image
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sub-Category
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stock
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Qty
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr
                      key={p._id}
                      className={`transition-colors ${
                        quickEditRow === p._id
                          ? "bg-amber-50/80 ring-1 ring-inset ring-amber-200"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <Image
                          src={resolveProductImage(p.image)}
                          alt={p.name}
                          width={50}
                          height={50}
                          className="h-[50px] w-[50px] rounded-lg border border-slate-200 object-cover shadow-sm"
                          unoptimized={!p.image?.includes("cloudinary")}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                          }}
                        />
                      </td>
                      <td className="max-w-[220px] px-5 py-4 font-medium text-slate-900">
                        {quickEditRow === p._id && quickEditDraft ? (
                          <input
                            value={quickEditDraft.name}
                            onChange={(e) => updateQuickDraft({ name: e.target.value })}
                            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
                            autoFocus
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{p.categoryName}</td>
                      <td className="px-5 py-4 text-slate-600">{p.subCategoryName}</td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {quickEditRow === p._id && quickEditDraft ? (
                          <input
                            value={quickEditDraft.price}
                            onChange={(e) => updateQuickDraft({ price: e.target.value })}
                            className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
                          />
                        ) : (
                          `₹ ${p.price}`
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {quickEditRow === p._id && quickEditDraft ? (
                          <StockPillToggle
                            inStock={quickEditDraft.inStock}
                            onToggle={() =>
                              updateQuickDraft({ inStock: !quickEditDraft.inStock })
                            }
                          />
                        ) : (
                          <StockPillToggle
                            inStock={p.inStock}
                            disabled={actionLoading === `stock-${p._id}`}
                            onToggle={async () => {
                              setActionLoading(`stock-${p._id}`);
                              const stock = normalizeStockFields(
                                { inStock: !p.inStock },
                                { quantity: p.quantity, inStock: p.inStock }
                              );
                              await patchProduct(p._id, stock);
                              setActionLoading(null);
                            }}
                          />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {quickEditRow === p._id && quickEditDraft ? (
                          <input
                            type="number"
                            min={0}
                            value={quickEditDraft.quantity}
                            onChange={(e) =>
                              updateQuickDraft({ quantity: Number(e.target.value) })
                            }
                            className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-sm text-slate-900"
                          />
                        ) : (
                          <input
                            type="number"
                            min={0}
                            key={`${p._id}-${p.quantity}`}
                            defaultValue={p.quantity}
                            className="w-16 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-sm text-slate-800 focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                            onBlur={(e) => {
                              const qty = Number(e.target.value);
                              if (qty !== p.quantity) {
                                const stock = normalizeStockFields(
                                  { quantity: qty },
                                  { quantity: p.quantity, inStock: p.inStock }
                                );
                                patchProduct(p._id, stock);
                              }
                            }}
                          />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {quickEditRow === p._id ? (
                            <>
                              <IconTooltipButton
                                label="Save"
                                disabled={actionLoading === `save-${p._id}`}
                                onClick={() => saveQuickEdit(p._id)}
                              >
                                {actionLoading === `save-${p._id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </IconTooltipButton>
                              <IconTooltipButton label="Cancel" onClick={cancelQuickEdit}>
                                <X className="h-4 w-4" />
                              </IconTooltipButton>
                            </>
                          ) : (
                            <>
                          <IconTooltipButton label="Edit" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </IconTooltipButton>
                          <IconTooltipButton
                            label="Quick Edit"
                            onClick={() => startQuickEdit(p)}
                          >
                            <Zap className="h-4 w-4" />
                          </IconTooltipButton>
                          <IconTooltipButton label="View" onClick={() => setViewProduct(p)}>
                            <Eye className="h-4 w-4" />
                          </IconTooltipButton>
                          <IconTooltipButton
                            label="Duplicate"
                            disabled={actionLoading === `dup-${p._id}`}
                            onClick={() => handleDuplicate(p._id)}
                          >
                            {actionLoading === `dup-${p._id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </IconTooltipButton>
                          <IconTooltipButton
                            label="Delete"
                            variant="danger"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconTooltipButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <ProductFormModal
        key={editProduct?._id ?? "new-product"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        title={editProduct ? "Edit Product" : "Add New Product"}
        initial={
          editProduct
            ? {
                _id: editProduct._id,
                name: editProduct.name,
                category: editProduct.category,
                subCategory: editProduct.subCategory,
                description: editProduct.description || "",
                price: editProduct.price,
                image: editProduct.image,
                imagePublicId: editProduct.imagePublicId || "",
                quantity: editProduct.quantity,
                inStock: editProduct.inStock,
              }
            : null
        }
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">{viewProduct.name}</h3>
            <p className="text-sm text-slate-500">
              {viewProduct.categoryName} · {viewProduct.subCategoryName}
            </p>
            {viewProduct.image && (
              <Image
                src={viewProduct.image}
                alt={viewProduct.name}
                width={320}
                height={200}
                className="mt-4 max-h-48 w-full rounded-lg object-contain"
                unoptimized
              />
            )}
            <p className="mt-4 text-sm text-slate-600">{viewProduct.description}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">₹ {viewProduct.price}</p>
            <p className="text-sm text-slate-500">
              {viewProduct.inStock ? "In Stock" : "Out of Stock"} · Qty: {viewProduct.quantity}
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewProduct(null);
                  openEdit(viewProduct);
                }}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
