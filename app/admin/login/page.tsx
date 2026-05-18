"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetSecret, setResetSecret] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: username.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(
        "Invalid username or password. Use Forgot Password if you have a reset secret key."
      );
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          newPassword,
          secretKey: resetSecret,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setResetMessage("Password updated. You can sign in now.");
      setForgotOpen(false);
      setNewPassword("");
      setResetSecret("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1419] px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-[#1a2430] p-8 shadow-xl"
        >
          <h1 className="mb-2 font-display text-2xl font-bold text-white">AEC Admin</h1>
          <p className="mb-8 text-sm text-gray-400">Sign in to manage your website</p>

          {error && (
            <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          {resetMessage && (
            <p className="mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
              {resetMessage}
            </p>
          )}

          <label className="mb-4 block text-sm text-gray-300">
            Username
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1419] px-3 py-2 text-white"
            />
          </label>

          <label className="mb-2 block text-sm text-gray-300">
            Password
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0f1419] py-2 pl-3 pr-10 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <button
            type="button"
            onClick={() => setForgotOpen((o) => !o)}
            className="mb-6 text-sm text-accent hover:underline"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-primary disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {forgotOpen && (
          <form
            onSubmit={handleReset}
            className="mt-4 rounded-xl border border-white/10 bg-[#1a2430] p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-2 text-white">
              <KeyRound className="h-5 w-5 text-accent" />
              <h2 className="font-semibold">Reset Password</h2>
            </div>
            <p className="mb-4 text-xs text-gray-400">
              Requires the server reset secret (ADMIN_RESET_SECRET). Updates password in MongoDB
              directly.
            </p>
            <label className="mb-3 block text-sm text-gray-300">
              Reset secret key
              <input
                type="password"
                required
                value={resetSecret}
                onChange={(e) => setResetSecret(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1419] px-3 py-2 text-white"
              />
            </label>
            <label className="mb-4 block text-sm text-gray-300">
              New password
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1419] px-3 py-2 text-white"
              />
            </label>
            <button
              type="submit"
              disabled={resetLoading || !username.trim()}
              className="w-full rounded-lg border border-accent/50 py-2.5 text-sm font-semibold text-accent disabled:opacity-50"
            >
              {resetLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
