const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

// ✅ FORCE DB LOCATION (ONLY ONE DB FILE)
const dbPath = path.resolve(__dirname, "../database.sqlite");

console.log("📦 DATABASE LOCATION:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else console.log("✅ Connected to SQLite DB");
});

db.serialize(() => {

  // =========================
  // 👤 USERS TABLE
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT,
      role TEXT CHECK(role IN ('student','mentor','admin')) NOT NULL,
      points INTEGER DEFAULT 0
    )
  `);

  // =========================
  // 🎯 EVENTS TABLE
  // =========================
  db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    organizer TEXT,
    location TEXT,
    eventDate TEXT,
    points INTEGER DEFAULT 0,
    qrToken TEXT,
    registrationLink TEXT,
    message TEXT,
    status TEXT DEFAULT 'active'
  )
`);

  // =========================
  // 🧾 EVENT REGISTRATION
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      eventId INTEGER,
      status TEXT DEFAULT 'registered'
    )
  `);

  // =========================
  // 📍 EVENT ATTENDANCE
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS event_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      eventId INTEGER,
      qrScanned INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0
    )
  `);

  // =========================
  // 📝 POSTS / FEED
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      text TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // =========================
  // 🤝 COLLABORATION
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS collaborations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      skills TEXT,
      status TEXT DEFAULT 'open'
    )
  `);

  // =========================
  // 🧑‍🏫 MENTOR FEEDBACK
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS mentor_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      mentorId INTEGER,
      feedback TEXT
    )
  `);
  //db.run(`
 //DROP TABLE IF EXISTS events;
//`);
  db.run(`
  CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER UNIQUE,

  fullName TEXT,
  usn TEXT,
  email TEXT,
  phone TEXT,
  department TEXT,
  college TEXT,
  goal TEXT,

  techSkills TEXT,
  softSkills TEXT,

  github TEXT,
  linkedin TEXT,
  portfolio TEXT,

  profileImage TEXT,  -- ✅ NEW COLUMN

  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
// =========================
  // 🎓 ACADEMICS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS academics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      degree TEXT,
      field TEXT,
      institution TEXT,
      startYear TEXT,
      endYear TEXT,
      grade TEXT
    )
  `);

  // =========================
  // 🛠 SKILLS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT,
      level TEXT
    )
  `);

  // =========================
  // 🚀 PROJECTS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      description TEXT,
      techStack TEXT
    )
  `);

  // =========================
  // 📜 CERTIFICATIONS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      issuer TEXT,
      date TEXT
    )
  `);

  // =========================
  // 🎯 INTERESTS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT
    )
  `);


  // =========================
  // 👑 AUTO ADMIN SEED
  // =========================
  const adminEmail = "admin@campus.com";

  db.get("SELECT id FROM users WHERE email = ?", [adminEmail], (err, row) => {
    if (!row) {
      const hashed = bcrypt.hashSync("admin123", 8);

      db.run(
        `INSERT INTO users (fullName, email, password, phone, role)
         VALUES (?, ?, ?, ?, ?)`,
        ["Admin", adminEmail, hashed, "0000000000", "admin"]
      );

      console.log("👑 Admin created");
    } else {
      console.log("👑 Admin already exists");
    }
  });

});

// =========================
// 👥 TEAM POSTS
// =========================
db.run(`
  CREATE TABLE IF NOT EXISTS team_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creatorId INTEGER NOT NULL,
    eventTitle TEXT NOT NULL,
    eventDescription TEXT,
    eventLink TEXT,
    totalMembers INTEGER NOT NULL,
    currentMembers INTEGER NOT NULL,
    requiredMembers INTEGER NOT NULL,
    requiredSkills TEXT NOT NULL,
    email TEXT NOT NULL,
    linkedin TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =========================
// 📩 TEAM REQUESTS
// =========================
db.run(`
  CREATE TABLE IF NOT EXISTS team_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamId INTEGER,
    userId INTEGER,
    message TEXT,
    status TEXT DEFAULT 'pending'
  )
`);
module.exports = db;