import { NextRequest, NextResponse } from "next/server";
import { checkTimeouts } from "@/lib/email-processor";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await checkTimeouts();
  return NextResponse.json({ ok: true });
}
