"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { clearAdminSession, hasAdminSession } from "@/lib/admin-session";
import { LogOut, Plus } from "lucide-react";
import { Eyebrow, Perforation } from "@/app/components/portal-ui";

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
    <main className="portal-page min-h-screen bg-[#f7f6f2] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-3 border-b border-gray-100 pb-6">
          <div>
            <Eyebrow>Ruang admin</Eyebrow>
            <h1 className="portal-display mt-3 text-3xl font-semibold text-[#10132a]">
              Input dokumen baru
            </h1>
            <p className="mt-2 text-sm text-[#75798c]">
              Unggah bukti potong dan lengkapi data administrasi.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/data")}
              className="portal-icon-button rounded-full border border-[#e7e4dd] bg-white px-3 py-2 text-xs"
            >
              <Plus size={14} />
              Kelola data
            </button>
            <button
              onClick={() => {
                clearAdminSession();
                router.replace("/login");
              }}
              className="portal-icon-button rounded-full border border-[#e7e4dd] bg-white px-3 py-2 text-xs"
            >
              <LogOut size={14} className="text-[#d93a46]" />
              Keluar
            </button>
          </div>
          <button onClick={() => router.push("/admin")} className="hidden">
            Kembali
          </button>
        </div>

        {status === "sukses" ? (
          <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm font-bold text-emerald-700">
            Data dan PDF berhasil disimpan ke sistem!
          </div>
        ) : null}

        {status === "gagal_upload" ? (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">
            Gagal mengunggah file PDF. Silakan coba lagi.
            {errorMessage ? (
              <p className="mt-2 text-xs font-medium text-slate-500">
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        {status === "gagal_database" ? (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">
            Gagal menyimpan teks ke database. Pastikan Nomor Referensi unik.
            {errorMessage ? (
              <p className="mt-2 text-xs font-medium text-slate-500">
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

          <div className="flex flex-col gap-2 rounded-xl border border-[#e7e4dd] bg-[#f7f6f2] p-4 md:col-span-2">
            <label className="portal-label">Upload File PDF</label>
            <p className="mb-2 text-sm text-[#75798c]">
              Pilih dokumen fisik bukti potong pajak dalam format PDF.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              required
              className="shader-file w-full rounded-xl border border-[#e7e4dd] bg-white px-4 py-3 text-sm text-[#75798c]"
            />
          </div>

          <button
            type="submit"
            disabled={status === "proses"}
            className="mt-1 w-full rounded-xl bg-[#d93a46] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b92d3a] disabled:opacity-50 md:col-span-2"
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
