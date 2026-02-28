import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("resumexpert.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    analysis TEXT,
    score INTEGER,
    ats_score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    resume_id INTEGER,
    questions TEXT,
    feedback TEXT,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(resume_id) REFERENCES resumes(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Simple Auth Mock (for demo purposes)
  app.post("/api/auth/login", (req, res) => {
    const { email, name } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      const result = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run(email, name);
      user = { id: result.lastInsertRowid, email, name, role: 'user' };
    }
    res.json(user);
  });

  // Admin Stats
  app.get("/api/admin/stats", (req, res) => {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const resumeCount = db.prepare("SELECT COUNT(*) as count FROM resumes").get() as any;
    const interviewCount = db.prepare("SELECT COUNT(*) as count FROM interviews").get() as any;
    res.json({
      users: userCount.count,
      resumes: resumeCount.count,
      interviews: interviewCount.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
