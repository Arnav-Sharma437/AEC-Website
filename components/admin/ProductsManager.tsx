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
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import ProductFormModal, { ProductFormData } from "./ProductFormModal";

interface Product {
  _id: string;
  name: string;
  category: string;
  categoryName: string;
  price: string;
  image: string;
  inStock: boolean;
  quantity: number;
  description?: string;
  imagePublicId?: string;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function patchProduct(id: string, body: Record<string, unknown>) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function handleSave(data: ProductFormData) {
    if (data._id) {
      await fetch(`/api/admin/products/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  async function handleDuplicate(id: string) {
    await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
    load();
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalogue</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-primary"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {quickEditId === p._id ? (
                        <input
                          defaultValue={p.name}
                          className="rounded border px-2 py-1"
                          onBlur={(e) => {
                            patchProduct(p._id, { name: e.target.value });
                            setQuickEditId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                          autoFocus
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="px-4 py-3">{p.categoryName}</td>
                    <td className="px-4 py-3">
                      {quickEditId === `${p._id}-price` ? (
                        <input
                          defaultValue={p.price}
                          className="w-20 rounded border px-2 py-1"
                          onBlur={(e) => {
                            patchProduct(p._id, { price: e.target.value });
                            setQuickEditId(null);
                          }}
                          autoFocus
                        />
                      ) : (
                        `₹ ${p.price}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          patchProduct(p._id, { inStock: !p.inStock })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          p.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.quantity}
                        className="w-16 rounded border px-2 py-1"
                        onBlur={(e) =>
                          patchProduct(p._id, {
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Quick Edit"
                          onClick={() => setQuickEditId(p._id)}
                          className="rounded p-1.5 text-xs font-medium hover:bg-gray-100"
                        >
                          Quick
                        </button>
                        <button
                          type="button"
                          title="View"
                          onClick={() => setViewProduct(p)}
                          className="rounded p-1.5 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Duplicate"
                          onClick={() => handleDuplicate(p._id)}
                          className="rounded p-1.5 hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(p._id)}
                          className="rounded p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ProductFormModal
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

      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">{viewProduct.name}</h3>
            <p className="text-sm text-gray-500">{viewProduct.categoryName}</p>
            <p className="mt-4 text-sm">{viewProduct.description}</p>
            <p className="mt-2 font-semibold">₹ {viewProduct.price}</p>
            <p className="text-sm">
              {viewProduct.inStock ? "In Stock" : "Out of Stock"} · Qty:{" "}
              {viewProduct.quantity}
            </p>
            <button
              type="button"
              onClick={() => setViewProduct(null)}
              className="mt-4 rounded-lg border px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
