/**
 * SmartPark API client for making requests to the SmartPark API
 * Handles authentication and common query parameters
 */

// make this an env variable eventually
const BASE_URL =
  "https://washingtonathletic-api.sp.tibaparking.net/API/v1/ParkServices/Management";

// Creates the auth header using environment variables
const getAuthHeader = () => {
  const credentials = Buffer.from(
    `${process.env.SP_API_USERNAME}:${process.env.SP_API_PASSWORD}`
  ).toString("base64");
  return `Basic ${credentials}`;
};

// query params
const getQueryString = () => {
  return new URLSearchParams({
    ver: 1,
    facilityCode: process.env.SP_FACILITY_CODE,
    terminalID: process.env.SP_TERMINAL_ID,
    providerID: process.env.SP_PROVIDER_ID,
    userName: process.env.SP_USERNAME,
    password: process.env.SP_PASSWORD,
  }).toString();
};

// Makes a request to the SmartPark API
async function apiRequest(endpoint, method = "GET", body = null) {
  const url = `${BASE_URL}/${endpoint}?${getQueryString()}`;

  const headers = {
    "Authorization": getAuthHeader(),
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Check both HTTP status and SmartPark API result code
    if (!response.ok || (data.ResultCode && data.ResultCode !== "0")) {
      const error = new Error(
        data.ResultDescription ||
          `API request failed with status ${response.status}`
      );
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    // Preserve the original error data if it exists
    if (error.data) {
      throw error;
    }
    throw new Error(`API request failed: ${error.message}`);
  }
}

// API endpoint functions
export async function getAccessProfiles() {
  return apiRequest("GetAccessProfileList");
}

export async function getMonthlyDetails(monthlyId) {
  return apiRequest("GetMonthlyDetails", "POST", { MonthlyId: monthlyId });
}

export async function updateMonthly(monthlyData) {
  return apiRequest("UpdateMonthly", "PUT", monthlyData);
}

export default {
  getAccessProfiles,
  getMonthlyDetails,
  updateMonthly,
};
