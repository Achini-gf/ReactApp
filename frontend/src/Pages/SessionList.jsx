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

  // ✅ Separate upcoming and past sessions
  const today = new Date();
  const upcomingSessions = sessions
    .filter((s) => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastSessions = sessions
    .filter((s) => new Date(s.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
        ) : (
          <>
            {/* 🟢 Upcoming Sessions */}
            <section style={{ marginTop: "30px" }}>
              <h2 style={{ color: "#2563eb", marginBottom: "10px" }}>
                Upcoming Sessions
              </h2>
              {upcomingSessions.length > 0 ? (
                <div className="session-list-grid">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="session-list-card"
                      onClick={() => navigate(`/session/${session.id}`)}
                    >
                      <div className="session-card-top">
                        <span className="session-card-badge">
                          <Globe size={14} /> {session.type || "Public"}
                        </span>
                        <span
                          className="session-card-limit"
                          style={{
                            color:
                              (session.attendees?.length || 0) >=
                              session.maxParticipants
                                ? "#dc2626"
                                : "#16a34a",
                          }}
                        >
                          {session.attendees?.length || 0}/
                          {session.maxParticipants}
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
                          <Users size={14} />{" "}
                          {session.attendees?.length || 0} attending
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6b7280" }}>No upcoming sessions</p>
              )}
            </section>

            {/* ⚫ Past Sessions */}
            <section style={{ marginTop: "40px" }}>
              <h2 style={{ color: "#9ca3af", marginBottom: "10px" }}>
                Past Sessions
              </h2>
              {pastSessions.length > 0 ? (
                <div className="session-list-grid">
                  {pastSessions.map((session) => (
                    <div
                      key={session.id}
                      className="session-list-card"
                      onClick={() => navigate(`/session/${session.id}`)}
                      style={{ opacity: 0.7 }}
                    >
                      <div className="session-card-top">
                        <span className="session-card-badge">
                          <Globe size={14} /> {session.type || "Public"}
                        </span>
                        <span className="session-card-limit">
                          {session.attendees?.length || 0}/
                          {session.maxParticipants}
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
                          <Users size={14} />{" "}
                          {session.attendees?.length || 0} attended
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af" }}>No past sessions</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
