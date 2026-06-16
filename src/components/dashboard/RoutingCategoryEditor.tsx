"use client";

import { useState } from "react";
import {
  useRoutingCategories,
  addRoutingCategory,
  updateRoutingCategory,
  deleteRoutingCategory,
  type RoutingCategory,
} from "@/lib/categories";

export function RoutingCategoryEditor() {
  const cats = useRoutingCategories();
  const [editing, setEditing] = useState<RoutingCategory | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  function openEdit(cat: RoutingCategory) {
    setEditing(cat);
    setName(cat.name);
    setEmail(cat.email);
  }

  function saveEdit() {
    if (!editing || !name.trim() || !email.trim()) return;
    updateRoutingCategory(editing.id, { name: name.trim(), email: email.trim() });
    setEditing(null);
  }

  function handleAdd() {
    if (!name.trim() || !email.trim()) return;
    addRoutingCategory(name.trim(), email.trim());
    setName("");
    setEmail("");
    setAddOpen(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Ärenderouting</h2>
          <p className="text-sm text-gray-500">
            Konfigurera vilka kategorier som skickas till vilken e-postadress.
          </p>
        </div>
        <button
          onClick={() => { setAddOpen(true); setName(""); setEmail(""); }}
          className="rounded-md bg-[#1a6ba8] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#155a8f]"
        >
          + Lägg till
        </button>
      </div>

      <div className="space-y-2">
        {cats.map((cat) =>
          editing?.id === cat.id ? (
            <div key={cat.id} className="flex gap-2 rounded-lg border border-[#1a6ba8]/30 bg-[#1a6ba8]/5 p-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kategorinamn"
                className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#1a6ba8]"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e-post"
                className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#1a6ba8]"
              />
              <button
                onClick={saveEdit}
                className="rounded-md bg-[#1a6ba8] px-3 py-1.5 text-sm font-medium text-white"
              >
                Spara
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
              >
                Avbryt
              </button>
            </div>
          ) : (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                <span className="ml-3 text-sm text-gray-400">{cat.email}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-200"
                >
                  Redigera
                </button>
                <button
                  onClick={() => deleteRoutingCategory(cat.id)}
                  className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ),
        )}

        {addOpen && (
          <div className="flex gap-2 rounded-lg border border-[#1a6ba8]/30 bg-[#1a6ba8]/5 p-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kategorinamn"
              className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#1a6ba8]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-post"
              className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-[#1a6ba8]"
            />
            <button
              onClick={handleAdd}
              className="rounded-md bg-[#1a6ba8] px-3 py-1.5 text-sm font-medium text-white"
            >
              Lägg till
            </button>
            <button
              onClick={() => setAddOpen(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
            >
              Avbryt
            </button>
          </div>
        )}

        {cats.length === 0 && !addOpen && (
          <p className="py-4 text-center text-sm text-gray-400">
            Inga kategorier konfigurerade ännu.
          </p>
        )}
      </div>
    </div>
  );
}
