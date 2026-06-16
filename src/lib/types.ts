export type { CaseStatus } from "@prisma/client";
export type { Urgency } from "@/components/ui/UrgencyBadge";

export interface Message {
  id: string;
  fromResident: boolean;
  body: string;
  sentAt: string;
}
