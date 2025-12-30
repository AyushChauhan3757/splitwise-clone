import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!localStorage.getItem("token") || !user) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const e = await API.get("/expenses");
      const b = await API.get("/balances");
      setExpenses(e.data);
      setBalances(b.data);
    } catch {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <h2>Splitzy</h2>
      <div className="welcome">Logged in as <b>{user?.username}</b></div>

      <div className="actions">
        <button className="btn-primary" onClick={() => navigate("/add")}>
          + Add Expense
        </button>
        <button className="btn-danger" onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      <h3>Balances</h3>
      {balances.map((b) => (
        <div key={b.user._id} className="balance-item">
          <span>{b.user.username}</span>
          <span className={b.amount > 0 ? "balance-positive" : "balance-negative"}>
            {b.amount > 0
              ? `Owes you ₹${b.amount}`
              : `You owe ₹${Math.abs(b.amount)}`}
          </span>
        </div>
      ))}

      <h3>Expenses</h3>
      {expenses.map((e) => (
        <div
          key={e._id}
          className="expense-card"
          onClick={() => navigate(`/expense/${e._id}`)}
        >
          <div>
            <div className="expense-title">{e.description}</div>
            <div className="expense-amount">₹{e.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
