const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendOTP } = require('../utils/mailer');
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, college, city } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already registered with this email." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user = new User({
            name,
            email,
            password,
            college,
            city,
            otp,
            isVerified: false
        });

        await user.save();
        await sendOTP(email, otp);

        res.status(200).json({
            msg: "Registration successful. Please check your email for OTP."
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ msg: "Invalid or expired OTP." });
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.status(200).json({ msg: "Account verified successfully!" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


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

        res.status(200).json({
            msg: "Login successful!",
            user: {
                name: user.name,
                email: user.email,
                college: user.college,
                city: user.city
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


router.post('/unick-ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ msg: "Prompt is required" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: prompt }
            ],
        });

        const aiReply = completion.choices[0].message.content;

        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ msg: "AI service unavailable" });
    }
});

router.get('/test-ai', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: "Hello AI, are you working?" }
            ],
        });

        res.send(completion.choices[0].message.content);
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

module.exports = router;
