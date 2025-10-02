import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SessionCard from '../components/SessionCard';

const API = import.meta.env.VITE_API_URL;



export default function AllSessions() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    fetch(API + '/sessions').then(r => r.json()).then(data => {
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
    });
  }, []);

  return (
    <div>
      <h2>All Sessions</h2>
      <Link to="/create">Create Session</Link>
      <h3>Upcoming</h3>
      {upcoming.map(s => <SessionCard key={s.id} s={s} />)}
      <h3>Past</h3>
      {past.map(s => <SessionCard key={s.id} s={s} />)}
    </div>
  );
}
