import { NextRequest, NextResponse } from "next/server";
import { aiMissionPlanning } from "@/ai/flows/ai-mission-planning";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const out = await aiMissionPlanning(body);
  return NextResponse.json(out);
}
