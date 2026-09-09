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

        const fileExt = file.name.split('.').pop();
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

        const { error: insertError } = await supabase
            .from("documents")
            .insert([
                {
                    nomor_referensi: nomorReferensi,
                    tanggal_bukti_potong: tanggal,
                    dasar_pengenaan_pajak: Number(dpp),
                    pph_terhutang: Number(pph),
                    nama_unit_kerja: unitKerja,
                    nomor_akun: nomorAkun,
                    pdf_url: publicUrlData.publicUrl
                }
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
        <main className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 p-6">
            <div className="w-full max-w-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Input Dokumen Baru</h1>
                    <button
                        onClick={() => router.push("/admin")}
                        className="px-4 py-2 bg-white/60 rounded-xl text-gray-700 font-semibold hover:bg-white shadow-sm transition-all"
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
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                        <input
                            type="number"
                            value={dpp}
                            onChange={(e) => setDpp(e.target.value)}
                            placeholder="Dasar Pengenaan Pajak"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                        <input
                            type="number"
                            value={pph}
                            onChange={(e) => setPph(e.target.value)}
                            placeholder="PPh Terhutang"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                        <input
                            type="text"
                            value={unitKerja}
                            onChange={(e) => setUnitKerja(e.target.value)}
                            placeholder="Nama Unit Kerja"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                        <input
                            type="text"
                            value={nomorAkun}
                            onChange={(e) => setNomorAkun(e.target.value)}
                            placeholder="Nomor Akun"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-gray-700 font-medium px-2">Upload File PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            required
                            className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 shadow-inner text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-100 file:text-fuchsia-700 hover:file:bg-fuchsia-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "proses"}
                        className="mt-6 px-8 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-lg shadow-xl transition-all disabled:opacity-50"
                    >
                        {status === "proses" ? "Menyimpan..." : "Simpan Data & Upload PDF"}
                    </button>
                </form>

            </div>
        </main>
    );
}