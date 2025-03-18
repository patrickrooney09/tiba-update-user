import { NextResponse } from "next/server";
import { updateMonthly } from "@/lib/smartparkAPI";

/**
 * API route to update monthly user details in SmartPark API
 */
export async function PUT(request) {
  try {
    const monthlyData = await request.json();

    if (!monthlyData.MonthlyID) {
      return NextResponse.json(
        { error: "Monthly ID is required" },
        { status: 400 }
      );
    }

    const data = await updateMonthly(monthlyData);

    // SmartPark API error codes are handled by the API client
    return NextResponse.json({
      ...data,
      success: true,
      message: "Monthly details updated successfully",
    });
  } catch (error) {
    console.error("Error updating monthly details:", error);
    return NextResponse.json(
      { error: "Failed to update monthly details", details: error.message },
      { status: 500 }
    );
  }
}
