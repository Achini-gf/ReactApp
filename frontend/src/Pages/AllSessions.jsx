// --- AllSessions.jsx ---
// Lists all public sessions from advanced backend

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SessionCard from "../components/SessionCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AllSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/sessions`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h2>All Public Sessions</h2>
        <Link to="/create" className="btn btn-primary">
          + Create Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-3">No sessions available yet.</p>
      ) : (
        <div className="row mt-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
