"use client";

import { useEffect, useState } from "react";

export function SignatureEditor() {
  const [signature, setSignature] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSignature(data.signature ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <div className="h-32 animate-pulse rounded-md bg-gray-100" />;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-1 font-semibold text-gray-900">E-postsignatur</h2>
      <p className="mb-4 text-sm text-gray-500">
        Läggs automatiskt till i slutet av alla svar, både AI:ns och manuella svar.
      </p>
      <textarea
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        rows={4}
        placeholder={"Med vänlig hälsning,\nFastighetsbolaget AB\ntel: 08-xxx xx xx"}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1a6ba8] focus:ring-2 focus:ring-[#1a6ba8]/20"
      />
      <div className="mt-3 flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600">Sparad!</span>}
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-[#1a6ba8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#155a8f]"
        >
          Spara signatur
        </button>
      </div>
    </div>
  );
}
