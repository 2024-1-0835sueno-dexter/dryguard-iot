"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resolveApiBase } from "@/lib/apiBase";
import { setAdminName, setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const apiBase = resolveApiBase();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { token: string; admin: { fullName: string } };
      setToken(data.token);
      setAdminName(data.admin.fullName);
      router.replace("/");
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] p-6 text-slate-900">
      <div className="mx-auto mt-20 w-full max-w-md rounded-xl border-2 border-slate-900 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm dg-muted">Sign in to access DryGuard Admin.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
