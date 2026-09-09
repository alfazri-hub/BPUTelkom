"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Database,
  FilePlus2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Search,
} from "lucide-react";
import { clearAdminSession } from "@/lib/admin-session";
import { PortalLogo } from "@/app/components/portal-ui";

const adminLinks = [
  { href: "/admin", label: "Ruang admin", icon: LayoutDashboard },
  { href: "/admin/input", label: "Input dokumen", icon: FilePlus2 },
  { href: "/admin/data", label: "Kelola data", icon: Database },
];

const publicLinks = [{ href: "/", label: "Pencarian dokumen", icon: Search }];

type PortalShellProps = {
  admin?: boolean;
  children: ReactNode;
};

export function PortalShell({ admin = false, children }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const links = admin ? adminLinks : publicLinks;

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex shrink-0 flex-col lg:min-h-screen lg:w-64 lg:flex-row">
        <div className="hidden w-[3px] bg-rubric lg:block" />

        <div className="flex flex-1 flex-col border-b border-rule bg-sheet lg:border-b-0 lg:border-r">
          <div className="px-5 py-4 lg:py-5">
            <Link href="/" aria-label="Beranda Portal Bukti Potong Pajak">
              <PortalLogo />
            </Link>
          </div>

          <nav
            aria-label={admin ? "Navigasi admin" : "Navigasi portal"}
            className="flex gap-1 overflow-x-auto border-t border-rule-soft px-3 py-3 lg:flex-col lg:overflow-visible"
          >
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 whitespace-nowrap px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-rubric-wash font-semibold text-rubric-deep"
                      : "text-ink-2 hover:bg-[#faf9f6] hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 ${isActive ? "bg-rubric" : "bg-transparent"}`}
                  />
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-rule-soft px-3 py-3 lg:mt-auto">
            {admin ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:bg-[#faf9f6] hover:text-rubric-deep"
              >
                <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:bg-[#faf9f6] hover:text-rubric-deep"
              >
                <LogIn size={16} strokeWidth={1.75} aria-hidden="true" />
                Masuk admin
              </Link>
            )}
          </div>
        </div>

        <div className="rubric-rule lg:hidden" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
