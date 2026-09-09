import { useEffect, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { DocumentRecord } from "@/lib/types";

type DocumentField =
  | "nomor_referensi"
  | "tanggal_bukti_potong"
  | "dasar_pengenaan_pajak"
  | "pph_terhutang"
  | "nama_unit_kerja"
  | "nomor_akun";

type DocumentInputType = "text" | "date" | "number";

const fields: Array<[string, DocumentField, DocumentInputType]> = [
  ["Nomor referensi", "nomor_referensi", "text"],
  ["Tanggal bukti potong", "tanggal_bukti_potong", "date"],
  ["Nama unit kerja", "nama_unit_kerja", "text"],
  ["Nomor akun", "nomor_akun", "text"],
  ["Dasar pengenaan pajak (Rp)", "dasar_pengenaan_pajak", "number"],
  ["PPh terhutang (Rp)", "pph_terhutang", "number"],
];

type EditDocumentModalProps = {
  document: DocumentRecord;
  status: string;
  onChange: (document: DocumentRecord) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function EditDocumentModal({
  document,
  status,
  onChange,
  onClose,
  onSubmit,
}: EditDocumentModalProps) {
  const isSaving = status === "menyimpan";

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="record-in w-full max-w-2xl">
        <div className="rubric-rule" />
        <form
          onSubmit={onSubmit}
          className="sheet border-t-0 p-6 sm:p-7"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-document-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="edit-document-title"
                className="text-xl font-semibold tracking-tight text-ink"
              >
                Koreksi data dokumen
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                Berkas PDF tidak ikut berubah. Untuk mengganti berkas, hapus
                dokumen ini lalu input ulang.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup tanpa menyimpan"
              className="shrink-0 border border-rule p-2 text-ink-2 transition-colors hover:border-ink hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map(([label, field, type], index) => (
              <div key={field}>
                <label htmlFor={`edit-${field}`} className="field-label">
                  {label}
                </label>
                <input
                  id={`edit-${field}`}
                  type={type}
                  autoFocus={index === 0}
                  min={type === "number" ? "0" : undefined}
                  value={document[field]}
                  onChange={(event) =>
                    onChange({
                      ...document,
                      [field]:
                        type === "number"
                          ? Number(event.target.value)
                          : event.target.value,
                    })
                  }
                  className={`field-box ${field === "nama_unit_kerja" ? "" : "num"}`}
                  required
                />
              </div>
            ))}
          </div>

          {status && !isSaving && (
            <div className="notice notice-error mt-5">
              <p className="font-semibold">Perubahan gagal disimpan.</p>
              <p className="mt-1">{status}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving && (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              )}
              {isSaving ? "Menyimpan" : "Simpan perubahan"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-quiet">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
