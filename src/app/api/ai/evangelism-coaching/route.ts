import { NextRequest, NextResponse } from "next/server";
import { getEvangelismCoaching } from "@/ai/flows/ai-evangelism-coaching";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const out = await getEvangelismCoaching(body);
  return NextResponse.json(out);
}
