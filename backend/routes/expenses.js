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
      createdBy: req.user.id,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL EXPENSES (where user is involved)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      splitBetween: req.user.id,
    })
      .populate("paidBy", "name email")
      .populate("splitBetween", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE EXPENSE (only creator)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
