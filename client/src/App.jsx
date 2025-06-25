// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogEntry from './pages/LogEntry';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  } catch (err) {
    console.log(err)
    return false;
  }
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/log-entry" element={isAuthenticated() ? <LogEntry /> : <Navigate to="/" />} />
    </Routes>
  );
}
