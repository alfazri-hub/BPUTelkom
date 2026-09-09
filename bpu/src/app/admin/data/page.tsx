"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { hasAdminSession } from "@/lib/admin-session";
import type { DocumentRecord } from "@/lib/types";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { PortalShell } from "@/app/components/app-shell";
import { EditDocumentModal } from "@/app/admin/data/edit-document-modal";

export default function KelolaData() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(
    null,
  );
  const [editStatus, setEditStatus] = useState("");

  const loadDocuments = useCallback(async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDocuments(data as DocumentRecord[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
    loadDocuments();
  }, [router, loadDocuments]);

  const handleDelete = async (doc: DocumentRecord) => {
    const confirmed = window.confirm(
      `Hapus dokumen ${doc.nomor_referensi} milik ${doc.nama_unit_kerja}? Data ini tidak dapat dikembalikan.`,
    );
    if (!confirmed) return;

    await supabase.from("documents").delete().eq("id", doc.id);
    await loadDocuments();
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDocument) return;

    setEditStatus("menyimpan");
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
    await loadDocuments();
  };

  if (!allowed) return null;

  return (
    <PortalShell admin>
      <main className="shell page-body flex-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Kelola data
        </h1>
        <p className="mt-1.5 text-sm text-ink-2">
          {isLoading ? (
            "Memuat arsip dokumen…"
          ) : (
            <>
              <span className="num font-semibold text-ink">
                {documents.length}
              </span>{" "}
              dokumen tersimpan, terbaru di urutan teratas.
            </>
          )}
        </p>

        {isLoading ? (
          <div className="sheet mt-8 px-6 py-12 text-center text-sm font-medium text-ink-2">
            Memuat data…
          </div>
        ) : documents.length === 0 ? (
          <div className="sheet mt-8 px-6 py-12 text-center">
            <p className="text-base font-semibold text-ink">
              Arsip masih kosong
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-2">
              Belum ada dokumen yang tercatat.{" "}
              <Link
                href="/admin/input"
                className="font-semibold text-ink underline underline-offset-2"
              >
                Input dokumen pertama
              </Link>{" "}
              agar bisa ditemukan lewat halaman pencarian.
            </p>
          </div>
        ) : (
          <div className="sheet mt-8 overflow-x-auto">
            <table className="ledger responsive-ledger">
              <thead>
                <tr>
                  <th scope="col">Unit kerja</th>
                  <th scope="col">Nomor akun</th>
                  <th scope="col">Nomor referensi</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col" className="col-num">
                    DPP
                  </th>
                  <th scope="col" className="col-num">
                    PPh terhutang
                  </th>
                  <th scope="col">Berkas</th>
                  <th scope="col">
                    <span className="sr-only">Tindakan</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td data-label="Unit kerja" className="font-semibold text-ink">
                      {doc.nama_unit_kerja}
                    </td>
                    <td data-label="Nomor akun" className="num">
                      {doc.nomor_akun}
                    </td>
                    <td data-label="Nomor referensi" className="num">
                      {doc.nomor_referensi}
                    </td>
                    <td data-label="Tanggal">
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
                    <td data-label="Tindakan">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDocument(doc);
                            setEditStatus("");
                          }}
                          className="btn btn-quiet px-3 py-1.5 text-[0.8125rem]"
                        >
                          <Pencil size={13} aria-hidden="true" />
                          Koreksi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc)}
                          className="btn btn-danger-quiet px-3 py-1.5 text-[0.8125rem]"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editingDocument && (
        <EditDocumentModal
          document={editingDocument}
          status={editStatus}
          onChange={setEditingDocument}
          onClose={() => setEditingDocument(null)}
          onSubmit={handleUpdate}
        />
      )}
    </PortalShell>
  );
}
