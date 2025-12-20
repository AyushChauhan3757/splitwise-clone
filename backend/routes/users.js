const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET ALL USERS (id + username only)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "_id username name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
