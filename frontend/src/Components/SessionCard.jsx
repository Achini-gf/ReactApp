import React from "react";
import { Calendar, Clock, Users, Globe } from "lucide-react";

export default function SessionCard({ session, onClick }) {
  return (
    <div className="session-list-card" onClick={onClick}>
      <div className="session-card-top">
        <span className="session-card-badge">
          <Globe size={14} /> {session.type === "public" ? "Public" : "Private"}
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
  );
}
