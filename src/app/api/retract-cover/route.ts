import { NextResponse } from "next/server";
import { addActivity, addNotification, setCoverDeployed, systemState } from "@/lib/systemState";

export async function POST() {
  setCoverDeployed(false);
  addNotification("🟩", "Cover retracted successfully");
  addActivity("Cover retracted");
  return NextResponse.json({ message: "Cover retracted successfully", state: systemState });
}
