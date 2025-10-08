import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory session data
let sessions = [];

// Generate random code
function generateCode() {
  return Math.random().toString(36).substring(2, 10);
}

// ============================
// ROUTES
// ============================

// Get all sessions
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// Get one session
app.get("/api/sessions/:id", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });
  res.json(session);
});

// Create a new session
app.post("/api/sessions", (req, res) => {
  const { title, description, date, time, maxParticipants, type } = req.body;
  if (!title || !date || !time)
    return res.status(400).json({ message: "Missing required fields" });

  const newSession = {
    id: uuidv4(),
    title,
    description,
    date,
    time,
    maxParticipants: Number(maxParticipants),
    type,
    attendees: [],
    managementCode: generateCode(),
  };

  sessions.push(newSession);
  res.json({
    id: newSession.id,
    managementCode: newSession.managementCode,
  });
});

// Join session (with name)
app.post("/api/sessions/:id/attend", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session)
    return res.status(404).json({ message: "Session not found" });

  const name = req.body.name || "Anonymous";
  const code = generateCode();

  if (session.attendees.length >= session.maxParticipants) {
    return res.status(400).json({ message: "Session is full" });
  }

  session.attendees.push({ id: uuidv4(), name, code });
  res.json({ attendanceCode: code });
});

// Leave session
app.delete("/api/sessions/:id/attend", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session)
    return res.status(404).json({ message: "Session not found" });

  const { attendanceCode } = req.body;
  session.attendees = session.attendees.filter((a) => a.code !== attendanceCode);
  res.json({ message: "Left session" });
});

// Delete session (admin)
app.delete("/api/sessions/:id", (req, res) => {
  const { managementCode } = req.body;
  const index = sessions.findIndex((s) => s.id === req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Session not found" });

  if (sessions[index].managementCode !== managementCode)
    return res.status(403).json({ message: "Invalid management code" });

  sessions.splice(index, 1);
  res.json({ message: "Session deleted" });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
