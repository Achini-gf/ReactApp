import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  Globe,
  Lock,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import {
  getSession,
  joinSession,
  leaveSession,
  deleteSession,
} from "../services/api";

export default function SessionDetail({ isManage = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const managementCode = searchParams.get("code");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [error, setError] = useState("");

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getSession(id);
        setSession(data);
      } catch (err) {
        setError("Session not found");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Join session
  const handleJoin = async (name) => {
    try {
      const res = await joinSession(id, name);
      setAttendanceCode(res.attendanceCode);
      const updated = await getSession(id);
      setSession(updated);
    } catch {
      setError("Failed to join session");
    }
  };

  // Leave session
  const handleLeave = async () => {
    if (!attendanceCode) return;
    try {
      await leaveSession(id, attendanceCode);
      setAttendanceCode(null);
      const updated = await getSession(id);
      setSession(updated);
    } catch {
      setError("Failed to leave session");
    }
  };

  // Delete session (admin)
  const handleDelete = async () => {
    if (!managementCode) return;
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(id, managementCode);
        navigate("/");
      } catch {
        setError("Failed to delete session");
      }
    }
  };

  if (loading)
    return (
      <div className="session-page" style={{ textAlign: "center" }}>
        <p>Loading session...</p>
      </div>
    );

  if (error || !session)
    return (
      <div className="session-page" style={{ textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  const attendeeCount = session.attendees ? session.attendees.length : 0;

  return (
    <div className="session-page">
      <div
        className="session-card"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          paddingBottom: "2rem",
        }}
      >
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Sessions
        </button>

        {/* Header */}
        <div
          className="session-header"
          style={{
            background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            color: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "0.4rem 0.8rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
              }}
            >
              {session.type === "public" ? <Globe size={14} /> : <Lock size={14} />}
              {session.type === "public" ? "Public" : "Private"}
            </span>

            {isManage && managementCode && (
              <button
                onClick={handleDelete}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <h1
            style={{ marginTop: "10px", fontSize: "1.8rem", fontWeight: "700" }}
          >
            {session.title}
          </h1>
          <p style={{ opacity: 0.9 }}>{session.description}</p>
        </div>

        {/* Info section */}
        <div className="session-info" style={{ marginBottom: "1.5rem" }}>
          <div className="info-row">
            <Calendar size={18} />
            <span style={{ marginLeft: "6px" }}>
              {new Date(session.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="info-row">
            <Clock size={18} />
            <span style={{ marginLeft: "6px" }}>{session.time}</span>
          </div>
          <div className="info-row">
            <Users size={18} />
            <span style={{ marginLeft: "6px" }}>
              {attendeeCount}/{session.maxParticipants} attending
            </span>
          </div>
        </div>

        {/* Join / Leave buttons */}
        <div className="session-actions" style={{ marginBottom: "1rem" }}>
         {!attendanceCode ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <input
      type="text"
      placeholder="Enter your name"
      id="attendeeName"
      style={{
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "1rem",
      }}
    />
    <button
      onClick={() => {
        const name = document.getElementById("attendeeName").value.trim();
        if (!name) return alert("Please enter your name before joining!");
        handleJoin(name);
      }}
      disabled={attendeeCount >= session.maxParticipants}
      style={{
        width: "100%",
        backgroundColor:
          attendeeCount >= session.maxParticipants ? "#9ca3af" : "#4f46e5",
        color: "white",
        padding: "0.8rem",
        borderRadius: "8px",
        border: "none",
        fontWeight: "600",
        cursor:
          attendeeCount >= session.maxParticipants ? "not-allowed" : "pointer",
      }}
    >
      <UserCheck size={18} style={{ marginRight: "6px" }} />
      {attendeeCount >= session.maxParticipants ? "Session Full" : "I'm Going"}
    </button>
  </div>
) : (

            <button
              onClick={handleLeave}
              className="btn-leave"
              style={{
                width: "100%",
                backgroundColor: "#dc2626",
                color: "white",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <UserX size={18} style={{ marginRight: "6px" }} /> Leave Session
            </button>
          )}
        </div>

        {/* Codes */}
        {managementCode && (
          <div
            className="code-box"
            style={{
              background: "#f3f4f6",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            Management Link: /session/{id}/manage?code={managementCode}
          </div>
        )}
        {attendanceCode && (
          <div
            className="code-box"
            style={{
              background: "#f3f4f6",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            Your Code: {attendanceCode}
          </div>
        )}

        {/* Attendee list */}
        <div className="attendee-list" style={{ marginTop: "2rem" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              marginBottom: "1rem",
            }}
          >
            Attendees ({attendeeCount})
          </h3>

          {(!session.attendees || session.attendees.length === 0) ? (
            <p style={{ color: "#6b7280" }}>No one has joined yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {session.attendees.map((a, i) => (
                <div
                  key={a.id || i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f9fafb",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#4f46e5",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "600",
                      }}
                    >
                      {(a.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "500" }}>{a.name || "Anonymous"}</span>
                  </div>
                  <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>#{i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
