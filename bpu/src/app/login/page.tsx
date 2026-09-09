"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { setAdminSession } from "@/lib/admin-session";
import { PortalMark } from "@/app/components/portal-ui";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username.trim())
      .eq("password", password);

    if (error) {
      console.error("Login query failed:", error);
      setStatus("connection-error");
      return;
    }

    if (!data || data.length === 0) {
      setStatus("error");
      return;
    }

    setAdminSession();
    router.push("/admin");
  };

  const isLoading = status === "loading";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rubric-rule" />
        <div className="sheet border-t-0 px-7 py-8">
          <div className="flex flex-col items-center">
            <PortalMark />
            <h1 className="mt-5 text-lg font-semibold tracking-tight text-ink">
              Masuk ruang admin
            </h1>
          </div>

          <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-5">
            <div>
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="field-box"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="field-box pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {status === "connection-error" && (
              <p className="notice notice-error">
                Tidak dapat terhubung ke basis data. Periksa koneksi, lalu coba
                lagi.
              </p>
            )}

            {status === "error" && (
              <p className="notice notice-error">
                Username atau password salah. Periksa kembali penulisannya.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading && (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              )}
              {isLoading ? "Memeriksa" : "Masuk"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-rubric-deep"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Kembali ke pencarian
        </Link>
      </div>
    </main>
  );
}
