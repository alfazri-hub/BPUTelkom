"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function KelolaData() {
    const router = useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setDocuments(data);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
        if (!confirmDelete) return;

        await supabase.from("documents").delete().eq("id", id);
        fetchData();
    };

    return (
        <main className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 p-6">
            <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10">

                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Kelola Dokumen</h1>
                    <button
                        onClick={() => router.push("/admin")}
                        className="px-4 py-2 bg-white/60 rounded-xl text-gray-700 font-semibold hover:bg-white shadow-sm transition-all"
                    >
                        Kembali
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-600 font-medium animate-pulse py-10">Memuat data...</div>
                ) : (
                    <div className="overflow-x-auto bg-white/50 rounded-2xl p-4 shadow-sm border border-white/60">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300/50">
                                    <th className="p-4 text-gray-700 font-semibold">No. Ref</th>
                                    <th className="p-4 text-gray-700 font-semibold">Unit Kerja</th>
                                    <th className="p-4 text-gray-700 font-semibold">Nomor Akun</th>
                                    <th className="p-4 text-gray-700 font-semibold">PDF</th>
                                    <th className="p-4 text-gray-700 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data dokumen.</td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="border-b border-gray-200/50 hover:bg-white/60 transition-colors">
                                            <td className="p-4 text-gray-700">{doc.nomor_referensi}</td>
                                            <td className="p-4 text-gray-700">{doc.nama_unit_kerja}</td>
                                            <td className="p-4 text-gray-700">{doc.nomor_akun}</td>
                                            <td className="p-4">
                                                <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline font-medium">
                                                    Buka File
                                                </a>
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl font-medium shadow-sm transition-all">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-xl font-medium shadow-sm transition-all"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </main>
    );
}