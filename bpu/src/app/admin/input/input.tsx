"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hasAdminSession } from "@/lib/admin-session";
import { PortalShell } from "@/app/components/app-shell";

const safeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);

export default function InputData() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [nomorReferensi, setNomorReferensi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [dpp, setDpp] = useState("");
  const [pph, setPph] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [nomorAkun, setNomorAkun] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("proses");

    const fileName = `${Date.now()}-${safeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      setStatus("gagal-unggah");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("documents").insert([
      {
        nomor_referensi: nomorReferensi,
        tanggal_bukti_potong: tanggal,
        dasar_pengenaan_pajak: Number(dpp),
        pph_terhutang: Number(pph),
        nama_unit_kerja: unitKerja,
        nomor_akun: nomorAkun,
        pdf_url: publicUrlData.publicUrl,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      setStatus("gagal-simpan");
      return;
    }

    setStatus("sukses");
    setNomorReferensi("");
    setTanggal("");
    setDpp("");
    setPph("");
    setUnitKerja("");
    setNomorAkun("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!allowed) return null;

  const isSaving = status === "proses";

  return (
    <PortalShell admin>
      <main className="shell page-body flex-1">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Input dokumen baru
          </h1>
          <p className="mt-1.5 text-sm text-ink-2">
            Seluruh kolom wajib diisi. Dokumen langsung muncul di halaman
            pencarian setelah tersimpan.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
          {status === "sukses" && (
            <div className="notice notice-ok mb-6">
              <p className="font-semibold">Dokumen tersimpan.</p>
              <p className="mt-1">
                Berkas dan datanya sudah masuk arsip.{" "}
                <Link
                  href="/admin/data"
                  className="font-semibold underline underline-offset-2"
                >
                  Periksa di Kelola data
                </Link>
                , atau lanjutkan mengisi dokumen berikutnya.
              </p>
            </div>
          )}

          {status === "gagal-unggah" && (
            <div className="notice notice-error mb-6">
              <p className="font-semibold">Berkas PDF gagal diunggah.</p>
              <p className="mt-1">
                Data belum tersimpan. Pastikan ukuran berkas wajar dan koneksi
                stabil, lalu kirim ulang formulir ini.
              </p>
            </div>
          )}

          {status === "gagal-simpan" && (
            <div className="notice notice-error mb-6">
              <p className="font-semibold">Data dokumen gagal disimpan.</p>
              <p className="mt-1">
                Berkas sudah terunggah, tetapi datanya belum tercatat. Periksa
                kembali isian tanggal dan nominal, lalu kirim ulang.
              </p>
            </div>
          )}

          <fieldset className="sheet p-6">
            <legend className="px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
              Identitas dokumen
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nomor-referensi" className="field-label">
                  Nomor referensi
                </label>
                <input
                  id="nomor-referensi"
                  type="text"
                  value={nomorReferensi}
                  onChange={(e) => setNomorReferensi(e.target.value)}
                  required
                  className="field-box num"
                />
              </div>
              <div>
                <label htmlFor="tanggal" className="field-label">
                  Tanggal bukti potong
                </label>
                <input
                  id="tanggal"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="field-box"
                />
              </div>
              <div>
                <label htmlFor="unit-kerja" className="field-label">
                  Nama unit kerja
                </label>
                <input
                  id="unit-kerja"
                  type="text"
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                  required
                  className="field-box"
                />
              </div>
              <div>
                <label htmlFor="nomor-akun" className="field-label">
                  Nomor akun
                </label>
                <input
                  id="nomor-akun"
                  type="text"
                  value={nomorAkun}
                  onChange={(e) => setNomorAkun(e.target.value)}
                  required
                  className="field-box num"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="sheet mt-5 p-6">
            <legend className="px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
              Nilai pajak
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="dpp" className="field-label">
                  Dasar pengenaan pajak (Rp)
                </label>
                <input
                  id="dpp"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={dpp}
                  onChange={(e) => setDpp(e.target.value)}
                  required
                  className="field-box num"
                />
              </div>
              <div>
                <label htmlFor="pph" className="field-label">
                  PPh terhutang (Rp)
                </label>
                <input
                  id="pph"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={pph}
                  onChange={(e) => setPph(e.target.value)}
                  required
                  className="field-box num"
                />
              </div>
            </div>
            <p className="mt-3 text-[0.8125rem] text-ink-2">
              Masukkan angka tanpa titik atau koma pemisah ribuan.
            </p>
          </fieldset>

          <fieldset className="sheet mt-5 p-6">
            <legend className="px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
              Berkas bukti potong
            </legend>
            <label htmlFor="berkas" className="field-label">
              Unggah berkas PDF
            </label>
            <input
              id="berkas"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
              className="field-box cursor-pointer py-2.5 text-sm file:mr-3 file:border file:border-rule file:bg-desk file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-semibold file:text-ink hover:file:border-ink"
            />
            <p className="mt-3 text-[0.8125rem] text-ink-2">
              Hanya berkas PDF. Berkas inilah yang dibuka pengguna dari halaman
              pencarian.
            </p>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Upload size={16} aria-hidden="true" />
              )}
              {isSaving ? "Menyimpan" : "Simpan dokumen"}
            </button>
            <Link href="/admin" className="btn btn-quiet">
              Batal
            </Link>
          </div>
          </form>
        </div>
      </main>
    </PortalShell>
  );
}
