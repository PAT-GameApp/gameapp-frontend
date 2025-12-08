import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage/HomePage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Callback from "./utils/Callback";
import "./App.css";

const VITE_OAUTH_LOGIN_URL = import.meta.env.VITE_OAUTH_LOGIN_URL;
const VITE_OAUTH_REGISTER_URL = import.meta.env.VITE_OAUTH_REGISTER_URL;

// Redirect component for OAuth login flow
const LoginRedirect = () => {
  useEffect(() => {
    window.location.href = VITE_OAUTH_LOGIN_URL;
  }, []);
  return null;
};

// Redirect component for OAuth register flow
const RegisterRedirect = () => {
  useEffect(() => {
    window.location.href = VITE_OAUTH_REGISTER_URL;
  }, []);
  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<RegisterRedirect />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
