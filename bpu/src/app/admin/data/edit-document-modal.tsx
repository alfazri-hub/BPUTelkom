import type { FormEvent } from "react";
import { X } from "lucide-react";
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
  ["Nomor Referensi", "nomor_referensi", "text"],
  ["Tanggal Bukti Potong", "tanggal_bukti_potong", "date"],
  ["DPP", "dasar_pengenaan_pajak", "number"],
  ["PPh Terhutang", "pph_terhutang", "number"],
  ["Nama Unit Kerja", "nama_unit_kerja", "text"],
  ["Nomor Akun", "nomor_akun", "text"],
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
  return (
    <div
      className="portal-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-document-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-portal-red">
              Edit dokumen
            </p>
            <h2
              id="edit-document-title"
              className="mt-2 text-2xl font-black text-portal-navy"
            >
              Perbarui data
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup popup edit dokumen"
            className="rounded-full border border-portal-line p-2 text-portal-muted hover:border-portal-red hover:text-portal-red"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, field, type]) => (
            <label
              key={field}
              className="flex flex-col gap-2 text-sm font-bold text-portal-ink"
            >
              {label}
              <input
                type={type}
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
                className="rounded-2xl border border-portal-line bg-portal-paper2 px-4 py-3 text-sm text-portal-ink outline-none focus:border-portal-red focus:ring-4 focus:ring-portal-red/10"
                required
              />
            </label>
          ))}
        </div>

        {status ? (
          <p className="mt-4 rounded-2xl bg-portal-red-soft p-3 text-sm font-medium text-portal-red">
            {status}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-portal-red px-5 py-4 text-sm font-black text-portal-paper transition hover:bg-portal-red"
        >
          Simpan perubahan
        </button>
      </form>
    </div>
  );
}
