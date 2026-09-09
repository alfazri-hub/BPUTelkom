"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("proses");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file);

    if (uploadError) {
      setStatus("gagal");
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
      setStatus("gagal");
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
    <main className="min-h-screen bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="shader-heading text-3xl font-extrabold tracking-tight">
            Input Dokumen Baru
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="shader-button shader-button--light rounded-full px-4 py-2 text-xs"
          >
            Kembali
          </button>
        </div>

        {status === "sukses" && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium border border-green-200">
            Data dan PDF berhasil disimpan!
          </div>
        )}

        {status === "gagal" && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium border border-red-200">
            Terjadi kesalahan saat menyimpan data.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              value={nomorReferensi}
              onChange={(e) => setNomorReferensi(e.target.value)}
              placeholder="Nomor Referensi"
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
            <input
              type="number"
              value={dpp}
              onChange={(e) => setDpp(e.target.value)}
              placeholder="Dasar Pengenaan Pajak"
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
            <input
              type="number"
              value={pph}
              onChange={(e) => setPph(e.target.value)}
              placeholder="PPh Terhutang"
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
            <input
              type="text"
              value={unitKerja}
              onChange={(e) => setUnitKerja(e.target.value)}
              placeholder="Nama Unit Kerja"
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
            <input
              type="text"
              value={nomorAkun}
              onChange={(e) => setNomorAkun(e.target.value)}
              placeholder="Nomor Akun"
              required
              className="shader-control w-full rounded-full px-5 py-3.5 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="shader-label px-2 font-medium">
              Upload File PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              required
              className="shader-file w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === "proses"}
            className="shader-button shader-button--accent mt-6 w-full rounded-full px-6 py-4 text-sm text-white disabled:opacity-50"
          >
            {status === "proses" ? "Menyimpan..." : "Simpan Data & Upload PDF"}
          </button>
        </form>
      </div>
    </main>
  );
}
