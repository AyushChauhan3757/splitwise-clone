import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // 🔒 AUTH GUARD
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // 📥 FETCH DATA
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [expensesRes, balancesRes] = await Promise.all([
        API.get("/expenses"),
        API.get("/balances"),
      ]);

      setExpenses(expensesRes.data || []);
      setBalances(balancesRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await API.delete(`/expenses/${id}`);
      fetchAll();
    } catch {
      alert("Failed to delete expense");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="container">
        <h2>Splitzy</h2>
        <p className="muted">Loading...</p>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="container">
        <h2>Splitzy</h2>
        <p className="muted">{error}</p>
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

      {/* BALANCES */}
      <h3>Balances</h3>
      {balances.length === 0 && (
        <div className="muted">No balances yet</div>
      )}

      {balances.map((b) => (
        <div key={b.user._id} className="balance-item">
          <span>{b.user.username}</span>
          {b.amount > 0 ? (
            <span className="balance-positive">
              Owes you ₹{b.amount}
            </span>
          ) : (
            <span className="balance-negative">
              You owe ₹{Math.abs(b.amount)}
            </span>
          )}
        </div>
      ))}

      {/* EXPENSES */}
      <h3>Expenses</h3>
      {expenses.length === 0 && (
        <div className="muted">No expenses added</div>
      )}

      {expenses.map((e) => (
        <div key={e._id} className="expense-card">
          <div
            className="expense-info"
            onClick={() => navigate(`/expense/${e._id}`)}
          >
            <div className="expense-title">{e.description}</div>
            <div className="expense-amount">₹{e.amount}</div>
          </div>

          <button
            className="btn-danger"
            onClick={() => deleteExpense(e._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
