const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SECRET KEY (Keep same in entire project)
const SECRET = "SECRET123";

// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if existing user
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.json({ success: false, message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, SECRET);

        res.json({ success: true, message: "Signup Successful", token });
    } catch (error) {
        res.json({ success: false, message: "Signup Failed" });
    }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user)
        return res.json({ success: false, message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.json({ success: false, message: "Incorrect password" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, SECRET);

    res.json({ success: true, message: "Login Successful", token });
});

module.exports = router;
