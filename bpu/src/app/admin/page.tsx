"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { hasAdminSession } from "@/lib/admin-session";
import { Plus } from "lucide-react";
import { Eyebrow, Perforation } from "@/app/components/portal-ui";
import { PortalNavigation } from "@/app/components/navigation-bar";

export default function InputData() {
  const router = useRouter();
  const [nomorReferensi, setNomorReferensi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [dpp, setDpp] = useState("");
  const [pph, setPph] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [nomorAkun, setNomorAkun] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!hasAdminSession()) router.replace("/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("proses");
    setErrorMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file);

    if (uploadError) {
      setStatus("gagal_upload");
      setErrorMessage(uploadError.message);
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
      setStatus("gagal_database");
      setErrorMessage(insertError.message);
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
  };

  return (
    <main className="portal-page min-h-screen bg-portal-paper2">
      <PortalNavigation admin />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-start justify-between gap-3 border-b border-portal-line pb-6">
          <div>
            <Eyebrow>Ruang admin</Eyebrow>
            <h1 className="portal-display mt-3 text-3xl font-semibold text-portal-navy">
              Input dokumen baru
            </h1>
            <p className="mt-2 text-sm text-portal-muted">
              Unggah bukti potong dan lengkapi data administrasi.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/data")}
              className="portal-icon-button rounded-full border border-portal-line bg-portal-paper px-3 py-2 text-xs"
            >
              <Plus size={14} />
              Kelola data
            </button>
          </div>
          <button onClick={() => router.push("/admin")} className="hidden">
            Kembali
          </button>
        </div>

        {status === "sukses" ? (
          <div className="mb-8 rounded-3xl border border-portal-line bg-portal-paper2 p-5 text-center text-sm font-bold text-portal-ink">
            Data dan PDF berhasil disimpan ke sistem!
          </div>
        ) : null}

        {status === "gagal_upload" ? (
          <div className="mb-8 rounded-3xl border border-portal-line bg-portal-red-soft p-5 text-center text-sm font-bold text-portal-red">
            Gagal mengunggah file PDF. Silakan coba lagi.
            {errorMessage ? (
              <p className="mt-2 text-xs font-medium text-portal-muted">
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        {status === "gagal_database" ? (
          <div className="mb-8 rounded-3xl border border-portal-line bg-portal-red-soft p-5 text-center text-sm font-bold text-portal-red">
            Gagal menyimpan teks ke database. Pastikan Nomor Referensi unik.
            {errorMessage ? (
              <p className="mt-2 text-xs font-medium text-portal-muted">
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="portal-card">
          <Perforation />
          <div className="portal-card-body grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="portal-label">Nomor Referensi</label>
              <input
                type="text"
                value={nomorReferensi}
                onChange={(e) => setNomorReferensi(e.target.value)}
                placeholder="Contoh: REF-2026-001"
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="portal-label">Tanggal Bukti Potong</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="portal-label">Dasar Pengenaan Pajak (Rp)</label>
              <input
                type="number"
                value={dpp}
                onChange={(e) => setDpp(e.target.value)}
                placeholder="0"
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="portal-label">PPh Terhutang (Rp)</label>
              <input
                type="number"
                value={pph}
                onChange={(e) => setPph(e.target.value)}
                placeholder="0"
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="portal-label">Nama Unit Kerja</label>
              <input
                type="text"
                value={unitKerja}
                onChange={(e) => setUnitKerja(e.target.value)}
                placeholder="Masukkan nama unit"
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="portal-label">Nomor Akun</label>
              <input
                type="text"
                value={nomorAkun}
                onChange={(e) => setNomorAkun(e.target.value)}
                placeholder="Masukkan nomor akun"
                required
                className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-portal-line bg-portal-paper2 p-4 md:col-span-2">
            <label className="portal-label">Upload File PDF</label>
            <p className="mb-2 text-sm text-portal-muted">
              Pilih dokumen fisik bukti potong pajak dalam format PDF.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              required
              className="shader-file w-full rounded-xl border border-portal-line bg-portal-paper px-4 py-3 text-sm text-portal-muted"
            />
          </div>

          <button
            type="submit"
            disabled={status === "proses"}
            className="mt-1 w-full rounded-xl bg-portal-red px-6 py-3 text-sm font-semibold text-portal-paper transition hover:bg-portal-red disabled:opacity-50 md:col-span-2"
          >
            {status === "proses"
              ? "Menyimpan Data..."
              : "Simpan Data & Upload PDF"}
          </button>
        </form>
      </div>
    </main>
  );
}
