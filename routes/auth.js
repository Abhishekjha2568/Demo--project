const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const { sendOTP } = require('../utils/mailer'); // ❌ TEMPORARILY DISABLED

/* =========================
   SIGNUP ROUTE
========================= */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, college, city } = req.body;

        // Check existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already registered with this email." });
        }

        // Generate OTP (for logic demo)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user (AUTO VERIFIED FOR DEMO)
        user = new User({
            name,
            email,
            password,
            college,
            city,
            otp,
            isVerified: true   // ✅ AUTO VERIFIED (NO EMAIL NEEDED)
        });

        await user.save();

        // ❌ Email sending disabled due to Railway SMTP timeout
        // await sendOTP(email, otp);

        console.log("OTP generated (demo only):", otp);

        return res.status(200).json({
            msg: "Registration successful."
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   VERIFY OTP ROUTE
   (KEPT FOR EXPLANATION)
========================= */
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ msg: "Invalid OTP." });
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();

        return res.status(200).json({ msg: "Account verified successfully!" });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   LOGIN ROUTE
========================= */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: "Please verify your account first." });
        }

        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        return res.status(200).json({
            msg: "Login successful!",
            user: {
                name: user.name,
                email: user.email,
                college: user.college,
                city: user.city
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
