// --- SessionDetails.jsx ---
// View session details, join/leave attendance, and creator management

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [attendanceCode, setAttendanceCode] = useState(
    localStorage.getItem(`attendance_${id}`) || ""
  );
  const [managementCode, setManagementCode] = useState("");
  const [loading, setLoading] = useState(true);

  // Load session details
  async function loadSession() {
    const res = await fetch(`${API}/session/${id}`);
    const data = await res.json();
    setSession(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSession();
  }, [id]);

  // Join session
  async function joinSession() {
    try {
      const res = await fetch(`${API}/session/${id}/attend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setAttendanceCode(data.attendanceCode);
        localStorage.setItem(`attendance_${id}`, data.attendanceCode);
        alert("✅ You joined the session! Keep your attendance code safe.");
        loadSession();
      } else {
        alert("❌ " + (data.message || "Could not join."));
      }
    } catch {
      alert("❌ Failed to connect to server.");
    }
  }

  // Leave session
  async function leaveSession() {
    const code = attendanceCode || localStorage.getItem(`attendance_${id}`);
    if (!code) return alert("No attendance code found for this session.");

    const res = await fetch(`${API}/session/${id}/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceCode: code }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("🚪 You left the session.");
      localStorage.removeItem(`attendance_${id}`);
      setAttendanceCode("");
      loadSession();
    } else {
      alert("❌ " + (data.message || "Unable to leave."));
    }
  }

  // Remove participant (creator)
  async function removeParticipant(code) {
    if (!managementCode) return alert("Enter management code first.");
    const res = await fetch(`${API}/session/${id}/manage/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: managementCode, attendanceCode: code }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Participant removed.");
      loadSession();
    } else {
      alert("❌ " + (data.message || "Error removing participant."));
    }
  }

  if (loading) return <div>Loading session...</div>;
  if (!session) return <div>Session not found.</div>;

  return (
    <div className="container mt-4">
      <h2>{session.title}</h2>
      <p>{session.description}</p>
      <p>
        <strong>Date:</strong> {session.date} <br />
        <strong>Time:</strong> {session.time}
      </p>
      <p>
        <strong>Participants:</strong>{" "}
        {session.participants?.length || 0} / {session.maxParticipants || "∞"}
      </p>

      <hr />
      <h4>Join / Leave</h4>
      {!attendanceCode ? (
        <button className="btn btn-success me-2" onClick={joinSession}>
          I’m going
        </button>
      ) : (
        <button className="btn btn-danger me-2" onClick={leaveSession}>
          Not going
        </button>
      )}

      <hr />
      <h4>Creator Management</h4>
      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Enter management code"
          value={managementCode}
          onChange={(e) => setManagementCode(e.target.value)}
        />
      </div>

      {managementCode && (
        <>
          <p>Use the code to manage participants below:</p>
          <ul className="list-group">
            {session.participants?.map((p) => (
              <li
                key={p.attendanceCode}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{p.attendanceCode}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeParticipant(p.attendanceCode)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-3">
        <Link to="/" className="btn btn-secondary">
          ← Back to list
        </Link>
      </div>
    </div>
  );
}
