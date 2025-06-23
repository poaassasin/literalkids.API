const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require('../config/database.js');


router.post("/register", async (req, res) => {
  const { email, password, confirmpassword } = req.body;
    if (!email || !password || !confirmpassword) 
      return res.status(400).json({ error: "Email and password required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered", id: result.insertId });
    }
  );
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    // Query ke tabel 'users' untuk mendapatkan data user
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Error logging in" });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Membuat payload respon yang lengkap dan benar
        const responsePayload = {
            message: "Login successful",
            token: token,
            // Membungkus ID, email, dan NAMA dalam objek 'user'
            user: {
                id: user.id,
                email: user.email,
                name: user.name // 'name' diambil dari tabel 'users'
            }
        };

        // Mengirim respon yang sudah lengkap
        res.json(responsePayload);
    });
});

router.get("/", (req, res) => {
  db.query("SELECT id, email, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  db.query("SELECT id, email, created_at FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
});

module.exports = router;
