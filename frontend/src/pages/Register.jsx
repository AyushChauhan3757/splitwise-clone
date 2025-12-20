import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        username,
        email,
        password,
      });

      setSuccess("Account created. You can now login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}
        {success && <div style={{ color: "#22c55e" }}>{success}</div>}

        <button className="btn-primary" type="submit">
          Register
        </button>
      </form>

      {/* 👇 LOGIN LINK */}
      <p
        style={{
          marginTop: "18px",
          textAlign: "center",
          fontSize: "14px",
          color: "#9ca3af",
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#8b5cf6" }}>
          Login
        </Link>
      </p>
    </div>
  );
}
