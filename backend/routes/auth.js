const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
//const auth = require("../middleware/auth");

const router = express.Router();

// Register for Intern only
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email ends with @slt.com
  if (!email || !email.endsWith("@slt.com")) {
    return res.status(400).json({ msg: "Only @slt.com email addresses are allowed" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role: "intern" });
  await newUser.save();

  res.status(201).json({ msg: "Intern registered successfully" });
});

// Login (Admin or Intern)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email ends with @slt.com (case-insensitive)
  if (!email || !email.toLowerCase().endsWith("@slt.com")) {
    return res.status(400).json({ msg: "Only @slt.com email addresses are allowed" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
// Logout (handled client-side, but here for API consistency)
router.post("/logout", async (req, res) => {
  // Nothing to invalidate on server (stateless JWT)
  res.status(200).json({ msg: "Logout successful. Please remove token from client." });
});

const auth = require("../middleware/auth"); // Add this at the top if not already imported

// Admin-only: Get all intern users
router.get("/interns", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Forbidden");

  try {
    const interns = await User.find({ role: "intern" }).select("name email _id");
    res.json(interns);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
