"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { DocumentRecord } from "@/lib/types";
import {
  Building2,
  Calendar,
  ExternalLink,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Perforation } from "@/app/components/portal-ui";
import { PortalNavigation } from "@/app/components/navigation-bar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusPencarian, setStatusPencarian] = useState("idle");
  const [hasilPencarian, setHasilPencarian] = useState<DocumentRecord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setStatusPencarian("loading");

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .or(
        `nama_unit_kerja.ilike.%${searchQuery}%,nomor_akun.ilike.%${searchQuery}%`,
      );

    if (error) {
      console.error(error);
      setStatusPencarian("error");
      return;
    }

    setHasilPencarian((data || []) as DocumentRecord[]);
    setStatusPencarian("success");
  };

  const isLoading = statusPencarian === "loading";

  return (
    <main className="portal-page">
      <PortalNavigation />

      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <section className="py-14 md:py-16">
          <div>
            <h1 className="portal-display mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-portal-navy sm:text-5xl">
              Semua bukti potong,
              <br />
              dalam satu pencarian.
            </h1>
          </div>
          <p className="mt-5 max-w-lg text-base leading-7 text-portal-muted">
            Temukan arsip bukti potong berdasarkan nama unit kerja atau nomor
            akun. Cepat, jelas, dan siap dibuka.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl bg-portal-navy">
          <div className="p-6 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-portal-paper/55">
                  Pencarian arsip
                </p>
                <h2 className="portal-display mt-2 text-2xl font-semibold text-portal-paper sm:text-3xl">
                  Cari dokumen pajak
                </h2>
              </div>
              <span className="hidden text-xs font-medium text-portal-paper/45 sm:block">
                Nama unit / nomor akun
              </span>
            </div>
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-portal-navy2 px-4 py-3 ring-1 ring-inset ring-portal-paper/0 transition focus-within:ring-portal-paper/15">
                <Search size={17} className="shrink-0 text-portal-paper/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Unit Finance atau 411128"
                  required
                  className="w-full bg-transparent text-sm text-portal-paper outline-none placeholder:text-portal-paper/45"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                    className="shrink-0 text-portal-paper/40 transition hover:text-portal-paper/80"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-portal-red px-6 py-3 text-sm font-semibold text-portal-paper transition hover:bg-portal-red disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Cari dokumen
              </button>
            </form>
          </div>
        </section>

        <section className="py-10">
          {statusPencarian === "loading" && (
            <div className="py-12 text-center text-sm font-bold text-portal-muted animate-pulse">
              Mencari dokumen...
            </div>
          )}
          {statusPencarian === "error" && (
            <div className="rounded-3xl bg-portal-red-soft p-5 text-center text-sm font-bold text-portal-red">
              Terjadi kesalahan jaringan. Coba lagi.
            </div>
          )}
          {statusPencarian === "success" && hasilPencarian.length === 0 && (
            <div className="rounded-3xl bg-portal-paper p-10 text-center text-sm font-bold text-portal-muted shadow-sm">
              Dokumen tidak ditemukan.
            </div>
          )}
          {statusPencarian === "success" && hasilPencarian.length > 0 && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="portal-display text-lg font-semibold text-portal-navy">
                  Hasil pencarian
                </h2>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-portal-muted">
                  {hasilPencarian.length} dokumen
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {hasilPencarian.map((doc) => (
                  <article
                    key={doc.id}
                    className="portal-card group transition hover:border-portal-red/40 hover:shadow-sm"
                  >
                    <Perforation />
                    <div className="portal-card-body">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold text-portal-muted">
                            <Building2 size={13} />
                            Unit kerja
                          </p>
                          <h3 className="portal-display mt-1.5 text-xl font-bold text-portal-navy">
                            {doc.nama_unit_kerja}
                          </h3>
                        </div>
                        <span className="rounded bg-portal-red-soft-strong px-2 py-0.5 text-xs font-bold text-portal-red">
                          PDF
                        </span>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-6 border-t border-portal-line pt-5">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-portal-muted">
                            Nomor akun
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-portal-ink">
                            {doc.nomor_akun}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-portal-muted">
                            Referensi
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-portal-ink">
                            {doc.nomor_referensi}
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between border-t border-portal-line pt-5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-portal-muted">
                            Tanggal bukti potong
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-portal-ink">
                            <Calendar size={14} />
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(
                              new Date(`${doc.tanggal_bukti_potong}T00:00:00`),
                            )}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portal-icon-button mt-5"
                      >
                        Buka dokumen{" "}
                        <ExternalLink size={14} className="text-portal-red" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
        <footer className="border-t border-portal-line py-6 text-center text-xs text-portal-muted">
          BPU Portal Pajak · Pusat dokumen administrasi
        </footer>
      </div>
    </main>
  );
}
