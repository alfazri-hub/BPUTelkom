"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { hasAdminSession } from "@/lib/admin-session";
import type { DocumentRecord } from "@/lib/types";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Eyebrow, Perforation } from "@/app/components/portal-ui";

export default function KelolaData() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(
    null,
  );
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace("/login");
      return;
    }

    const fetchDocuments = async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setDocuments(data as DocumentRecord[]);
      setIsLoading(false);
    };

    fetchDocuments();
  }, [router]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    await supabase.from("documents").delete().eq("id", id);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDocuments(data as DocumentRecord[]);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDocument) return;

    setEditStatus("Menyimpan perubahan...");
    const { error } = await supabase
      .from("documents")
      .update({
        nomor_referensi: editingDocument.nomor_referensi,
        tanggal_bukti_potong: editingDocument.tanggal_bukti_potong,
        dasar_pengenaan_pajak: Number(editingDocument.dasar_pengenaan_pajak),
        pph_terhutang: Number(editingDocument.pph_terhutang),
        nama_unit_kerja: editingDocument.nama_unit_kerja,
        nomor_akun: editingDocument.nomor_akun,
      })
      .eq("id", editingDocument.id);

    if (error) {
      setEditStatus(error.message);
      return;
    }

    setEditingDocument(null);
    setEditStatus("");
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDocuments(data as DocumentRecord[]);
  };

  return (
    <main className="portal-page min-h-screen bg-[#f7f6f2] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Eyebrow>Ruang admin</Eyebrow>
            <h1 className="portal-display mt-3 text-3xl font-semibold text-[#10132a]">
              Kelola Dokumen
            </h1>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="portal-icon-button rounded-full border border-[#e7e4dd] px-4 py-2 text-xs"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center font-medium text-slate-500 animate-pulse">
            Memuat data...
          </div>
        ) : (
          <div className="space-y-3">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <article key={doc.id} className="portal-card">
                  <Perforation />
                  <div className="portal-card-body">
                    <p className="flex items-center gap-2 text-xs font-semibold text-[#75798c]">
                      <Building2 size={13} /> Unit kerja
                    </p>
                    <h2 className="portal-display mt-1.5 text-lg font-bold text-[#10132a]">
                      {doc.nama_unit_kerja}
                    </h2>
                    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#75798c]">
                      <span>
                        {doc.nomor_referensi} · {doc.nomor_akun}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-[#75798c]">
                      <Calendar size={14} />
                      Tanggal bukti potong:{" "}
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(
                        new Date(`${doc.tanggal_bukti_potong}T00:00:00`),
                      )}
                    </p>
                    <div className="mt-5 flex items-center gap-2 border-t border-[#e7e4dd] pt-5">
                      <a
                        href={doc.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portal-icon-button mr-auto text-sm"
                      >
                        <ExternalLink size={14} className="text-[#d93a46]" />{" "}
                        Buka File
                      </a>
                      <button
                        onClick={() => {
                          setEditingDocument(doc);
                          setEditStatus("");
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-[#d93a46] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#b92d3a]"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center gap-1.5 rounded-full border border-[#e7e4dd] px-3.5 py-2 text-xs font-semibold text-[#14172b] transition hover:border-[#d93a46] hover:text-[#d93a46]"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Belum ada data dokumen.
              </div>
            )}
          </div>
        )}

        {editingDocument ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
            <form
              onSubmit={handleUpdate}
              className="w-full max-w-lg rounded-2xl border border-[#e7e4dd] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e43d4b]">
                    Edit dokumen
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Perbarui data
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingDocument(null)}
                  className="rounded-full border border-[#e7e4dd] p-2 text-[#75798c] hover:border-[#d93a46] hover:text-[#d93a46]"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["Nomor Referensi", "nomor_referensi", "text"],
                    ["Tanggal Bukti Potong", "tanggal_bukti_potong", "date"],
                    ["DPP", "dasar_pengenaan_pajak", "number"],
                    ["PPh Terhutang", "pph_terhutang", "number"],
                    ["Nama Unit Kerja", "nama_unit_kerja", "text"],
                    ["Nomor Akun", "nomor_akun", "text"],
                  ] as const
                ).map(([label, field, type]) => (
                  <label
                    key={field}
                    className="flex flex-col gap-2 text-sm font-bold text-slate-700"
                  >
                    {label}
                    <input
                      type={type}
                      value={editingDocument[field]}
                      onChange={(event) =>
                        setEditingDocument({
                          ...editingDocument,
                          [field]:
                            type === "number"
                              ? Number(event.target.value)
                              : event.target.value,
                        })
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#e43d4b] focus:ring-4 focus:ring-[#e43d4b]/10"
                      required
                    />
                  </label>
                ))}
              </div>
              {editStatus ? (
                <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-600">
                  {editStatus}
                </p>
              ) : null}
              <button
                type="submit"
                className="mt-6 w-full rounded-2xl bg-[#e43d4b] px-5 py-4 text-sm font-black text-white transition hover:bg-[#c92f3d]"
              >
                Simpan perubahan
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
