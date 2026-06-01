import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header
        className="sticky top-0 z-10 border-b border-blue-200"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px), linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)",
          backgroundSize: "20px 20px, 100% 100%",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <span className="text-lg font-bold text-white drop-shadow">PropDesk</span>
          </Link>
          <nav className="flex gap-6 text-sm text-blue-100">
            <Link href="/dashboard" className="transition hover:text-white">
              Ärenden
            </Link>
            <Link href="/dashboard/settings" className="transition hover:text-white">
              Inställningar
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
