import { useEffect, useState } from "react";

const KEY = "bodesk:closedCases";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("bodesk:closedCases"));
}

export function closeCase(id: string) {
  const ids = read();
  if (!ids.includes(id)) write([...ids, id]);
}

export function reopenCase(id: string) {
  write(read().filter((x) => x !== id));
}

export function useClosedCases(): Set<string> {
  const [ids, setIds] = useState<string[]>(() => read());
  useEffect(() => {
    const update = () => setIds(read());
    window.addEventListener("bodesk:closedCases", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("bodesk:closedCases", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return new Set(ids);
}
