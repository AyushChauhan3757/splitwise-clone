import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Splitzy</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary">Login</button>
      </form>
      <div className="muted">
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
