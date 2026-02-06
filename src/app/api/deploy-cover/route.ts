import { NextResponse } from "next/server";
import { addActivity, addNotification, setCoverDeployed, systemState } from "@/lib/systemState";

export async function POST() {
  setCoverDeployed(true);
  addNotification("✅", "Cover deployed successfully");
  addActivity("Cover deployed");
  return NextResponse.json({ message: "Cover deployed successfully", state: systemState });
}
