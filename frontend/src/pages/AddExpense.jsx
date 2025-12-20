import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/expenses", {
        description,
        amount: Number(amount),
        paidBy,
        splitBetween: splitBetween.split(",").map((id) => id.trim()),
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="container">
      <h2>Add Expense</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          placeholder="Paid By (User ID)"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          required
        />

        <input
          placeholder="Split Between (comma separated User IDs)"
          value={splitBetween}
          onChange={(e) => setSplitBetween(e.target.value)}
          required
        />

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}
