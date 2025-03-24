import { NextResponse } from "next/server";
import { updateMonthly, getMonthlyDetails } from "@/lib/smartparkAPI";
import {
  createAuditLog,
  LogActionType,
  WalletUpdateMethod,
} from "@/lib/logging";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * API route to update monthly user details in SmartPark API
 */
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const monthlyData = await request.json();

    if (!monthlyData.MonthlyID) {
      return NextResponse.json(
        { error: "Monthly ID is required" },
        { status: 400 }
      );
    }

    // Get previous state before update
    const previousState = await getMonthlyDetails(monthlyData.MonthlyID);

    // Perform the update
    const data = await updateMonthly(monthlyData);

    // Determine if this is a wallet balance update
    const isWalletUpdate = monthlyData.hasOwnProperty("WalletBalance");
    const actionType = isWalletUpdate
      ? LogActionType.WALLET_UPDATE
      : LogActionType.USER_UPDATE;

    // Calculate wallet balance change if applicable
    let metadata = {};
    if (isWalletUpdate) {
      const previousBalance = previousState.WalletBalance || 0;
      const newBalance = monthlyData.WalletBalance || 0;
      const amountChange = newBalance - previousBalance;

      metadata = {
        updateMethod:
          monthlyData.UpdateBalanceMethod === 1
            ? WalletUpdateMethod.DISCOUNT
            : WalletUpdateMethod.MANUAL,
        amountChange,
        reason:
          monthlyData.UpdateBalanceMethod === 1
            ? "Discount applied"
            : "Manual balance update",
      };
    }

    // Create audit log
    await createAuditLog({
      actionType,
      performedBy: session.user.email,
      monthlyId: monthlyData.MonthlyID,
      previousState,
      newState: data,
      success: true,
      metadata,
    });

    // SmartPark API error codes are handled by the API client
    return NextResponse.json({
      ...data,
      success: true,
      message: "Monthly details updated successfully",
    });
  } catch (error) {
    console.error("Error updating monthly details:", error);

    // Log the failed attempt
    if (monthlyData?.MonthlyID) {
      await createAuditLog({
        actionType: LogActionType.USER_UPDATE,
        performedBy: session.user.email,
        monthlyId: monthlyData.MonthlyID,
        previousState: null,
        newState: monthlyData,
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json(
      { error: "Failed to update monthly details", details: error.message },
      { status: 500 }
    );
  }
}
