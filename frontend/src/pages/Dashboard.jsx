import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [e, b] = await Promise.all([
        API.get("/expenses"),
        API.get("/balances"),
      ]);
      setExpenses(e.data || []);
      setBalances(b.data || []);
    } catch {
      console.error("Failed to load dashboard data");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Splitzy</h2>
      <div className="welcome">
        Logged in as <b>{user?.username || "User"}</b>
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={() => navigate("/add")}>
          + Add Expense
        </button>
        <button className="btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <h3>Balances</h3>
      {balances.map(b => (
        <div key={b.user?._id} className="balance-item">
          <span>{b.user?.username || "Unknown"}</span>
          <span className={b.amount > 0 ? "balance-positive" : "balance-negative"}>
            ₹{Math.abs(b.amount)}
          </span>
        </div>
      ))}

      <h3>Expenses</h3>
      {expenses.map(e => (
        <div key={e._id} className="expense-card">
          <div>
            <div className="expense-title">{e.description}</div>
            <div className="expense-amount">₹{e.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
