const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE */
router.post("/", authMiddleware, async (req, res) => {
  const { description, amount, paidBy, splitBetween } = req.body;

  const expense = await Expense.create({
    description,
    amount,
    paidBy,
    splitBetween,
    createdBy: req.user.id,
  });

  res.status(201).json(expense);
});

/* GET ALL */
router.get("/", authMiddleware, async (req, res) => {
  const expenses = await Expense.find({
    $or: [{ paidBy: req.user.id }, { splitBetween: req.user.id }],
  })
    .populate("paidBy", "username")
    .populate("splitBetween", "username")
    .sort({ createdAt: -1 });

  res.json(expenses);
});

/* GET ONE */
router.get("/:id", authMiddleware, async (req, res) => {
  const expense = await Expense.findById(req.params.id)
    .populate("paidBy", "username")
    .populate("splitBetween", "username");

  if (!expense) return res.status(404).json({ message: "Not found" });

  res.json(expense);
});

/* DELETE */
router.delete("/:id", authMiddleware, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
