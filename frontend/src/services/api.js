const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

// =============================
//  API ENDPOINT FUNCTIONS
// =============================

export const getAllSessions = () => apiCall("/sessions");

export const getSession = (id) => apiCall(`/sessions/${id}`);

export const createSession = (data) =>
  apiCall("/sessions", { method: "POST", body: JSON.stringify(data) });

export const joinSession = (id, name) =>
  apiCall(`/sessions/${id}/attend`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const leaveSession = (id, attendanceCode) =>
  apiCall(`/sessions/${id}/attend`, {
    method: "DELETE",
    body: JSON.stringify({ attendanceCode }),
  });

export const deleteSession = (id, managementCode) =>
  apiCall(`/sessions/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ managementCode }),
  });

// remove attendee for management
export const removeAttendee = (sessionId, attendeeId, managementCode) =>
  apiCall(`/sessions/${sessionId}/attendees/${attendeeId}`, {
    method: "DELETE",
    body: JSON.stringify({ managementCode }),
  });
