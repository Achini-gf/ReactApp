import React from 'react';
import { Link } from 'react-router-dom';

export default function SessionCard({ s }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <h3>{s.title}</h3>
      <div>{s.date} {s.time}</div>
      <div>Attending: {s.attendeesCount} — Spots left: {s.spotsLeft}</div>
      <Link to={`/session/${s.id}`}>View</Link>
    </div>
  );
}
