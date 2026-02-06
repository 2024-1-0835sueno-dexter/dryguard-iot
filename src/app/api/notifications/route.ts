import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/systemState";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 8) || 8;
  return NextResponse.json(getNotifications(limit));
}
