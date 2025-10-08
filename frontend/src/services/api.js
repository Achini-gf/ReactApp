// ============================================================================
// API SERVICE — handles communication between frontend and backend
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function for making API requests
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }
  return response.json();
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

// Get all sessions
export const getAllSessions = () => apiCall("/sessions");

// Get a specific session by ID
export const getSession = (id) => apiCall(`/sessions/${id}`);

// Create a new session
export const createSession = (data) =>
  apiCall("/sessions", { method: "POST", body: JSON.stringify(data) });

// Join a session (now sends attendee name)
export const joinSession = (id, name) =>
  apiCall(`/sessions/${id}/attend`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

// Leave a session using attendance code
export const leaveSession = (id, attendanceCode) =>
  apiCall(`/sessions/${id}/attend`, {
    method: "DELETE",
    body: JSON.stringify({ attendanceCode }),
  });

// Delete a session using management code
export const deleteSession = (id, managementCode) =>
  apiCall(`/sessions/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ managementCode }),
  });
