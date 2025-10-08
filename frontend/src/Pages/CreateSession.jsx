import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Lock } from "lucide-react";
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
  const [managementCode, setManagementCode] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      const res = await createSession(formData);
      setManagementCode(res.managementCode);
      setTimeout(() => navigate(`/session/${res.id}`), 3000);
    } catch (err) {
      setError("Failed to create session");
    }
  };

  if (managementCode) {
    return (
      <div className="session-page" style={{ textAlign: "center" }}>
        <div className="session-card" style={{ padding: "2rem" }}>
          <h2>Session Created!</h2>
          <p>Save your management code:</p>
          <div className="code-box">{managementCode}</div>
          <p>Redirecting to session...</p>
        </div>
      </div>
    );
  }

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
