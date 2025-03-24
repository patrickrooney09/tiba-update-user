import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "./firebase-admin-config";

// Log action types
export const LogActionType = {
  USER_UPDATE: "USER_UPDATE",
  WALLET_UPDATE: "WALLET_UPDATE",
  ACCESS_PROFILE_UPDATE: "ACCESS_PROFILE_UPDATE",
};

// Update methods for wallet changes
export const WalletUpdateMethod = {
  DISCOUNT: "DISCOUNT",
  MANUAL: "MANUAL",
  SYSTEM: "SYSTEM",
};

/**
 * Creates an audit log entry in Firestore
 * @param {Object} logData - The log data
 * @param {string} logData.actionType - Type of action (from LogActionType)
 * @param {string} logData.performedBy - Email of the user performing the action
 * @param {string} logData.monthlyId - ID of the monthly user being modified
 * @param {Object} logData.previousState - State before the change
 * @param {Object} logData.newState - State after the change
 * @param {boolean} logData.success - Whether the action was successful
 * @param {string} [logData.error] - Error message if action failed
 * @param {Object} [logData.metadata] - Additional metadata about the change
 * @param {string} [logData.metadata.updateMethod] - Method of update (for wallet changes)
 * @param {number} [logData.metadata.amountChange] - Amount changed (for wallet updates)
 * @param {string} [logData.metadata.reason] - Reason for the change
 * @returns {Promise<string>} The ID of the created log entry
 */
export async function createAuditLog(logData) {
  try {
    const app = getFirebaseAdminApp();
    if (!app) {
      throw new Error("Firebase Admin not initialized");
    }

    const db = getFirestore(app);

    const logEntry = {
      ...logData,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || "development",
    };

    const docRef = await db.collection("audit_logs").add(logEntry);
    console.log(`Audit log created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating audit log:", error);
    // Don't throw the error - we don't want logging failures to break the main flow
    return null;
  }
}

/**
 * Retrieves audit logs with optional filters
 * @param {Object} filters - Query filters
 * @param {string} [filters.monthlyId] - Filter by monthly user ID
 * @param {string} [filters.actionType] - Filter by action type
 * @param {string} [filters.performedBy] - Filter by user who performed the action
 * @param {Date} [filters.startDate] - Start date for date range
 * @param {Date} [filters.endDate] - End date for date range
 * @param {number} [limit=50] - Maximum number of logs to retrieve
 * @returns {Promise<Array>} Array of log entries
 */
export async function getAuditLogs(filters = {}, limit = 50) {
  try {
    const app = getFirebaseAdminApp();
    if (!app) {
      throw new Error("Firebase Admin not initialized");
    }

    const db = getFirestore(app);
    let query = db.collection("audit_logs");

    // Apply filters
    if (filters.monthlyId) {
      query = query.where("monthlyId", "==", filters.monthlyId);
    }
    if (filters.actionType) {
      query = query.where("actionType", "==", filters.actionType);
    }
    if (filters.performedBy) {
      query = query.where("performedBy", "==", filters.performedBy);
    }
    if (filters.startDate) {
      query = query.where("timestamp", ">=", filters.startDate);
    }
    if (filters.endDate) {
      query = query.where("timestamp", "<=", filters.endDate);
    }

    // Order by timestamp descending
    query = query.orderBy("timestamp", "desc").limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error retrieving audit logs:", error);
    throw error;
  }
}
