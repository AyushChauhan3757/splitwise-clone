const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("paidBy", "username")
      .populate("splitBetween", "username");

    const balances = {};

    expenses.forEach(exp => {
      const share = exp.amount / exp.splitBetween.length;

      exp.splitBetween.forEach(user => {
        if (user._id.toString() === exp.paidBy._id.toString()) return;

        balances[user._id] ??= { user, amount: 0 };
        balances[user._id].amount -= share;

        balances[exp.paidBy._id] ??= { user: exp.paidBy, amount: 0 };
        balances[exp.paidBy._id].amount += share;
      });
    });

    res.json(Object.values(balances));
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate balances" });
  }
});

module.exports = router;
