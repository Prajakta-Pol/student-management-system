const db = require("../config/db");
const { PDFDocument, rgb } = require("pdf-lib");

exports.generateResume = async (req, res) => {
  const { userId } = req.params;

  try {
    // 🔹 GET PROFILE
    db.get(
      "SELECT * FROM profiles WHERE userId = ?",
      [userId],
      async (err, profile) => {
        if (err) return res.status(500).json({ error: err.message });

        // 🔹 GET POSTS (ACHIEVEMENTS)
        db.all(
          "SELECT * FROM posts WHERE userId = ?",
          [userId],
          async (err2, posts) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // 🔥 CREATE PDF
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);

            let y = 750;

            const drawText = (text, size = 12) => {
              page.drawText(text, {
                x: 50,
                y: y,
                size,
              });
              y -= 20;
            };

            // 🔥 HEADER
            drawText(profile?.fullName || "Student Name", 18);
            drawText(profile?.email || "");
            drawText(profile?.phone || "");

            y -= 10;

            // 🔥 SKILLS
            drawText("Skills:", 14);
            drawText(profile?.techSkills || "-");

            y -= 10;

            // 🔥 GOAL
            drawText("Career Objective:", 14);
            drawText(profile?.goal || "-");

            y -= 10;

            // 🔥 ACHIEVEMENTS
            drawText("Achievements:", 14);

            if (posts.length === 0) {
              drawText("No achievements");
            } else {
              posts.forEach((p) => {
                drawText("• " + p.text);
              });
            }

            // SAVE PDF
            const pdfBytes = await pdfDoc.save();

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

            res.send(Buffer.from(pdfBytes));
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};