import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    const res = await API.get(`/expenses/${id}`);
    setExpense(res.data);
  };

  const deleteExpense = async () => {
    if (!window.confirm("Delete this expense?")) return;

    await API.delete(`/expenses/${id}`);
    navigate("/");
  };

  if (!expense) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{expense.description}</h2>

      <p>
        <strong>Amount:</strong> ₹{expense.amount}
      </p>

      <p>
        <strong>Paid by:</strong> {expense.paidBy.username}
      </p>

      <p>
        <strong>Split between:</strong>{" "}
        {expense.splitBetween.map((u) => u.username).join(", ")}
      </p>

      <p>
        <strong>Created at:</strong>{" "}
        {new Date(expense.createdAt).toLocaleString()}
      </p>

      <button
        onClick={deleteExpense}
        style={{ background: "#f44336" }}
      >
        Delete Expense
      </button>
    </div>
  );
}
