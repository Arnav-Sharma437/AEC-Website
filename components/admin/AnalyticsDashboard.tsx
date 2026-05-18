"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, Package, Inbox, MessageSquare } from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  productInterest?: string;
  message: string;
  createdAt: string;
}

interface Analytics {
  total: number;
  inStock: number;
  outOfStock: number;
  totalEnquiries: number;
  recentEnquiries: Enquiry[];
}

const COLORS = ["#D4A843", "#94a3b8"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Failed to load analytics. Check your database connection.
      </p>
    );
  }

  const stockData = [
    { name: "In Stock", value: data.inStock },
    { name: "Out of Stock", value: data.outOfStock },
  ];

  const barData = [
    { name: "In Stock", count: data.inStock },
    { name: "Out of Stock", count: data.outOfStock },
  ];

  const cards = [
    {
      label: "Total Products",
      value: data.total,
      icon: Package,
      color: "bg-slate-900 text-white",
    },
    {
      label: "In Stock",
      value: data.inStock,
      icon: Package,
      color: "bg-green-50 text-green-800 border-green-200",
    },
    {
      label: "Out of Stock",
      value: data.outOfStock,
      icon: Inbox,
      color: "bg-red-50 text-red-800 border-red-200",
    },
    {
      label: "Enquiries",
      value: data.totalEnquiries,
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-900 border-amber-200",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of inventory and customer enquiries</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li
            key={card.label}
            className={`rounded-xl border p-6 shadow-sm ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-80">{card.label}</p>
              <card.icon className="h-5 w-5 opacity-60" />
            </div>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold text-slate-900">Stock levels</h2>
          <p className="mb-4 text-sm text-slate-500">In stock vs out of stock</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1C2B3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold text-slate-900">Stock distribution</h2>
          <p className="mb-4 text-sm text-slate-500">Share of available inventory</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {stockData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent enquiries</h2>
          <p className="text-sm text-slate-500">Latest messages stored in MongoDB</p>
        </div>
        {data.recentEnquiries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <MessageSquare className="h-10 w-10 text-slate-300" />
            <p className="font-medium text-slate-700">No enquiries yet</p>
            <p className="max-w-md text-sm text-slate-500">
              Contact form submissions via Formspree are separate unless synced to the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Interest</th>
                  <th className="px-6 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEnquiries.map((e) => (
                  <tr key={e._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">{e.name}</td>
                    <td className="px-6 py-3">{e.phone}</td>
                    <td className="px-6 py-3">{e.productInterest || "—"}</td>
                    <td className="max-w-xs truncate px-6 py-3 text-slate-600">
                      {e.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
