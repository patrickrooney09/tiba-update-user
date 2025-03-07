/**
 * SmartPark API client for making requests to the SmartPark API
 * Handles authentication and common query parameters
 */

// Add this function at the top of the file
function debugEnvironmentVars() {
  console.log("Environment Variables Check:");
  console.log("SP_API_USERNAME:", process.env.SP_API_USERNAME);
  console.log("SP_API_PASSWORD:", process.env.SP_API_PASSWORD);
  console.log("SP_FACILITY_CODE:", process.env.SP_FACILITY_CODE);
  console.log("SP_TERMINAL_ID:", process.env.SP_TERMINAL_ID);
  console.log("SP_PROVIDER_ID:", process.env.SP_PROVIDER_ID);
  console.log("SP_USERNAME:", process.env.SP_USERNAME);
  console.log("SP_PASSWORD:", process.env.SP_PASSWORD);
}

// Call this at the start of apiRequest

const BASE_URL =
  "https://washingtonathletic-api.sp.tibaparking.net/API/v1/ParkServices/Management";

// Creates the auth header using environment variables
const getAuthHeader = () => {
  const credentials = Buffer.from(
    `${process.env.SP_API_USERNAME}:${process.env.SP_API_PASSWORD}`
  ).toString("base64");
  return `Basic ${credentials}`;
};

// Common query parameters required for all API calls
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
  debugEnvironmentVars();
  const url = `${BASE_URL}/${endpoint}?${getQueryString()}`;

  const headers = {
    "Authorization": getAuthHeader(),
    "Content-Type": "application/json",
  };

  console.log("Full request details:");
  console.log("URL:", url);
  console.log("Method:", method);
  console.log("Headers:", JSON.stringify(headers, null, 2));
  console.log("Body:", JSON.stringify(body, null, 2));

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
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
