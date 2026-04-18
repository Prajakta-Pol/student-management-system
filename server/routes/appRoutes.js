const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { generateResume } = require("../utils/resumeGenerator");
const { PDFDocument } = require("pdf-lib");

// =======================================
// 🎯 ADMIN CREATE EVENT (WITH QR TOKEN)
// =======================================
router.post("/admin/create-event", (req, res) => {
  const {
    title,
    description,
    organizer,
    location,
    eventDate,
    points,
    registrationLink,
    message
  } = req.body;

  const qrToken = Math.random().toString(36).substring(2, 12);

  db.run(
    `INSERT INTO events 
    (title, description, organizer, location, eventDate, points, qrToken, registrationLink, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      organizer,
      location,
      eventDate,
      points,
      qrToken,
      registrationLink,
      message
    ],
    function (err) {
       if (err) {
        console.log("DB ERROR:", err); // 🔥 ADD THIS
        return res.status(500).json({ error: err.message });
      }

      console.log("EVENT CREATED:", this.lastID, qrToken); // 🔥 DEBUG

      res.json({
        eventId: this.lastID,
        qrToken
      });
    }
  );
});


// =======================================
// 🎯 GET ALL EVENTS (STUDENTS)
// =======================================
router.get("/events", (req, res) => {
  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// =======================================
// 🎯 REGISTER EVENT (PREVENT DUPLICATES)
// =======================================
router.post("/register-event", (req, res) => {
  const { userId, eventId } = req.body;

  // check if already registered
  db.get(
    "SELECT * FROM event_registrations WHERE userId = ? AND eventId = ?",
    [userId, eventId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {
        return res.status(400).json({ error: "Already registered" });
      }

      db.run(
        "INSERT INTO event_registrations (userId, eventId) VALUES (?, ?)",
        [userId, eventId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
});


// =======================================
// 🎯 QR SCAN (MARK ATTENDANCE)
// =======================================
router.post("/scan-qr", (req, res) => {
  const { userId, eventId, qrToken } = req.body;

  db.get(
    "SELECT qrToken FROM events WHERE id = ?",
    [eventId],
    (err, event) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (event.qrToken !== qrToken) {
        return res.status(400).json({ error: "Invalid QR Code" });
      }

      // insert or ignore attendance
      db.run(
  `INSERT OR IGNORE INTO event_attendance 
   (userId, eventId, qrScanned, verified)
   VALUES (?, ?, 1, 1)`,
  [userId, eventId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            message: "Attendance marked (pending admin approval)"
          });
        }
      );
    }
  );
});


// =======================================
// 🎯 ADMIN APPROVE + GIVE POINTS
// =======================================
router.post("/admin/approve-attendance", (req, res) => {
  const { userId, eventId } = req.body;

  db.get(
    "SELECT points FROM events WHERE id = ?",
    [eventId],
    (err, event) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // mark verified
      db.run(
        `UPDATE event_attendance 
         SET verified = 1 
         WHERE userId = ? AND eventId = ?`,
        [userId, eventId]
      );

      // add points to user
      db.run(
        "UPDATE users SET points = COALESCE(points,0) + ? WHERE id = ?",
        [event.points, userId]
      );

      res.json({ message: "Points awarded successfully" });
    }
  );
});


// =======================================
// 🎯 OPTIONAL: GET USER ATTENDANCE
// =======================================
router.get("/user/:id/attendance", (req, res) => {
  const userId = req.params.id;

  db.all(
    `SELECT e.title, e.points, ea.verified
     FROM event_attendance ea
     JOIN events e ON e.id = ea.eventId
     WHERE ea.userId = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});


// =======================================
// 🎯 EXISTING FEATURES (KEEP YOURS)
// =======================================

// POSTS
router.post("/post", (req, res) => {
  const { userId, text } = req.body;

  db.run(
    "INSERT INTO posts (userId, text) VALUES (?, ?)",
    [userId, text],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Posted successfully" });
    }
  );
});

router.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
    res.json(rows);
  });
});


// COLLAB
router.post("/collab", (req, res) => {
  const { userId, title, skills } = req.body;

  db.run(
    "INSERT INTO collaborations (userId, title, skills) VALUES (?, ?, ?)",
    [userId, title, skills],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Collaboration request created" });
    }
  );
});

router.get("/collab", (req, res) => {
  db.all("SELECT * FROM collaborations ORDER BY id DESC", [], (err, rows) => {
    res.json(rows);
  });
});


router.get("/mentor/students", (req, res) => {
  db.all(
    "SELECT id, fullName, email, points FROM users WHERE role = 'student'",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.post("/mentor/feedback", (req, res) => {
  const { userId, mentorId, feedback, skillApproved } = req.body;

  db.run(
    `INSERT INTO mentor_feedback (userId, mentorId, feedback, skillApproved)
     VALUES (?, ?, ?, ?)`,
    [userId, mentorId, feedback, skillApproved],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Feedback submitted" });
    }
  );
});

router.get("/mentor/feedback/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    "SELECT * FROM mentor_feedback WHERE userId = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(rows);
    }
  );
});


router.post("/profile", (req, res) => {
  const {
    userId,
    fullName,
    usn,
    email,
    phone,
    department,
    college,
    goal,
    techSkills,
    softSkills,
    github,
    linkedin,
    portfolio,
    profileImage
  } = req.body;

  db.run(
    `
    INSERT INTO profiles (
      userId, fullName, usn, email, phone, department, college, goal,
      techSkills, softSkills, github, linkedin, portfolio, profileImage
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      fullName=excluded.fullName,
      usn=excluded.usn,
      email=excluded.email,
      phone=excluded.phone,
      department=excluded.department,
      college=excluded.college,
      goal=excluded.goal,
      techSkills=excluded.techSkills,
      softSkills=excluded.softSkills,
      github=excluded.github,
      linkedin=excluded.linkedin,
      portfolio=excluded.portfolio,
      profileImage=excluded.profileImage,
      updatedAt=CURRENT_TIMESTAMP
    `,
    [
      userId,
      fullName,
      usn,
      email,
      phone,
      department,
      college,
      goal,
      techSkills,
      softSkills,
      github,
      linkedin,
      portfolio,
      profileImage
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Profile saved successfully" });
    }
  );
});

router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;

  db.get(
    "SELECT * FROM profiles WHERE userId = ?",
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(row || {}); // ✅ IMPORTANT
    }
  );
});

// =======================================
// 🎯 FULL RESUME API (TEAMMATE FORMAT)
// =======================================
router.get("/resume/:userId", (req, res) => {
  const { userId } = req.params;

  // 1. GET BASIC PROFILE
  db.get(
    "SELECT * FROM profiles WHERE userId = ?",
    [userId],
    (err, profile) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!profile) return res.json({});

      // 2. GET ALL OTHER DATA
      db.all("SELECT * FROM academics WHERE userId = ?", [userId], (err, academics) => {
        db.all("SELECT * FROM skills WHERE userId = ?", [userId], (err, skills) => {
          db.all("SELECT * FROM projects WHERE userId = ?", [userId], (err, projects) => {
            db.all("SELECT * FROM certifications WHERE userId = ?", [userId], (err, certifications) => {
              db.all("SELECT * FROM interests WHERE userId = ?", [userId], (err, interests) => {

                // FINAL RESPONSE (IMPORTANT)
                res.json({
                  name: profile.fullName,
                  department: profile.department,
                  year: "3rd Year", // you can store later
                  email: profile.email,
                  phone: profile.phone,
                  bio: profile.goal,

                  academics: academics || [],

                  skills: (skills || []).map(s => ({
                    id: s.id,
                    name: s.name,
                    level: s.level
                  })),

                  projects: (projects || []).map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    techStack: p.techStack ? p.techStack.split(",") : []
                  })),

                  certifications: certifications || [],

                  interests: (interests || []).map(i => i.name)
                });

              });
            });
          });
        });
      });
    }
  );
});
router.post("/skill", (req, res) => {
  const { userId, name, level } = req.body;

  db.run(
    "INSERT INTO skills (userId, name, level) VALUES (?, ?, ?)",
    [userId, name, level],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Skill added" });
    }
  );
});
router.post("/project", (req, res) => {
  const { userId, title, description, techStack } = req.body;

  db.run(
    "INSERT INTO projects (userId, title, description, techStack) VALUES (?, ?, ?, ?)",
    [userId, title, description, techStack],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Project added" });
    }
  );
});
router.post("/academic", (req, res) => {
  const { userId, degree, field, institution, startYear, endYear, grade } = req.body;

  db.run(
    `INSERT INTO academics 
    (userId, degree, field, institution, startYear, endYear, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, degree, field, institution, startYear, endYear, grade],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Academic added" });
    }
  );
});

// =======================================
// 🎯 CREATE TEAM (FIXED)
// =======================================
router.post("/team/create", (req, res) => {
  const {
    creatorId,
    eventTitle,
    eventDescription,
    eventLink,
    totalMembers,
    currentMembers,
    requiredMembers,
    requiredSkills,
    email,
    linkedin
  } = req.body;

  // ✅ Only essential fields required
  if (!eventTitle || !requiredSkills || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO team_posts 
    (creatorId, eventTitle, eventDescription, eventLink, totalMembers, currentMembers, requiredMembers, requiredSkills, email, linkedin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      creatorId,
      eventTitle,
      eventDescription || "",
      eventLink || "",
      totalMembers || 0,
      currentMembers || 0,
      requiredMembers || 0,
      requiredSkills,
      email,
      linkedin || ""
    ],
    function (err) {
      if (err) {
        console.log("TEAM CREATE ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Team created successfully",
        id: this.lastID
      });
    }
  );
});

// GET ALL POSTS (FILTER SUPPORT)
router.get("/team", (req, res) => {
  const { skill, members } = req.query;

  let query = "SELECT * FROM team_posts WHERE 1=1";
  let params = [];

  if (skill) {
    query += " AND requiredSkills LIKE ?";
    params.push(`%${skill}%`);
  }

  if (members) {
    query += " AND requiredMembers = ?";
    params.push(members);
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// JOIN REQUEST
router.post("/team/join", (req, res) => {
  const { teamId, userId, message } = req.body;

  db.run(
    "INSERT INTO team_requests (teamId, userId, message) VALUES (?, ?, ?)",
    [teamId, userId, message],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Request sent" });
    }
  );
});
// =======================================
// 🎯 DASHBOARD DATA
// =======================================
router.get("/dashboard/:userId", (req, res) => {
  const userId = req.params.userId;

  let data = {};

  // 1. POINTS (already stored in users table)
  db.get(
    "SELECT points FROM users WHERE id = ?",
    [userId],
    (err, row) => {
      data.points = row?.points || 0;

      // 2. EVENTS ATTENDED
      db.get(
        "SELECT COUNT(*) as count FROM event_attendance WHERE userId=? AND verified=1",
        [userId],
        (err, events) => {
          data.events = events.count;

          // 3. CERTIFICATIONS
          db.get(
            "SELECT COUNT(*) as count FROM certifications WHERE userId=?",
            [userId],
            (err, certs) => {
              data.certifications = certs.count;

              // 4. COLLABORATIONS
              db.get(
                "SELECT COUNT(*) as count FROM collaborations WHERE userId=?",
                [userId],
                (err, collab) => {
                  data.collaborations = collab.count;

                  res.json(data);
                }
              );
            }
          );
        }
      );
    }
  );
});
// =======================================
// 🎯 CHECK ATTENDANCE STATUS
// =======================================
router.get("/check-attendance", (req, res) => {
  const { userId, eventId } = req.query;

  db.get(
    "SELECT * FROM event_attendance WHERE userId=? AND eventId=?",
    [userId, eventId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        attended: !!row,
        verified: row?.verified || 0
      });
    }
  );
});

// =======================================
// 🎯 GET TEAM REQUESTS
// =======================================
router.get("/team/requests/:teamId", (req, res) => {
  const { teamId } = req.params;

  db.all(
    `SELECT tr.id, tr.message, u.fullName, u.email
     FROM team_requests tr
     JOIN users u ON u.id = tr.userId
     WHERE tr.teamId = ?`,
    [teamId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(rows);
    }
  );
});

// =======================================
// 🎯 ACCEPT TEAM REQUEST
// =======================================
router.post("/team/accept", (req, res) => {
  const { requestId } = req.body;

  db.run(
    "DELETE FROM team_requests WHERE id = ?",
    [requestId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Request accepted ✅" });
    }
  );
});

// =======================================
// 🎯 ADMIN STATS (EVENT COUNT)
// =======================================
// =======================================
// 🎯 ADMIN STATS (COUNT + LIST)
// =======================================
router.get("/admin/stats", (req, res) => {

  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      totalEvents: rows.length,
      events: rows
    });
  });

});

module.exports = router;