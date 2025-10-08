import React from "react";
import { UserX } from "lucide-react";
import { removeAttendee } from "../services/api";

export default function AttendeeList({
  attendees = [],
  sessionId,
  managementCode,
  onRemove,
}) {
  const handleRemove = async (attendeeId) => {
    if (!managementCode) return;
    try {
      await removeAttendee(sessionId, attendeeId, managementCode);
      onRemove();
    } catch (err) {
      console.error("Failed to remove attendee:", err);
    }
  };

  return (
    <div>
      <h3>Attendees ({attendees.length})</h3>
      {attendees.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        attendees.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f9fafb",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {a.name ? a.name[0].toUpperCase() : "?"}
              </div>
              <span>{a.name || "Anonymous"}</span>
            </div>
            {managementCode && (
              <button
                onClick={() => handleRemove(a.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  cursor: "pointer",
                }}
              >
                <UserX size={18} />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
