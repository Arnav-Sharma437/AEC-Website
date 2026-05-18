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
} from "recharts";

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

const COLORS = ["#D4A843", "#6B7A8D"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-red-500">Failed to load analytics.</p>;
  }

  const stockData = [
    { name: "In Stock", value: data.inStock },
    { name: "Out of Stock", value: data.outOfStock },
  ];

  const barData = [
    { name: "Total", count: data.total },
    { name: "In Stock", count: data.inStock },
    { name: "Out of Stock", count: data.outOfStock },
    { name: "Enquiries", count: data.totalEnquiries },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your store and enquiries</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Products", value: data.total },
          { label: "In Stock", value: data.inStock },
          { label: "Out of Stock", value: data.outOfStock },
          { label: "Total Enquiries", value: data.totalEnquiries },
        ].map((card) => (
          <li
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Inventory Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1C2B3A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Stock Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stockData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
        </div>
        {data.recentEnquiries.length === 0 ? (
          <p className="p-6 text-gray-500">
            No enquiries in MongoDB yet. Formspree submissions are separate unless
            synced.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Interest</th>
                  <th className="px-6 py-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEnquiries.map((e) => (
                  <tr key={e._id} className="border-t border-gray-100">
                    <td className="px-6 py-3 whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">{e.name}</td>
                    <td className="px-6 py-3">{e.phone}</td>
                    <td className="px-6 py-3">{e.productInterest || "—"}</td>
                    <td className="max-w-xs truncate px-6 py-3">{e.message}</td>
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
