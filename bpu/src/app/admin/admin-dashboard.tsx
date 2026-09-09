"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hasAdminSession } from "@/lib/admin-session";
import { PortalShell } from "@/app/components/app-shell";

export default function AdminDashboard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace("/login");
      return;
    }
    setAllowed(true);

    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setTotal(count ?? 0));
  }, [router]);

  if (!allowed) return null;

  return (
    <PortalShell admin>
      <main className="shell page-body flex-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Ruang admin
        </h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Kelola arsip bukti potong pajak yang tampil di halaman pencarian.
        </p>

        <div className="sheet mt-8 divide-y divide-rule-soft">
          <Link
            href="/admin/input"
            className="group flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-[#faf9f6]"
          >
            <span>
              <span className="block text-base font-semibold text-ink">
                Input dokumen baru
              </span>
              <span className="mt-1 block text-sm text-ink-2">
                Isi data administrasi pajak dan unggah berkas PDF bukti potong.
              </span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-ink-2 transition-colors group-hover:text-rubric"
            />
          </Link>

          <Link
            href="/admin/data"
            className="group flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-[#faf9f6]"
          >
            <span>
              <span className="block text-base font-semibold text-ink">
                Kelola data
              </span>
              <span className="mt-1 block text-sm text-ink-2">
                Periksa, koreksi, buka berkas, atau hapus dokumen tersimpan
                {total !== null && (
                  <>
                    {" — "}
                    <span className="num font-medium text-ink">{total}</span>{" "}
                    dokumen dalam arsip
                  </>
                )}
                .
              </span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-ink-2 transition-colors group-hover:text-rubric"
            />
          </Link>
        </div>
      </main>
    </PortalShell>
  );
}
