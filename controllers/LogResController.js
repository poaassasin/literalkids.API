const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database.js');

const registerUser = async (req, res) => {
    const { email, password, confirmpassword } = req.body;
    
    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (email, password, confirmpassword) VALUES (?, ?, ?)";
    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: "Error registering user", error: err });
        res.status(201).json({ message: "User registered successfully" });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Error logging in", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email },
            process.env.JWT_SECRET || "secret_key_default",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    });
};

module.exports = { registerUser, loginUser };
