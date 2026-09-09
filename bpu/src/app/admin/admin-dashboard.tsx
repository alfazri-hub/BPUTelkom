"use client";

import { useRouter } from "next/navigation";
import { FileText, PlusCircle } from "lucide-react";
import { Eyebrow } from "@/app/components/portal-ui";
import { PortalNavigation } from "@/app/components/navigation-bar";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <main className="portal-page min-h-screen bg-portal-paper2">
      <PortalNavigation admin />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10">
          <Eyebrow>Ruang admin</Eyebrow>
          <h1 className="portal-display mt-3 text-3xl font-semibold text-portal-navy sm:text-4xl">
            Dashboard pengelola
          </h1>
          <p className="mt-2 text-sm text-portal-muted">
            Pilih menu di navbar atau kartu di bawah untuk mengelola dokumen
            pajak.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/admin/input")}
            className="portal-card group p-7 text-left transition hover:-translate-y-1 hover:border-portal-red hover:shadow-lg"
          >
            <PlusCircle
              className="mb-6 text-portal-red"
              size={32}
              strokeWidth={1.5}
            />
            <h2 className="portal-display text-xl font-semibold text-portal-navy">
              Input dokumen baru
            </h2>
            <p className="mt-2 text-sm leading-6 text-portal-muted">
              Unggah bukti potong pajak dan lengkapi data administrasi.
            </p>
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/data")}
            className="portal-card group p-7 text-left transition hover:-translate-y-1 hover:border-portal-red hover:shadow-lg"
          >
            <FileText
              className="mb-6 text-portal-red"
              size={32}
              strokeWidth={1.5}
            />
            <h2 className="portal-display text-xl font-semibold text-portal-navy">
              Kelola data
            </h2>
            <p className="mt-2 text-sm leading-6 text-portal-muted">
              Lihat, edit, buka, atau hapus dokumen yang tersimpan.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
