import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function CreateSession() {
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    maxParticipants: 10, sessionType: 'public',
    location: '', creatorEmail: ''
  });
  const [result, setResult] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    fetch(API + '/sessions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    }).then(r => r.json()).then(setResult);
  }

  return (
    <div>
      <h2>Create Session</h2>
      <form onSubmit={onSubmit}>
        <div><input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/></div>
        <div><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div>
        <div><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required/></div>
        <div><input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required/></div>
        <div><input type="number" min="1" value={form.maxParticipants} onChange={e=>setForm({...form, maxParticipants:Number(e.target.value)})} required/></div>
        <div>
          <select value={form.sessionType} onChange={e=>setForm({...form, sessionType:e.target.value})}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div><input placeholder="Location (optional)" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} /></div>
        <div><input placeholder="Creator email (optional)" value={form.creatorEmail} onChange={e=>setForm({...form, creatorEmail:e.target.value})} /></div>
        <button type="submit">Create</button>
      </form>

      {result && (
        <div style={{ marginTop: 12, padding: 12, border: '1px dashed green' }}>
          <strong>Session created!</strong>
          <div>ID: {result.id}</div>
          <div>Management code: <code>{result.managementCode}</code></div>
          <div>Management URL: <code>{result.managementUrl}</code></div>
          <div>You must save the management code to edit/delete/manage attendees.</div>
        </div>
      )}
    </div>
  );
}
