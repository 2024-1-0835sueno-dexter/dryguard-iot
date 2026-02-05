import { NextResponse } from "next/server";
import { setCoverDeployed, systemState } from "@/lib/systemState";

export async function POST() {
  setCoverDeployed(true);
  return NextResponse.json({ message: "Cover deployed successfully", state: systemState });
}
