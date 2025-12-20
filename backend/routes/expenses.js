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
 * GET ALL EXPENSES INVOLVING USER
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const expenses = await Expense.find({
    $or: [{ paidBy: userId }, { splitBetween: userId }],
  })
    .populate("paidBy", "username name")
    .populate("splitBetween", "username name")
    .sort({ createdAt: -1 });

  res.json(expenses);
});

/**
 * GET SINGLE EXPENSE DETAILS
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("paidBy", "username name")
      .populate("splitBetween", "username name");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE EXPENSE
 */
router.delete("/:id", authMiddleware, async (req, res) => {
