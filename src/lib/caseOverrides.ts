import { useEffect, useState } from "react";
import type { Urgency } from "@/lib/types";

const MANUAL_KEY = "bodesk:manualCases";
const URGENCY_KEY = "bodesk:urgencyOverrides";
const EVT = "bodesk:caseOverrides";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVT));
}

export function markManual(id: string) {
  const ids = readJSON<string[]>(MANUAL_KEY, []);
  if (!ids.includes(id)) writeJSON(MANUAL_KEY, [...ids, id]);
}

export function unmarkManual(id: string) {
  const ids = readJSON<string[]>(MANUAL_KEY, []);
  writeJSON(MANUAL_KEY, ids.filter((x) => x !== id));
}

export function useManualCases(): Set<string> {
  const [ids, setIds] = useState<string[]>(() => readJSON<string[]>(MANUAL_KEY, []));
  useEffect(() => {
    const update = () => setIds(readJSON<string[]>(MANUAL_KEY, []));
    window.addEventListener(EVT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return new Set(ids);
}

export function setUrgencyOverride(id: string, urgency: Urgency) {
  const map = readJSON<Record<string, Urgency>>(URGENCY_KEY, {});
  map[id] = urgency;
  writeJSON(URGENCY_KEY, map);
}

export function useUrgencyOverrides(): Record<string, Urgency> {
  const [map, setMap] = useState<Record<string, Urgency>>(() =>
    readJSON<Record<string, Urgency>>(URGENCY_KEY, {}),
  );
  useEffect(() => {
    const update = () => setMap(readJSON<Record<string, Urgency>>(URGENCY_KEY, {}));
    window.addEventListener(EVT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return map;
}
