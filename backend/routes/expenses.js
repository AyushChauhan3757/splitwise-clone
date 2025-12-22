const router = require("express").Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      splitBetween,
      createdBy: req.user.id, // ✅ ALWAYS from token
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
