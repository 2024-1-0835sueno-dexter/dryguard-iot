import { NextResponse } from "next/server";
import { addActivity, addNotification, resetSystem, systemState } from "@/lib/systemState";

export async function POST() {
  resetSystem();
  addNotification("🔄", "Device reset complete");
  addActivity("Device reset");
  return NextResponse.json({ message: "Device reset complete", state: systemState });
}
