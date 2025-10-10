import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SessionList from "./Pages/SessionList";
import CreateSession from "./Pages/CreateSession";
import SessionDetail from "./Pages/SessionDetail";
import "./styles/index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SessionList />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route
          path="/session/:id/manage"
          element={<SessionDetail isManage={true} />}
        />
      </Routes>
    </Router>
  );
}
