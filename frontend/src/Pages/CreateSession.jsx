// --- CreateSession.jsx ---
// Form to create a new session (public/private) and show management info

import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateSession() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    maxParticipants: 10,
    sessionType: "public",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error creating session");
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create Session</h2>
      <form onSubmit={onSubmit} className="mt-3">
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="row mb-2">
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="time"
              className="form-control"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control"
            min="1"
            value={form.maxParticipants}
            onChange={(e) =>
              setForm({ ...form, maxParticipants: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={form.sessionType}
            onChange={(e) => setForm({ ...form, sessionType: e.target.value })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Create Session
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="alert alert-success mt-4">
          <strong>Session created successfully!</strong>
          <div>
            <b>Session ID:</b> {result.sessionId}
          </div>
          <div>
            <b>Management URL:</b>{" "}
            <code>{result.managementUrl}</code>
          </div>
          <small className="text-muted">
            Save this URL to manage your session later.
          </small>
        </div>
      )}
    </div>
  );
}
