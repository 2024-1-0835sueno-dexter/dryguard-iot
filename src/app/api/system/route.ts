import { NextResponse } from "next/server";
import { getSystemSnapshot } from "@/lib/systemState";

export async function GET() {
  return NextResponse.json(getSystemSnapshot());
}
