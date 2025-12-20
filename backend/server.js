require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const expenseRoutes = require("./routes/expenses");
const balanceRoutes = require("./routes/balances");
const userRoutes = require("./routes/users");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/expenses", expenseRoutes);
app.use("/balances", balanceRoutes);
app.use("/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Splitwise backend is running 🚀");
});

// mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
