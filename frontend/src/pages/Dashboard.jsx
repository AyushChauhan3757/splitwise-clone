import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [eRes, bRes] = await Promise.all([
        API.get("/expenses"),
        API.get("/balances"),
      ]);

      setExpenses(eRes.data);
      setBalances(bRes.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (error) {
    return (
      <div className="container">
        <h2>Splitzy</h2>
        <p className="muted">Failed to load data. Please refresh.</p>
        <button className="btn-secondary" onClick={fetchAll}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Splitzy</h2>
      <div className="welcome">
        Logged in as <b>{user?.username}</b>
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
      {balances.length === 0 && <p className="muted">No balances yet</p>}

      {balances.map((b) => (
        <div key={b.user._id} className="balance-item">
          <span>{b.user.username}</span>
          {b.amount > 0 ? (
            <span className="balance-positive">Owes you ₹{b.amount}</span>
          ) : (
            <span className="balance-negative">
              You owe ₹{Math.abs(b.amount)}
            </span>
          )}
        </div>
      ))}

      <h3>Expenses</h3>
      {expenses.length === 0 && <p className="muted">No expenses</p>}

      {expenses.map((e) => (
        <div key={e._id} className="expense-card">
          <div
            className="expense-info"
            onClick={() => navigate(`/expense/${e._id}`)}
          >
            <div className="expense-title">{e.description}</div>
            <div className="expense-amount">₹{e.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
