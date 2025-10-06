import React from 'react';
import { BrowserRouter, Routes, Route,NavLink } from 'react-router-dom';
import './App.css';

import AllSessions from './pages/AllSessions';
import CreateSession from './pages/CreateSession';
import SessionDetails from './pages/SessionDetails';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <h1>🎨 Hobby Sessions</h1>
        {/* Navigation Bar */}
        <nav className="navbar">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            All Sessions
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => isActive ? "active" : ""}>
            Create Session
          </NavLink>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<AllSessions />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/session/:id" element={<SessionDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
