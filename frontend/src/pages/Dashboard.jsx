import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const expensesRes = await API.get("/expenses");
      const balancesRes = await API.get("/balances");

      setExpenses(expensesRes.data);
      setBalances(balancesRes.data);
    } catch (err) {
      logout();
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {user && (
        <p style={{ textAlign: "center" }}>
          Welcome, <strong>{user.username}</strong>
        </p>
      )}

      <button
        onClick={logout}
        style={{ background: "#f44336", marginBottom: "10px" }}
      >
        Logout
      </button>

      <Link to="/add">
        <button style={{ marginBottom: "20px" }}>Add Expense</button>
      </Link>

      <h3>Balances</h3>
      {balances.length === 0 && <p>No balances yet</p>}
      <ul>
        {balances.map((b) => (
          <li key={b.userId}>
            <strong>{b.name}</strong>:{" "}
            {b.balance > 0 ? (
              <span style={{ color: "green" }}>
                Owes you ₹{b.balance.toFixed(2)}
              </span>
            ) : (
              <span style={{ color: "red" }}>
                You owe ₹{Math.abs(b.balance).toFixed(2)}
              </span>
            )}
          </li>
        ))}
      </ul>

      <h3>Expenses</h3>
      {expenses.length === 0 && <p>No expenses yet</p>}
      <ul>
        {expenses.map((e) => (
          <li key={e._id}>
            <strong>{e.description}</strong> – ₹{e.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
