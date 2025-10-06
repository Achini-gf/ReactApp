const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// In-memory sessions data (example)
let sessions = [
  { id: 1, name: "Yoga", date: "2025-10-01" },
  { id: 2, name: "Meditation", date: "2025-10-05" },
  { id: 3, name: "Painting", date: "2025-09-20" }
];

// GET all sessions
app.get("/api/sessions", (req, res) => {
  const upcoming = sessions.filter(s => new Date(s.date) >= new Date());
  const past = sessions.filter(s => new Date(s.date) < new Date());
  res.json({ upcoming, past });
});

// GET session by ID
app.get("/api/sessions/:id", (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// POST new session
app.post("/api/sessions", (req, res) => {
  const { name, date } = req.body;
  const newSession = { id: sessions.length + 1, name, date };
  sessions.push(newSession);
  res.status(201).json(newSession);
});
app.get('/', (req, res) => {
  res.send('Welcome! Backend is running at /api/test and /api/sessions');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
