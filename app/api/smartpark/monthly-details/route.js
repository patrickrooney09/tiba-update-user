import { NextResponse } from "next/server";
import { getMonthlyDetails } from "@/lib/smartparkAPI";

/**
 * API route to get monthly user details from SmartPark API
 */
export async function POST(request) {
  try {
    const { monthlyId } = await request.json();

    if (!monthlyId) {
      return NextResponse.json(
        { error: "Monthly ID is required" },
        { status: 400 }
      );
    }

    const data = await getMonthlyDetails(monthlyId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching monthly details:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly details" },
      { status: 500 }
    );
  }
}
