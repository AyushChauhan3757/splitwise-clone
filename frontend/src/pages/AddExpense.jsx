import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [users, setUsers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
  }, []);

  const toggleUser = (id) => {
    setSplitBetween(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        description,
        amount: Number(amount),
        paidBy,
        splitBetween
      });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save expense");
    }
  };

  return (
    <div className="container">
      <h2>Add Expense</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />

        <select
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          required
        >
          <option value="">Paid by</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>

        <div className="checkbox-group">
          {users.map(u => (
            <label key={u._id} className="checkbox-item">
              <input
                type="checkbox"
                checked={splitBetween.includes(u._id)}
                onChange={() => toggleUser(u._id)}
              />
              <div className="checkbox-pill" />
              {u.username}
            </label>
          ))}
        </div>

        <button className="btn-primary" type="submit">
          Save Expense
        </button>
      </form>
    </div>
  );
}
