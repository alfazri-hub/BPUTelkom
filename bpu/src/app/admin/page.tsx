"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function InputData() {
    const router = useRouter()
    const [nomorReferensi, setNomorReferensi] = useState("")
    const [tanggal, setTanggal] = useState("")
    const [dpp, setDpp] = useState("")
    const [pph, setPph] = useState("")
    const [unitKerja, setUnitKerja] = useState("")
    const [nomorAkun, setNomorAkun] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setStatus("proses")

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from("pdfs")
            .upload(fileName, file)

        if (uploadError) {
            setStatus("gagal_upload")
            return
        }

        const { data: publicUrlData } = supabase.storage
            .from("pdfs")
            .getPublicUrl(fileName)

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
            ])

        if (insertError) {
            setStatus("gagal_database")
            return
        }

        setStatus("sukses")
        setNomorReferensi("")
        setTanggal("")
        setDpp("")
        setPph("")
        setUnitKerja("")
        setNomorAkun("")
        setFile(null)
    }

    return (
        <main className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 p-6">
            <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10">

                <div className="flex justify-between items-center mb-8 border-b border-gray-300/50 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Input Dokumen Baru</h1>
                        <p className="text-gray-600 mt-2">Unggah bukti potong dan lengkapi data administrasi.</p>
                    </div>
                    <button
                        onClick={() => router.push("/admin")}
                        className="px-5 py-2.5 bg-white/80 rounded-xl text-gray-700 font-bold hover:bg-white shadow-sm transition-all"
                    >
                        Kembali
                    </button>
                </div>

                {status === "sukses" ? (
                    <div className="mb-8 p-5 bg-green-100 text-green-800 rounded-2xl text-center font-bold border border-green-200 shadow-sm">
                        Data dan PDF berhasil disimpan ke sistem!
                    </div>
                ) : null}

                {status === "gagal_upload" ? (
                    <div className="mb-8 p-5 bg-red-100 text-red-700 rounded-2xl text-center font-bold border border-red-200 shadow-sm">
                        Gagal mengunggah file PDF. Silakan coba lagi.
                    </div>
                ) : null}

                {status === "gagal_database" ? (
                    <div className="mb-8 p-5 bg-red-100 text-red-700 rounded-2xl text-center font-bold border border-red-200 shadow-sm">
                        Gagal menyimpan teks ke database. Pastikan Nomor Referensi unik.
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">Nomor Referensi</label>
                            <input
                                type="text"
                                value={nomorReferensi}
                                onChange={(e) => setNomorReferensi(e.target.value)}
                                placeholder="Contoh: REF-2026-001"
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">Tanggal Bukti Potong</label>
                            <input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">Dasar Pengenaan Pajak (Rp)</label>
                            <input
                                type="number"
                                value={dpp}
                                onChange={(e) => setDpp(e.target.value)}
                                placeholder="0"
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">PPh Terhutang (Rp)</label>
                            <input
                                type="number"
                                value={pph}
                                onChange={(e) => setPph(e.target.value)}
                                placeholder="0"
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">Nama Unit Kerja</label>
                            <input
                                type="text"
                                value={unitKerja}
                                onChange={(e) => setUnitKerja(e.target.value)}
                                placeholder="Masukkan nama unit"
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-bold px-2">Nomor Akun</label>
                            <input
                                type="text"
                                value={nomorAkun}
                                onChange={(e) => setNomorAkun(e.target.value)}
                                placeholder="Masukkan nomor akun"
                                required
                                className="px-6 py-4 rounded-2xl bg-white/80 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 bg-white/50 p-6 rounded-2xl border border-white/60">
                        <label className="text-gray-800 font-bold">Upload File PDF</label>
                        <p className="text-gray-600 text-sm mb-2">Pilih dokumen fisik bukti potong pajak dalam format PDF.</p>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            required
                            className="w-full text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-cyan-100 file:text-cyan-700 hover:file:bg-cyan-200 transition-all cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "proses"}
                        className="mt-6 px-8 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-extrabold text-lg shadow-xl transition-all disabled:opacity-50"
                    >
                        {status === "proses" ? "Menyimpan Data..." : "Simpan Data & Upload PDF"}
                    </button>
                </form>

            </div>
        </main>
    )
}