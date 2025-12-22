const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");

// ✅ GET all expenses
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

// ✅ CREATE expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.create({
      description: req.body.description,
      amount: req.body.amount,
      paidBy: req.body.paidBy,
      splitBetween: req.body.splitBetween,
      createdBy: req.user.id, // 🔥 IMPORTANT
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE expense
router.delete("/:id", authMiddleware, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
});

module.exports = router;
