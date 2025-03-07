import { NextResponse } from "next/server";
import { getAccessProfiles } from "@/lib/smartparkAPI";

/**
 * API route to get access profiles from SmartPark API
 */
export async function GET() {
  try {
    const data = await getAccessProfiles();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching access profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch access profiles" },
      { status: 500 }
    );
  }
}
