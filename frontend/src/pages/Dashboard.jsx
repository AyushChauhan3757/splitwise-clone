import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };


  const fetchData = async () => {
    const e = await API.get("/expenses");
    const b = await API.get("/balances");
    setExpenses(e.data);
    setBalances(b.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Splitzy</h2>
      <div className="welcome">Logged in as <strong>{user.username}</strong></div>

      <div className="actions">
        <Link to="/add"><button className="btn-primary">➕ Add Expense</button></Link>
        <button className="btn-danger" onClick={logout}>Logout</button>
      </div>

      <h3>Balances</h3>
      {balances.map(b => (
        <div key={b.userId} className="balance-item">
          <span>{b.name}</span>
          <span className={b.balance > 0 ? "balance-positive" : "balance-negative"}>
            {b.balance > 0 ? `Owes you ₹${b.balance}` : `You owe ₹${Math.abs(b.balance)}`}
          </span>
        </div>
      ))}

      <h3>Expenses</h3>
      {expenses.map(e => (
        <div key={e._id} className="expense-card">
          <div className="expense-info" onClick={() => navigate(`/expense/${e._id}`)}>
            <div className="expense-title">{e.description}</div>
            <div className="expense-amount">₹{e.amount}</div>
          </div>
          <button className="btn-danger" onClick={async () => {
            await API.delete(`/expenses/${e._id}`);
            fetchData();
          }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
