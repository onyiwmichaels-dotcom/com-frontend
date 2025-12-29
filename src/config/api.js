// api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://com-backend-d56z.onrender.com";

/**
 * Generic API fetch helper
 * @param {string} endpoint - API endpoint, e.g., "/products"
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Resolves to JSON response
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // Default headers
  const headers = options.headers || {};

  // Determine if body is FormData (for file uploads)
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Attempt to parse JSON, even for errors
    const contentType = response.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data?.message || data || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API fetch error: ${endpoint}`, err);
    throw err;
  }
}

/**
 * GET request
 */
export const apiGet = (endpoint) => apiFetch(endpoint, { method: "GET" });

/**
 * POST request
 */
export const apiPost = (endpoint, body) =>
  apiFetch(endpoint, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });

/**
 * PUT request
 */
export const apiPut = (endpoint, body) =>
  apiFetch(endpoint, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) });

/**
 * DELETE request
 */
export const apiDelete = (endpoint) => apiFetch(endpoint, { method: "DELETE" });

/**
 * Helper to construct absolute image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};


