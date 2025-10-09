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
  XCircle,
} from "lucide-react";
import {
  getSession,
  joinSession,
  leaveSession,
  deleteSession,
} from "../services/api";

// ✅ Reusable show/hide box
function CodeBox({ label, code }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "10px 14px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        onClick={() => setShow(!show)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#4f46e5" }}>{show ? "Hide" : "Show"}</span>
      </div>
      {show && (
        <div
          style={{
            marginTop: "8px",
            background: "#f3f4f6",
            padding: "8px",
            borderRadius: "6px",
            fontFamily: "monospace",
            wordBreak: "break-all",
          }}
        >
          {code}
        </div>
      )}
    </div>
  );
}

export default function SessionDetail({ isManage = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const managementCode = searchParams.get("code");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [error, setError] = useState("");

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

  // ✅ Delete session (top-right)
  const handleDelete = async () => {
    if (!managementCode) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this session?"
    );
    if (!confirmDelete) return;

    try {
      await deleteSession(id, managementCode);
      alert("Session deleted successfully!");
      navigate("/");
    } catch (err) {
      alert("Failed to delete session");
    }
  };

  const handleRemoveAttendee = async (attendeeCode) => {
    if (!managementCode) return;
    const confirmRemove = window.confirm("Remove this attendee?");
    if (!confirmRemove) return;

    try {
      await fetch(`http://localhost:5000/api/sessions/${id}/attendees`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managementCode, attendeeCode }),
      });
      const updated = await getSession(id);
      setSession(updated);
    } catch (err) {
      alert("Failed to remove attendee");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading session...
      </div>
    );

  if (error || !session)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );

  const attendeeCount = session.attendees?.length || 0;

  return (
    <div className="session-page" style={{ position: "relative" }}>
      {/* ✅ Delete Button (fixed top-right corner in management mode) */}
      {managementCode && (
        <button
          onClick={handleDelete}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 1000,
          }}
        >
          <Trash2 size={16} /> Delete Session
        </button>
      )}

      <div
        className="session-card"
        style={{ maxWidth: "700px", margin: "0 auto", paddingTop: "60px" }}
      >
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Sessions
        </button>

        <div
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
          </div>

          <h1 style={{ marginTop: "10px", fontSize: "1.8rem", fontWeight: "700" }}>
            {session.title}
          </h1>
          <p style={{ opacity: 0.9 }}>{session.description}</p>
        </div>

        <div className="session-info">
          <div className="info-row">
            <Calendar size={18} />
            <span>{new Date(session.date).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <Clock size={18} />
            <span>{session.time}</span>
          </div>
          <div className="info-row">
            <Users size={18} />
            <span>
              {attendeeCount}/{session.maxParticipants} attending
            </span>
          </div>
        </div>

        {!attendanceCode ? (
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter your name"
              id="attendeeName"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                marginBottom: "8px",
                width: "100%",
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
                padding: "12px",
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
            style={{
              width: "100%",
              backgroundColor: "#ef4444",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              marginTop: "10px",
            }}
          >
            <UserX size={18} style={{ marginRight: "6px" }} /> Leave Session
          </button>
        )}

        <div style={{ marginTop: "20px" }}>
          {managementCode && (
            <CodeBox
              label="Management Code"
              code={`/session/${id}?code=${managementCode}`}
            />
          )}
          {attendanceCode && (
            <CodeBox label="Your Attendance Code" code={attendanceCode} />
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ fontWeight: "700", fontSize: "1.2rem", marginBottom: "10px" }}>
            Attendees ({attendeeCount})
          </h3>
          {session.attendees?.length ? (
            session.attendees.map((a) => (
              <div
                key={a.code}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "#4f46e5",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                    }}
                  >
                    {a.name ? a.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span style={{ fontWeight: "500" }}>{a.name || "Anonymous"}</span>
                </div>
                {managementCode && (
                  <button
                    onClick={() => handleRemoveAttendee(a.code)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                    }}
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>No attendees yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
