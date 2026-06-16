"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FieldValuesList } from "@/components/cases/FieldValuesList";
import type { CaseStatus } from "@prisma/client";

interface CaseDetail {
  id: string;
  status: CaseStatus;
  subject: string;
  residentEmail: string;
  residentName: string | null;
  summary: string | null;
  escalationNote: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    fields: { key: string; label: string; required: boolean }[];
  } | null;
  property: { name: string } | null;
  fieldValues: { field: { key: string; label: string }; value: string }[];
  messages: { id: string; fromResident: boolean; body: string; sentAt: string }[];
}

type Sender = "resident" | "bo";

type ThreadMessage = {
  id: string;
  sender: Sender;
  body: string;
  sentAt: string;
};

const SENDER_META = {
  resident: {
    label: "Hyresgäst",
    side: "left" as const,
    bubble: "bg-gray-100 text-gray-800",
    meta: "text-gray-400",
  },
  bo: {
    label: "Bo / Handläggare",
    side: "right" as const,
    bubble: "bg-[#1a6ba8] text-white",
    meta: "text-blue-200",
  },
};

const TRANSITIONS: Partial<
  Record<CaseStatus, { label: string; next: CaseStatus; primary: boolean }[]>
> = {
  READY_FOR_REVIEW: [
    { label: "Ta över", next: "IN_PROGRESS", primary: true },
    { label: "Avsluta ärende", next: "CLOSED", primary: false },
  ],
  ESCALATED: [
    { label: "Ta över", next: "IN_PROGRESS", primary: true },
    { label: "Avsluta ärende", next: "CLOSED", primary: false },
  ],
  WAITING_FOR_RESIDENT: [
    { label: "Ta över", next: "IN_PROGRESS", primary: true },
    { label: "Avsluta ärende", next: "CLOSED", primary: false },
  ],
  COLLECTING_INFORMATION: [
    { label: "Ta över", next: "IN_PROGRESS", primary: true },
  ],
  IN_PROGRESS: [
    { label: "Avsluta ärende", next: "CLOSED", primary: true },
  ],
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const fetchCase = useCallback(async () => {
    const res = await fetch(`/api/cases/${id}`);
    if (res.ok) setCaseData(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  async function updateStatus(next: CaseStatus) {
    setUpdating(true);
    await fetch(`/api/cases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (next === "CLOSED") {
      router.push("/dashboard?filter=avslutade");
    } else {
      await fetchCase();
    }
    setUpdating(false);
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Laddar ärende…</div>;
  }

  if (!caseData) {
    return <div className="py-20 text-center text-gray-500">Ärendet hittades inte.</div>;
  }

  const isClosed = caseData.status === "CLOSED" || caseData.status === "ARCHIVED";
  const transitions = TRANSITIONS[caseData.status] ?? [];

  const threadMessages: ThreadMessage[] = caseData.messages.map((m) => ({
    id: m.id,
    sender: m.fromResident ? "resident" : "bo",
    body: m.body,
    sentAt: m.sentAt,
  }));

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        ← Ärenden
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Konversation */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{caseData.subject}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {caseData.residentName ?? caseData.residentEmail}
                  {caseData.residentName && (
                    <span className="ml-1 text-gray-400">({caseData.residentEmail})</span>
                  )}
                </p>
              </div>
              <StatusBadge status={caseData.status} />
            </div>

            {caseData.escalationNote && (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <strong>Eskaleringsorsak:</strong> {caseData.escalationNote}
              </div>
            )}

            {caseData.summary && (
              <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <strong>AI-sammanfattning:</strong> {caseData.summary}
              </div>
            )}

            <ThreadView messages={threadMessages} />

            {!isClosed && (
              <div className="mt-6 rounded-md border border-[#1a6ba8]/20 bg-[#1a6ba8]/5 px-4 py-3 text-sm text-[#1a6ba8]">
                Bo jobbar med detta ärende och svarar hyresgästen automatiskt.
              </div>
            )}
          </div>
        </div>

        {/* Sidopanel */}
        <div className="space-y-4">
          {/* Åtgärder */}
          {transitions.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-medium text-gray-700">Åtgärder</h2>
              <div className="flex flex-col gap-2">
                {transitions.map((t) => (
                  <button
                    key={t.next}
                    onClick={() => updateStatus(t.next)}
                    disabled={updating}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      t.primary
                        ? "bg-[#1a6ba8] text-white hover:bg-[#155a8f]"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Avsluta / Återöppna */}
          {isClosed && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="mb-1 text-sm font-medium text-gray-700">Ärendet är avslutat</h2>
              <p className="mb-3 text-xs text-gray-400">Du kan återöppna ärendet om det behövs.</p>
              <button
                onClick={() => updateStatus("IN_PROGRESS")}
                disabled={updating}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Öppna ärende igen
              </button>
            </div>
          )}

          {/* Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            {isClosed ? (
              <button
                type="button"
                onClick={() => setInfoOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-gray-700">Information</span>
                <span className={`text-gray-400 transition-transform ${infoOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
            ) : (
              <h2 className="mb-3 text-sm font-medium text-gray-700">Information</h2>
            )}

            {(!isClosed || infoOpen) && (
              <div className={isClosed ? "mt-3" : ""}>
                <dl className="space-y-2 text-sm">
                  {caseData.category && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Kategori</dt>
                      <dd className="font-medium text-gray-900">{caseData.category.name}</dd>
                    </div>
                  )}
                  {caseData.property && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Fastighet</dt>
                      <dd className="font-medium text-gray-900">{caseData.property.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Skapat</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(caseData.createdAt).toLocaleDateString("sv-SE")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Meddelanden</dt>
                    <dd className="font-medium text-gray-900">{caseData.messages.length}</dd>
                  </div>
                </dl>

                {caseData.category && caseData.category.fields.length > 0 && (
                  <>
                    <hr className="my-4 border-gray-100" />
                    <FieldValuesList
                      fieldValues={caseData.fieldValues}
                      requiredFields={caseData.category.fields}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadView({ messages }: { messages: ThreadMessage[] }) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => {
        const m = SENDER_META[msg.sender];
        return (
          <div key={msg.id} className={`flex ${m.side === "left" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${m.bubble}`}>
              <p className="whitespace-pre-wrap">{msg.body}</p>
              <p className={`mt-1.5 text-right text-xs ${m.meta}`}>
                {m.label} ·{" "}
                {new Date(msg.sentAt).toLocaleString("sv-SE", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
