import { useEffect, useState } from "react";

export interface RoutingCategory {
  id: string;
  name: string;
  email: string;
}

const KEY = "bodesk:routingCategories";
const EVENT = "bodesk:routingCategories";

const DEFAULTS: RoutingCategory[] = [
  { id: "default-1", name: "Vattenläckor", email: "anders@gmail.com" },
  { id: "default-2", name: "Köksproblem", email: "kok@foretag.se" },
];

function read(): RoutingCategory[] {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULTS;
    return parsed;
  } catch {
    return DEFAULTS;
  }
}

function write(cats: RoutingCategory[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cats));
  window.dispatchEvent(new Event(EVENT));
}

export function addRoutingCategory(name: string, email: string) {
  const cats = read();
  const cat: RoutingCategory = {
    id: Math.random().toString(36).slice(2),
    name: name.trim(),
    email: email.trim(),
  };
  write([...cats, cat]);
}

export function updateRoutingCategory(id: string, patch: Partial<Omit<RoutingCategory, "id">>) {
  write(read().map((c) => (c.id === id ? { ...c, ...patch } : c)));
}

export function deleteRoutingCategory(id: string) {
  write(read().filter((c) => c.id !== id));
}

export function useRoutingCategories(): RoutingCategory[] {
  const [cats, setCats] = useState<RoutingCategory[]>(() => read());
  useEffect(() => {
    const update = () => setCats(read());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return cats;
}
