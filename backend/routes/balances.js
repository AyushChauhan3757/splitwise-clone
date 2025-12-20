const express = require("express");
const Expense = require("../models/Expense");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET NET BALANCES FOR LOGGED-IN USER
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const balances = {};

  const expenses = await Expense.find()
    .populate("paidBy", "username name")
    .populate("splitBetween", "username name");

  expenses.forEach((expense) => {
    const share = expense.amount / expense.splitBetween.length;

    expense.splitBetween.forEach((user) => {
      if (user._id.toString() === userId) return;

      if (!balances[user._id]) {
        balances[user._id] = {
          userId: user._id,
          name: user.name,
          username: user.username,
          balance: 0,
        };
      }

      // If I paid → others owe me
      if (expense.paidBy._id.toString() === userId) {
        balances[user._id].balance += share;
      }

      // If someone else paid → I owe them
      if (
        user._id.toString() === userId &&
        expense.paidBy._id.toString() !== userId
      ) {
        balances[expense.paidBy._id].balance -= share;
      }
    });

    // Special case: someone else paid and I am in split
    if (
      expense.paidBy._id.toString() !== userId &&
      expense.splitBetween.some(
        (u) => u._id.toString() === userId
      )
    ) {
      const payer = expense.paidBy;

      if (!balances[payer._id]) {
        balances[payer._id] = {
          userId: payer._id,
          name: payer.name,
          username: payer.username,
          balance: 0,
        };
      }

      balances[payer._id].balance -= share;
    }
  });

  res.json(Object.values(balances));
});

module.exports = router;
