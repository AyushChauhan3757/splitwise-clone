const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// GET all expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("paidBy", "username")
      .populate("splitBetween", "username")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// CREATE expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;

    const expense = new Expense({
      description,
      amount,
      paidBy,
      splitBetween,
      createdBy: req.user.id,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
});

module.exports = router;
