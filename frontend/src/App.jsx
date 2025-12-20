import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";

const isAuth = () => !!localStorage.getItem("token");

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={isAuth() ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/add"
          element={isAuth() ? <AddExpense /> : <Navigate to="/login" />}
        />
      </Routes>
    </HashRouter>
  );
}
