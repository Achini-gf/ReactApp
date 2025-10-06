// --- server.js ---
// Hobby Session Management Backend
// Features: create/list/view/edit/delete sessions, manage attendance
// Uses JSON file storage (auto-created if missing)

import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import path from "path";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Paths ---
const dataDir = path.join(process.cwd(), "backend", "data");
const sessionsFile = path.join(dataDir, "sessions.json");

// Ensure data directory and file exist
fs.ensureDirSync(dataDir);
if (!fs.existsSync(sessionsFile)) {
  fs.writeJsonSync(sessionsFile, []);
}

// --- Helper Functions ---
const readSessions = async () => await fs.readJson(sessionsFile);
const writeSessions = async (data) => await fs.writeJson(sessionsFile, data, { spaces: 2 });

// --- Routes ---

// 1️⃣ Get all PUBLIC sessions
app.get("/sessions", async (req, res) => {
  const sessions = await readSessions();
  const publicSessions = sessions.filter((s) => s.sessionType === "public");
  res.json(publicSessions);
});

// 2️⃣ Get session by ID (public or private)
app.get("/session/:id", async (req, res) => {
  const { id } = req.params;
  const sessions = await readSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) return res.status(404).json({ message: "Session not found" });
  res.json(session);
});

// 3️⃣ Create a new session
app.post("/session", async (req, res) => {
  const { title, description, date, time, maxParticipants, sessionType } = req.body;

  if (!title || !date || !time || !sessionType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newSession = {
    id: uuidv4(),
    title,
    description,
    date,
    time,
    maxParticipants: maxParticipants || 0,
    sessionType,
    participants: [],
    managementCode: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  const sessions = await readSessions();
  sessions.push(newSession);
  await writeSessions(sessions);

  res.status(201).json({
    message: "Session created successfully",
    sessionId: newSession.id,
    managementUrl: `/session/${newSession.id}/manage?code=${newSession.managementCode}`,
  });
});

// 4️⃣ Edit a session (requires management code)
app.put("/session/:id", async (req, res) => {
  const { id } = req.params;
  const { code, ...updates } = req.body;

  const sessions = await readSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === id);

  if (sessionIndex === -1) return res.status(404).json({ message: "Session not found" });
  if (sessions[sessionIndex].managementCode !== code)
    return res.status(403).json({ message: "Invalid management code" });

  sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
  await writeSessions(sessions);

  res.json({ message: "Session updated", session: sessions[sessionIndex] });
});

// 5️⃣ Delete a session (requires management code)
app.delete("/session/:id", async (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  const sessions = await readSessions();
  const session = sessions.find((s) => s.id === id);

  if (!session) return res.status(404).json({ message: "Session not found" });
  if (session.managementCode !== code)
    return res.status(403).json({ message: "Invalid management code" });

  const filtered = sessions.filter((s) => s.id !== id);
  await writeSessions(filtered);
  res.json({ message: "Session deleted" });
});

// 6️⃣ Attend a session (join)
app.post("/session/:id/attend", async (req, res) => {
  const { id } = req.params;
  const sessions = await readSessions();
  const session = sessions.find((s) => s.id === id);

  if (!session) return res.status(404).json({ message: "Session not found" });

  if (session.maxParticipants && session.participants.length >= session.maxParticipants) {
    return res.status(400).json({ message: "Session is full" });
  }

  const attendanceCode = uuidv4();
  session.participants.push({ attendanceCode });

  await writeSessions(sessions);
  res.json({
    message: "You have joined the session",
    attendanceCode,
  });
});

// 7️⃣ Leave a session (with attendance code)
app.post("/session/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { attendanceCode } = req.body;

  const sessions = await readSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const before = session.participants.length;
  session.participants = session.participants.filter((p) => p.attendanceCode !== attendanceCode);

  if (before === session.participants.length)
    return res.status(400).json({ message: "Invalid attendance code" });

  await writeSessions(sessions);
  res.json({ message: "You have left the session" });
});

// 8️⃣ Remove participant (by management code)
app.post("/session/:id/manage/remove", async (req, res) => {
  const { id } = req.params;
  const { code, attendanceCode } = req.body;

  const sessions = await readSessions();
  const session = sessions.find((s) => s.id === id);

  if (!session) return res.status(404).json({ message: "Session not found" });
  if (session.managementCode !== code)
    return res.status(403).json({ message: "Invalid management code" });

  session.participants = session.participants.filter(
    (p) => p.attendanceCode !== attendanceCode
  );
  await writeSessions(sessions);
  res.json({ message: "Participant removed" });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
