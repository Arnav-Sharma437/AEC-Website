"use client";

import { useState, FormEvent } from "react";
import { CATEGORIES } from "@/data/categories";

export default function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("Thank you! We will contact you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try WhatsApp or call us directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-primary">
        Send an Enquiry
      </h3>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Name *</span>
        <input
          name="name"
          required
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Phone *</span>
        <input
          name="phone"
          type="tel"
          required
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Product of Interest</span>
        <select
          name="productInterest"
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Message *</span>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-accent py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Submit Enquiry"}
      </button>
      {message && (
        <p
          className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
