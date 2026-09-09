"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { DocumentRecord } from "@/lib/types";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { ExternalLink, Loader2, Search, X } from "lucide-react";
import { PortalShell } from "@/app/components/app-shell";

type SearchState = "idle" | "loading" | "error" | "done";

// PostgREST parses commas and parentheses as filter syntax inside `.or()`.
const stripFilterSyntax = (value: string) => value.replace(/[,()%\\]/g, " ").trim();

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<DocumentRecord[]>([]);
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
    const keyword = stripFilterSyntax(searchQuery);
    if (!keyword) return;

    setState("loading");
    setSubmittedQuery(keyword);

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .or(
        `nama_unit_kerja.ilike.%${keyword}%,nomor_akun.ilike.%${keyword}%`,
      )
      .order("tanggal_bukti_potong", { ascending: false });

    if (error) {
      console.error(error);
      setState("error");
      return;
    }

    setResults((data || []) as DocumentRecord[]);
    setState("done");
  };

  const isLoading = state === "loading";

  return (
    <PortalShell>
      <main className="shell page-body flex-1">
        <section className="sheet p-6 md:p-8">
          <h1 className="max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-ink md:text-[1.75rem]">
            Cari arsip bukti potong berdasarkan unit kerja atau nomor akun
          </h1>

          <form onSubmit={handleSearch} className="mt-6">
            <label htmlFor="kata-kunci" className="field-label">
              Nama unit kerja atau nomor akun
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2"
                />
                <input
                  id="kata-kunci"
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Unit Kerja atau Nomor Akun"
                  required
                  className="field-box py-3.5 pl-10 pr-10 text-base"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Kosongkan kata kunci"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 transition-colors hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary sm:px-8"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={16} aria-hidden="true" />
                )}
                {isLoading ? "Mencari" : "Cari dokumen"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6" aria-live="polite">
          {state === "idle" && (
            <div className="sheet px-6 py-12 text-center">
              <p className="text-base font-semibold text-ink">
                Belum ada pencarian
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-2">
                Masukkan <span className="font-medium text-ink">Unit Kerja</span>{" "}
                atau <span className="font-medium text-ink">Nomor Akun</span>.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="sheet px-6 py-12 text-center text-sm font-medium text-ink-2">
              Mencari dokumen…
            </div>
          )}

          {state === "error" && (
            <div className="notice notice-error">
              <p className="font-semibold">Pencarian gagal dijalankan.</p>
              <p className="mt-1">
                Sambungan ke basis data arsip terputus. Periksa koneksi jaringan
                Anda, lalu tekan Cari dokumen sekali lagi.
              </p>
            </div>
          )}

          {state === "done" && results.length === 0 && (
            <div className="sheet px-6 py-12 text-center">
              <p className="text-base font-semibold text-ink">
                Tidak ada dokumen yang cocok dengan “{submittedQuery}”
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-2">
                Periksa kembali ejaan nama unit kerja, atau coba cari memakai
                nomor akun yang lebih pendek.
              </p>
            </div>
          )}

          {state === "done" && results.length > 0 && (
            <>
              <p className="mb-3 text-[0.8125rem] text-ink-2">
                <span className="num font-semibold text-ink">
                  {results.length}
                </span>{" "}
                dokumen ditemukan untuk “{submittedQuery}”
              </p>
              <div className="sheet overflow-x-auto">
                <table className="ledger responsive-ledger">
                  <thead>
                    <tr>
                      <th scope="col">Unit kerja</th>
                      <th scope="col">Nomor akun</th>
                      <th scope="col">Nomor referensi</th>
                      <th scope="col">Tanggal bukti potong</th>
                      <th scope="col" className="col-num">
                        DPP
                      </th>
                      <th scope="col" className="col-num">
                        PPh terhutang
                      </th>
                      <th scope="col">Berkas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className="record-in"
                        style={{ animationDelay: `${Math.min(index, 12) * 28}ms` }}
                      >
                        <td data-label="Unit kerja" className="font-semibold text-ink">
                          {doc.nama_unit_kerja}
                        </td>
                        <td data-label="Nomor akun" className="num">
                          {doc.nomor_akun}
                        </td>
                        <td data-label="Nomor referensi" className="num">
                          {doc.nomor_referensi}
                        </td>
                        <td data-label="Tanggal bukti potong">
                          {formatTanggal(doc.tanggal_bukti_potong)}
                        </td>
                        <td data-label="DPP" className="num col-num">
                          {formatRupiah(doc.dasar_pengenaan_pajak)}
                        </td>
                        <td data-label="PPh terhutang" className="num col-num">
                          {formatRupiah(doc.pph_terhutang)}
                        </td>
                        <td data-label="Berkas">
                          <a
                            href={doc.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-doc"
                          >
                            Buka PDF
                            <ExternalLink size={13} aria-hidden="true" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>

    </PortalShell>
  );
}
