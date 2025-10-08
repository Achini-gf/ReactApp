import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Globe, Calendar, Clock, Users } from "lucide-react";
import { getAllSessions } from "../services/api";

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="session-list-page">
      <div className="session-list-container">
        <div className="session-list-header">
          <h1>Hobby Sessions</h1>
          <p>Discover and join sessions or create your own</p>
        </div>

        <button
          onClick={() => navigate("/create")}
          className="session-create-btn"
        >
          <Plus size={20} /> Create Session
        </button>

        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions available yet.</p>
        ) : (
          <div className="session-list-grid">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="session-list-card"
                onClick={() => navigate(`/session/${session.id}`)}
              >
                <div className="session-card-top">
                  <span className="session-card-badge">
                    <Globe size={14} /> Public
                  </span>
                  <span
                    className="session-card-limit"
                    style={{
                      color:
                        session.currentParticipants >= session.maxParticipants
                          ? "#dc2626"
                          : "#16a34a",
                    }}
                  >
                    {session.currentParticipants}/{session.maxParticipants}
                  </span>
                </div>

                <h3>{session.title}</h3>
                <p>{session.description}</p>

                <div className="session-card-info">
                  <div>
                    <Calendar size={14} />{" "}
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div>
                    <Clock size={14} /> {session.time}
                  </div>
                  <div>
                    <Users size={14} /> {session.currentParticipants} attending
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
