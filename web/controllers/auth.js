const bcrypt = require("bcrypt");
const db = require("../utils/db");

exports.login = async (req, res) => {
  const { username, password, loginMethod } = req.body;

  if (loginMethod === 'local') {
    // Existing local database authentication logic
    const user = await db("users").where({ username }).first();
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to regenerate session" });
      }

      // save session
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username; // Store username in session

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save session" });
        }
        res.json({ message: "Login successful", user: { username, role: user.role } });
      });
    });
  } else {
    // Handle other authentication methods (e.g., FreeIPA, LDAP) in the future
    return res.status(400).json({ error: "Unsupported login method" });
  }
};

exports.refresh = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  req.session.touch(); // extend expiry
  res.json({ message: "Session refreshed" });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};
