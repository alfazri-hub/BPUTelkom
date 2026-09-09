"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { DocumentRecord } from "@/lib/types";
import { Building2, Calendar, ExternalLink, LogIn, Search } from "lucide-react";
import { Eyebrow, Perforation, PortalLogo } from "@/app/components/portal-ui";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusPencarian, setStatusPencarian] = useState("idle");
  const [hasilPencarian, setHasilPencarian] = useState<DocumentRecord[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
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

  return (
    <main className="portal-page">
      <header className="flex items-center justify-between border-b border-[#e7e4dd] px-6 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <PortalLogo />
        </Link>
        <Link href="/login" className="portal-icon-button">
          <LogIn size={15} className="text-[#d93a46]" />
          Login admin
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <section className="py-14 md:py-16">
          <div>
            <div className="flex flex-wrap gap-2">
              <Eyebrow>Dokumen</Eyebrow>
              <Eyebrow>Terpusat</Eyebrow>
              <Eyebrow>Terjaga</Eyebrow>
            </div>
            <h1 className="portal-display mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#10132a] sm:text-5xl">
              Semua bukti potong,
              <br />
              dalam satu pencarian.
            </h1>
          </div>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#75798c]">
            Temukan arsip bukti potong berdasarkan nama unit kerja atau nomor
            akun. Cepat, jelas, dan siap dibuka.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl bg-[#10132a]">
          <div className="p-6 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-white/55">
                  Pencarian arsip
                </p>
                <h2 className="portal-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Cari dokumen pajak
                </h2>
              </div>
              <span className="hidden text-xs font-medium text-white/45 sm:block">
                Nama unit / nomor akun
              </span>
            </div>
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#171b36] px-4 py-3">
                <Search size={17} className="shrink-0 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Unit Finance atau 411128"
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d93a46] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b92d3a]"
              >
                <Search size={16} />
                Cari dokumen
              </button>
            </form>
          </div>
        </section>

        <section className="py-10">
          {statusPencarian === "loading" && (
            <div className="py-12 text-center text-sm font-bold text-[#667085] animate-pulse">
              Mencari dokumen...
            </div>
          )}
          {statusPencarian === "error" && (
            <div className="rounded-3xl bg-[#fff0f1] p-5 text-center text-sm font-bold text-[#c92f3d]">
              Terjadi kesalahan jaringan. Coba lagi.
            </div>
          )}
          {statusPencarian === "success" && hasilPencarian.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center text-sm font-bold text-[#667085] shadow-sm">
              Dokumen tidak ditemukan.
            </div>
          )}
          {statusPencarian === "success" && hasilPencarian.length > 0 && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="portal-display text-lg font-semibold text-[#10132a]">
                  Hasil pencarian
                </h2>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#667085]">
                  {hasilPencarian.length} dokumen
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {hasilPencarian.map((doc) => (
                  <article key={doc.id} className="portal-card group">
                    <Perforation />
                    <div className="portal-card-body">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold text-[#75798c]">
                            <Building2 size={13} />
                            Unit kerja
                          </p>
                          <h3 className="portal-display mt-1.5 text-xl font-bold text-[#10132a]">
                            {doc.nama_unit_kerja}
                          </h3>
                        </div>
                        <span className="rounded bg-[rgba(217,58,70,.14)] px-2 py-0.5 text-xs font-bold text-[#d93a46]">
                          PDF
                        </span>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-6 border-t border-[#e7e4dd] pt-5">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98a2b3]">
                            Nomor akun
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-[#14172b]">
                            {doc.nomor_akun}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98a2b3]">
                            Referensi
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-[#14172b]">
                            {doc.nomor_referensi}
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between border-t border-[#e7e4dd] pt-5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98a2b3]">
                            Tanggal bukti potong
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-[#14172b]">
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
                        <ExternalLink size={14} className="text-[#d93a46]" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
        <footer className="border-t border-[#e7e4dd] py-6 text-center text-xs text-[#75798c]">
          BPU Portal Pajak · Pusat dokumen administrasi
        </footer>
      </div>
    </main>
  );
}
