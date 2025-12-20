const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE EXPENSE
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;

    if (!description || !amount || !paidBy || !splitBetween?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      splitBetween,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL EXPENSES INVOLVING LOGGED-IN USER
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { splitBetween: userId }
      ]
    })
      .populate("paidBy", "username name")
      .populate("splitBetween", "username name")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
