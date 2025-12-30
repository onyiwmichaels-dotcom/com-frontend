// src/config/api.js

// 🚨 FORCE THE CORRECT URL (No trailing slash)
export const API_BASE_URL = "https://com-backend-d56z.onrender.com";

export async function apiFetch(endpoint, options = {}) {
  // 1. Manually construct the URL to ensure no mistakes
  // We ensure 'endpoint' starts with a slash if it's missing
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // 2. The final URL should look like: https://...onrender.com/api/auth/login
  const url = `${API_BASE_URL}/api${cleanEndpoint}`;

  console.log(`🚀 DEBUG: Fetching ${url}`); // Look for this in your browser console!

  const headers = options.headers || {};
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Handle the response
    const contentType = response.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(typeof data === 'string' ? data : data.message || "API Request Failed");
    }

    return data;
  } catch (err) {
    console.error(`API Error:`, err);
    throw err;
  }
}

// --- Helper Functions ---
export const apiGet = (endpoint) => apiFetch(endpoint, { method: "GET" });

export const apiPost = (endpoint, body) =>
  apiFetch(endpoint, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });

export const apiPut = (endpoint, body) =>
  apiFetch(endpoint, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) });

export const apiDelete = (endpoint) => apiFetch(endpoint, { method: "DELETE" });