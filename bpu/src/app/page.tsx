"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusPencarian, setStatusPencarian] = useState("idle")
  const [hasilPencarian, setHasilPencarian] = useState<any[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusPencarian("loading")

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .or(`nama_unit_kerja.ilike.%${searchQuery}%,nomor_akun.ilike.%${searchQuery}%`)

    if (error) {
      console.error(error)
      setStatusPencarian("error")
      return
    }

    setHasilPencarian(data || [])
    setStatusPencarian("success")
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 p-6 relative">

      <nav className="w-full max-w-5xl flex justify-end gap-4 mb-8">
        <Link
          href="/admin/login"
          className="px-6 py-2.5 bg-white/60 hover:bg-white text-cyan-700 font-bold rounded-xl shadow-sm backdrop-blur-md transition-all"
        >
          Login Admin
        </Link>
      </nav>

      <div className="w-full max-w-5xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10 transition-all duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Portal Dokumen Pajak
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Temukan bukti potong berdasarkan Nama Unit Kerja atau Nomor Akun
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masukkan kata kunci pencarian..."
            required
            className="flex-1 px-8 py-5 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700 text-lg transition-all placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-10 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-lg shadow-xl transition-all"
          >
            Cari Dokumen
          </button>
        </form>

        {statusPencarian === "loading" ? (
          <div className="text-center text-gray-600 font-medium animate-pulse">Mencari dokumen...</div>
        ) : null}

        {statusPencarian === "error" ? (
          <div className="text-center text-red-500 font-medium">Terjadi kesalahan saat mencari data.</div>
        ) : null}

        {statusPencarian === "success" ? (
          hasilPencarian.length === 0 ? (
            <div className="text-center text-gray-600 font-medium">Dokumen tidak ditemukan.</div>
          ) : (
            <div className="overflow-x-auto mt-6 bg-white/50 rounded-2xl p-4 shadow-sm border border-white/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300/50">
                    <th className="p-4 text-gray-700 font-semibold">Nomor Referensi</th>
                    <th className="p-4 text-gray-700 font-semibold">Unit Kerja</th>
                    <th className="p-4 text-gray-700 font-semibold">Nomor Akun</th>
                    <th className="p-4 text-gray-700 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {hasilPencarian.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-200/50 hover:bg-white/60 transition-colors">
                      <td className="p-4 text-gray-700">{doc.nomor_referensi}</td>
                      <td className="p-4 text-gray-700">{doc.nama_unit_kerja}</td>
                      <td className="p-4 text-gray-700">{doc.nomor_akun}</td>
                      <td className="p-4 text-center">
                        <a
                          href={doc.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-5 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-xl font-medium transition-colors shadow-md active:scale-95"
                        >
                          Lihat PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </div>
    </main>
  )
}