import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/ai/flows/geocoding";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }
  const coords = await geocodeAddress(address);
  return NextResponse.json(coords);
}
