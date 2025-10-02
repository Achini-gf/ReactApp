import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [name, setName] = useState('');
  const [managementCode, setManagementCode] = useState('');
  const [manageView, setManageView] = useState(null);

  useEffect(() => {
    fetch(API + '/sessions/' + id).then(r => r.json()).then(setSession);
  }, [id]);

  async function join() {
    const res = await fetch(`${API}/sessions/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.attendanceCode) {
      setAttendanceCode(data.attendanceCode);
      alert('Joined! Keep your attendance code to unjoin.');
      localStorage.setItem(`attendance_${id}`, data.attendanceCode);
    } else {
      alert('Error: ' + (data.error || 'unknown'));
    }
    const s = await (await fetch(API + '/sessions/' + id)).json();
    setSession(s);
  }

  async function unjoinWithSavedCode() {
    const code = localStorage.getItem(`attendance_${id}`);
    if (!code) return alert('No saved attendance code for this session.');
    await fetch(`${API}/sessions/${id}/unjoin`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ attendanceCode: code })
    });
    localStorage.removeItem(`attendance_${id}`);
    setAttendanceCode(null);
    const s = await (await fetch(API + '/sessions/' + id)).json();
    setSession(s);
    alert('Removed attendance.');
  }

  async function loadManage() {
    const r = await fetch(`${API}/sessions/${id}/manage?code=${managementCode}`);
    if (r.status !== 200) {
      const err = await r.json().catch(()=>({error:'unknown'}));
      return alert('Manager access failed: ' + (err.error || r.status));
    }
    setManageView(await r.json());
  }

  async function creatorRemove(attCode) {
    if (!managementCode) return alert('You need to enter management code.');
    await fetch(`${API}/sessions/${id}/manage/remove-attendee`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ managementCode, attendanceCode: attCode })
    });
    alert('Removed attendee.');
    loadManage();
    const s = await (await fetch(API + '/sessions/' + id)).json();
    setSession(s);
  }

  if (!session) return <div>Loading...</div>;

  return (
    <div>
      <h2>{session.title}</h2>
      <div>{session.date} {session.time}</div>
      <div>{session.description}</div>
      <div>Attending: {session.attendeesCount}</div>

      <h3>Join</h3>
      <div>
        <input placeholder="Your name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={join}>I'm going</button>
        <div>
          <button onClick={unjoinWithSavedCode}>Not going (use saved code)</button>
        </div>
      </div>

      <h3>Creator management</h3>
      <div>
        <input placeholder="Management code" value={managementCode} onChange={e=>setManagementCode(e.target.value)} />
        <button onClick={loadManage}>Load management view</button>
      </div>

      {manageView && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #ccc' }}>
          <h4>Manage: Attendees</h4>
          <ul>
            {manageView.attendees.map(a => (
              <li key={a.code}>
                {a.name || 'Anonymous'} — code: <code>{a.code}</code>
                <button style={{ marginLeft: 8 }} onClick={()=>creatorRemove(a.code)}>Remove</button>
              </li>
            ))}
          </ul>
          <h4>Session actions</h4>
          <button onClick={async ()=>{
            const newTitle = prompt('New title', manageView.title);
            if (!newTitle) return;
            await fetch(`${API}/sessions/${id}/manage?code=${managementCode}`, {
              method: 'PUT',
              headers: { 'Content-Type':'application/json' },
              body: JSON.stringify({ title: newTitle })
            });
            alert('Updated');
            loadManage();
          }}>Edit title</button>
          <button onClick={async ()=>{
            if (!confirm('Delete session? This cannot be undone.')) return;
            await fetch(`${API}/sessions/${id}/manage?code=${managementCode}`, { method: 'DELETE' });
            alert('Deleted. Going back to list.');
            window.location.href = '/';
          }}>Delete session</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Link to="/">Back to list</Link>
      </div>
    </div>
  );
}
