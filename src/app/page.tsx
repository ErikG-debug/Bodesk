import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bodesk – Ärendehantering för fastighetsbolag",
  description:
    "Bodesk hjälper fastighetsbolag hantera hyresgästärenden via e-post med AI-assisterad kommunikation och ett enkelt CRM för handläggare.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Bodesk</span>
          <Link
            href="/login"
            className="rounded-lg bg-[#1a6ba8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#155a8f]"
          >
            Logga in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Ärendehantering för fastighetsbolag
        </h1>
        <p className="mb-8 max-w-xl text-lg text-gray-500">
          Hyresgäster mailar er vanliga felanmälningsadress. Bodesk tar hand om
          inkommande ärenden automatiskt — AI samlar in nödvändig information och
          handläggaren tar över när ärendet är klart för åtgärd.
        </p>
        <Link
          href="/login"
          className="rounded-lg bg-[#1a6ba8] px-6 py-3 text-base font-medium text-white transition hover:bg-[#155a8f]"
        >
          Logga in på dashboarden
        </Link>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-gray-900">
            Hur det fungerar
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-2xl">📬</div>
              <h3 className="mb-2 font-semibold text-gray-900">Inkommande mail</h3>
              <p className="text-sm text-gray-500">
                Hyresgästen skickar felanmälan till er befintliga e-postadress.
                Bodesk tar emot den automatiskt via Postmark.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-2xl">🤖</div>
              <h3 className="mb-2 font-semibold text-gray-900">AI hanterar dialogen</h3>
              <p className="text-sm text-gray-500">
                Claude AI klassificerar ärendet, ställer följdfrågor och samlar
                in all information som handläggaren behöver.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-2xl">✅</div>
              <h3 className="mb-2 font-semibold text-gray-900">Handläggaren tar över</h3>
              <p className="text-sm text-gray-500">
                När ärendet är komplett hamnar det i dashboarden för granskning
                och åtgärd av er personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        <Link href="/privacy" className="hover:underline">
          Integritetspolicy
        </Link>
        {" · "}
        <span>© {new Date().getFullYear()} Bodesk</span>
      </footer>
    </main>
  );
}
