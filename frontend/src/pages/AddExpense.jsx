import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  const toggleUser = (id) => {
    setSplitBetween((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/expenses", {
        description,
        amount: Number(amount),
        paidBy,
        splitBetween,
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

        <label>Paid By</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          required
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>

        <label>Split Between</label>
        {users.map((u) => (
          <div key={u._id}>
            <input
              type="checkbox"
              checked={splitBetween.includes(u._id)}
              onChange={() => toggleUser(u._id)}
            />
            {u.username}
          </div>
        ))}

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}
