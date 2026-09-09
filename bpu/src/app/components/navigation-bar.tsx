"use client";

import Link from "next/link";
import { Database, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-session";
import { PortalLogo } from "@/app/components/portal-ui";

const navigationItems = ["Dokumen", "Terpusat", "Terjaga"];

type PortalNavigationProps = {
  admin?: boolean;
};

export function PortalNavigation({ admin = false }: PortalNavigationProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/login");
  };

  return (
    <header className="portal-nav-shell">
      <nav className="portal-nav" aria-label="Navigasi utama">
        <Link
          href="/"
          className="portal-nav-brand"
          aria-label="BPU Portal Pajak"
        >
          <PortalLogo />
        </Link>

        {admin ? (
          <div className="portal-nav-links" aria-label="Navigasi ruang admin">
            <Link href="/admin" className="portal-nav-link">
              <LayoutDashboard size={14} aria-hidden="true" />
              Ruang admin
            </Link>
            <Link href="/admin/data" className="portal-nav-link">
              <Database size={14} aria-hidden="true" />
              Kelola data
            </Link>
          </div>
        ) : (
          <div className="portal-nav-links" aria-label="Informasi portal">
            {navigationItems.map((item) => (
              <span key={item} className="portal-nav-link">
                {item}
              </span>
            ))}
          </div>
        )}

        {admin ? (
          <button
            type="button"
            onClick={handleLogout}
            className="portal-nav-login"
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Keluar</span>
          </button>
        ) : (
          <Link href="/login" className="portal-nav-login">
            <LogIn size={15} aria-hidden="true" />
            <span>Login admin</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
