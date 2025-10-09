import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Lock, ExternalLink } from "lucide-react";
import { createSession } from "../services/api";

export default function CreateSession() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    maxParticipants: "",
    type: "public",
  });
  const [createdSession, setCreatedSession] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      const res = await createSession(formData);
      // res = { id, managementCode }
      setCreatedSession(res);
    } catch (err) {
      setError("Failed to create session");
    }
  };

  const handleOpenManagement = () => {
    if (!createdSession) return;
    const link = `/session/${createdSession.id}?code=${createdSession.managementCode}`;
    window.open(link, "_blank"); // open in new tab
  };

  // ✅ After creation
  if (createdSession) {
    const link = `/session/${createdSession.id}?code=${createdSession.managementCode}`;
    return (
      <div className="session-page" style={{ textAlign: "center", padding: "3rem" }}>
        <div
          className="session-card"
          style={{
            padding: "2rem",
            borderRadius: "12px",
            backgroundColor: "white",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#4f46e5", marginBottom: "10px" }}>✅ Session Created!</h2>
          <p>Your management code:</p>
          <div
            style={{
              background: "#f3f4f6",
              padding: "10px",
              borderRadius: "8px",
              fontFamily: "monospace",
              margin: "10px auto 20px",
              width: "fit-content",
            }}
          >
            {createdSession.managementCode}
          </div>

          <p>You can manage or delete your session anytime using the link below:</p>

          <button
            onClick={handleOpenManagement}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "20px",
            }}
          >
            <ExternalLink size={18} />
            Open Management Page
          </button>

          <p style={{ marginTop: "20px", color: "#555", fontFamily: "monospace" }}>
            {link}
          </p>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "30px",
              backgroundColor: "#9ca3af",
              color: "white",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Default form view
  return (
    <div className="session-page">
      <div className="session-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Sessions
        </button>
        <h2>Create New Session</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Max Participants</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <div>
            <label>
              <input
                type="radio"
                name="type"
                value="public"
                checked={formData.type === "public"}
                onChange={handleChange}
              />
              <Globe size={14} /> Public
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="type"
                value="private"
                checked={formData.type === "private"}
                onChange={handleChange}
              />
              <Lock size={14} /> Private
            </label>
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-join">
          Create Session
        </button>
      </div>
    </div>
  );
}
