const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET ALL EXPENSES FOR LOGGED IN USER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      splitBetween: req.user.id,
    })
      .populate("paidBy", "username")
      .populate("createdBy", "username")
      .populate("splitBetween", "username")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});


// DELETE EXPENSE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
