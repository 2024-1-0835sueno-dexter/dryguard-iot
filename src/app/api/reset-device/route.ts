import { NextResponse } from "next/server";
import { resetSystem, systemState } from "@/lib/systemState";

export async function POST() {
  resetSystem();
  return NextResponse.json({ message: "Device reset complete", state: systemState });
}
