const axios = require("axios");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ✅ SIGNUP
exports.signup = async (req, res) => {
  const { fullName, email, password, phone, role, captcha } = req.body;

  // 1. Check captcha exists
  if (!captcha) {
    return res.status(400).json({ error: "Captcha required" });
  }
  // ✅ Skip captcha for mobile
  if (captcha !== "mobile-bypass") {
  // 2. Verify captcha with Google
  try {
    const verify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret:process.env.RECAPTCHA_SECRET,
          response: captcha
        }
      }
    );

    if (!verify.data.success) {
      return res.status(400).json({ error: "Captcha failed" });
    }

  } catch (err) {
    return res.status(500).json({ error: "Captcha verification error" });
  }
}

  // 3. Continue signup
  const hashedPassword = require("bcryptjs").hashSync(password, 8);

  const query = `
    INSERT INTO users (fullName, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [fullName, email, hashedPassword, phone, role], (err) => {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: "User created successfully" });
  });
};
// ✅ LOGIN (using EMAIL instead of USN)

exports.login = async (req, res) => {
  const { email, password, captcha } = req.body;

  // 1. CAPTCHA CHECK
  if (!captcha) {
    return res.status(400).json({ error: "Captcha required" });
  }
  // ✅ Skip captcha for mobile
  if (captcha !== "mobile-bypass") {
  try {
    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret:process.env.RECAPTCHA_SECRET, // ✅ FIXED
          response: captcha
        }
      }
    );

    if (!verify.data.success) {
      return res.status(400).json({ error: "Captcha failed" });
    }

  } catch (err) {
    return res.status(500).json({ error: "Captcha verification error" });
  }
}

  // 2. LOGIN CHECK
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const valid = bcrypt.compareSync(password, user.password);

      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // 3. SUCCESS RESPONSE
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.fullName,
          role: user.role
        }
      });
    }
  );
};