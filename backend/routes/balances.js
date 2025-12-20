const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET BALANCES FOR LOGGED-IN USER
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      splitBetween: userId,
    })
      .populate("paidBy", "name email")
      .populate("splitBetween", "name email");

    const balanceMap = {};

    expenses.forEach((expense) => {
      const share = expense.amount / expense.splitBetween.length;

      expense.splitBetween.forEach((user) => {
        if (!balanceMap[user._id]) {
          balanceMap[user._id] = {
            userId: user._id,
            name: user.name,
            balance: 0,
          };
        }

        // everyone owes their share
        balanceMap[user._id].balance -= share;
      });

      // payer gets full amount
      const payerId = expense.paidBy._id;

      if (!balanceMap[payerId]) {
        balanceMap[payerId] = {
          userId: payerId,
          name: expense.paidBy.name,
          balance: 0,
        };
      }

      balanceMap[payerId].balance += expense.amount;
    });

    // remove self from list
    delete balanceMap[userId];

    res.json(Object.values(balanceMap));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
