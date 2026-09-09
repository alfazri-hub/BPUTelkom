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
} from "lucide-react";
import { Eyebrow, Perforation } from "@/app/components/portal-ui";
import { PortalNavigation } from "@/app/components/navigation-bar";
import { EditDocumentModal } from "@/app/admin/data/edit-document-modal";

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
    <main className="portal-page min-h-screen bg-portal-paper2">
      <PortalNavigation admin />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Eyebrow>Ruang admin</Eyebrow>
            <h1 className="portal-display mt-3 text-3xl font-semibold text-portal-navy">
              Kelola Dokumen
            </h1>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="portal-icon-button rounded-full border border-portal-line px-4 py-2 text-xs"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center font-medium text-portal-muted animate-pulse">
            Memuat data...
          </div>
        ) : (
          <div className="space-y-3">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <article key={doc.id} className="portal-card">
                  <Perforation />
                  <div className="portal-card-body">
                    <p className="flex items-center gap-2 text-xs font-semibold text-portal-muted">
                      <Building2 size={13} /> Unit kerja
                    </p>
                    <h2 className="portal-display mt-1.5 text-lg font-bold text-portal-navy">
                      {doc.nama_unit_kerja}
                    </h2>
                    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-portal-muted">
                      <span>
                        {doc.nomor_referensi} · {doc.nomor_akun}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-portal-muted">
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
                    <div className="mt-5 flex items-center gap-2 border-t border-portal-line pt-5">
                      <a
                        href={doc.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portal-icon-button mr-auto text-sm"
                      >
                        <ExternalLink size={14} className="text-portal-red" />{" "}
                        Buka File
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDocument(doc);
                          setEditStatus("");
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-portal-red px-3.5 py-2 text-xs font-semibold text-portal-paper transition hover:bg-portal-red"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center gap-1.5 rounded-full border border-portal-line px-3.5 py-2 text-xs font-semibold text-portal-ink transition hover:border-portal-red hover:text-portal-red"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-portal-line bg-portal-paper2 p-8 text-center text-sm text-portal-muted">
                Belum ada data dokumen.
              </div>
            )}
          </div>
        )}

        {editingDocument ? (
          <EditDocumentModal
            document={editingDocument}
            status={editStatus}
            onChange={setEditingDocument}
            onClose={() => setEditingDocument(null)}
            onSubmit={handleUpdate}
          />
        ) : null}
      </div>
    </main>
  );
}
