import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    API.get(`/expenses/${id}`).then(res => setExpense(res.data));
  }, [id]);

  if (!expense) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{expense.description}</h2>

      <div className="details-row"><strong>Amount</strong><span>₹{expense.amount}</span></div>
      <div className="details-row"><strong>Paid by</strong><span>{expense.paidBy.username}</span></div>
      <div className="details-row"><strong>Split between</strong><span>{expense.splitBetween.map(u => u.username).join(", ")}</span></div>
      <div className="details-row"><strong>Created</strong><span>{new Date(expense.createdAt).toLocaleString()}</span></div>

      <div className="actions">
        <button className="btn-danger" onClick={async () => {
          await API.delete(`/expenses/${id}`);
          navigate("/");
        }}>
          Delete
        </button>
        <button className="btn-secondary" onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
}
