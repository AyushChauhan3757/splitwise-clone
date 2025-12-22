const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// CREATE EXPENSE
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;

    if (!description || !amount || !paidBy || !splitBetween?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = new Expense({
      description,
      amount,
      paidBy,
      splitBetween,
      createdBy: req.user.id // ✅ FIXED HERE
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL EXPENSES
router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({ createdBy: req.user.id })
    .populate("paidBy", "username")
    .populate("splitBetween", "username")
    .sort({ createdAt: -1 });

  res.json(expenses);
});

// GET SINGLE EXPENSE
router.get("/:id", auth, async (req, res) => {
  const expense = await Expense.findById(req.params.id)
    .populate("paidBy", "username")
    .populate("splitBetween", "username");

  if (!expense) return res.status(404).json({ message: "Not found" });
  res.json(expense);
});

// DELETE EXPENSE
router.delete("/:id", auth, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
});

module.exports = router;
