import { NextResponse } from "next/server";
import { setCoverDeployed, systemState } from "@/lib/systemState";

export async function POST() {
  setCoverDeployed(false);
  return NextResponse.json({ message: "Cover retracted successfully", state: systemState });
}
