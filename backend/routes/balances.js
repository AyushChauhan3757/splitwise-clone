const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");
const User = require("../models/User");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [{ paidBy: userId }, { splitBetween: userId }],
    })
      .populate("paidBy", "username")
      .populate("splitBetween", "username");

    const balanceMap = {};

    expenses.forEach((expense) => {
      const splitAmount = expense.amount / expense.splitBetween.length;

      expense.splitBetween.forEach((u) => {
        if (u._id.toString() === expense.paidBy._id.toString()) return;

        if (!balanceMap[u._id]) {
          balanceMap[u._id] = {
            user: u,
            amount: 0,
          };
        }

        if (expense.paidBy._id.toString() === userId) {
          // they owe you
          balanceMap[u._id].amount += splitAmount;
        } else if (u._id.toString() === userId) {
          // you owe them
          balanceMap[expense.paidBy._id] =
            balanceMap[expense.paidBy._id] || {
              user: expense.paidBy,
              amount: 0,
            };
          balanceMap[expense.paidBy._id].amount -= splitAmount;
        }
      });
    });

    res.json(Object.values(balanceMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to calculate balances" });
  }
});

module.exports = router;
