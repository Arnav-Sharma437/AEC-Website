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
import {
  Package,
  PackageCheck,
  PackageX,
  MessageSquare,
  Inbox,
} from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface CategoryCount {
  slug: string;
  name: string;
  count: number;
}

interface Analytics {
  total: number;
  inStock: number;
  outOfStock: number;
  totalEnquiries: number;
  recentEnquiries: Enquiry[];
  productsByCategory: CategoryCount[];
}

const PIE_COLORS = ["#22c55e", "#ef4444"];

function StatCardSkeleton() {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="mt-4 h-9 w-16 animate-pulse rounded bg-slate-200" />
    </li>
  );
}

function ChartSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-[280px] animate-pulse rounded-lg bg-slate-100" />
    </section>
  );
}

function TableSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="space-y-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </ul>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok || json.error || typeof json.total !== "number") {
          throw new Error(json.error || "Failed to load analytics");
        }
        return {
          total: json.total,
          inStock: json.inStock ?? 0,
          outOfStock: json.outOfStock ?? 0,
          totalEnquiries: json.totalEnquiries ?? 0,
          recentEnquiries: Array.isArray(json.recentEnquiries)
            ? json.recentEnquiries
            : [],
          productsByCategory: Array.isArray(json.productsByCategory)
            ? json.productsByCategory
            : [],
        } satisfies Analytics;
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
        Failed to load analytics. Check your database connection.
      </p>
    );
  }

  const stockData = [
    { name: "In Stock", value: data.inStock },
    { name: "Out of Stock", value: data.outOfStock },
  ];

  const categoryBarData = (data.productsByCategory ?? []).map((c) => {
    const label = c.name || c.slug || "Unknown";
    return {
      name: label.length > 14 ? `${label.slice(0, 12)}…` : label,
      fullName: label,
      count: c.count ?? 0,
    };
  });

  const stockTotal = data.inStock + data.outOfStock;

  const cards = [
    {
      label: "Total Products",
      value: data.total,
      icon: Package,
      iconBg: "bg-slate-900 text-white",
      accent: "border-l-4 border-l-slate-900",
    },
    {
      label: "In Stock",
      value: data.inStock,
      icon: PackageCheck,
      iconBg: "bg-green-100 text-green-700",
      accent: "border-l-4 border-l-green-500",
    },
    {
      label: "Out of Stock",
      value: data.outOfStock,
      icon: PackageX,
      iconBg: "bg-red-100 text-red-700",
      accent: "border-l-4 border-l-red-500",
    },
    {
      label: "Total Enquiries",
      value: data.totalEnquiries,
      icon: MessageSquare,
      iconBg: "bg-amber-100 text-amber-800",
      accent: "border-l-4 border-l-[#D4A843]",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Analytics overview
        </h2>
        <p className="mt-1 text-slate-500">
          Inventory health and recent customer enquiries
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li
            key={card.label}
            className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ${card.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <card.icon className="h-5 w-5" />
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Products per category</h3>
          <p className="mb-4 text-sm text-slate-500">Catalogue breakdown by category</p>
          {categoryBarData.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">No products yet</p>
          ) : !chartsReady ? (
            <div className="h-[280px] animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryBarData} margin={{ bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#D4A843" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Stock distribution</h3>
          <p className="mb-4 text-sm text-slate-500">In stock vs out of stock</p>
          {stockTotal === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">No products yet</p>
          ) : !chartsReady ? (
            <div className="h-[280px] animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {stockData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Recent enquiries</h3>
          <p className="text-sm text-slate-500">Last 10 messages from customers</p>
        </div>
        {(data.recentEnquiries ?? []).length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Inbox className="h-10 w-10 text-slate-300" />
            <p className="font-medium text-slate-700">No enquiries yet</p>
            <p className="max-w-md text-sm text-slate-500">
              New contact form submissions will appear here once saved to the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentEnquiries ?? []).map((e) => (
                  <tr
                    key={e._id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">
                      {new Date(e.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">{e.name}</td>
                    <td className="max-w-md px-6 py-3.5 text-slate-600">
                      <span className="line-clamp-2">{e.message}</span>
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
