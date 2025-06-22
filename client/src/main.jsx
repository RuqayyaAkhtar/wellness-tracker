import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import './index.css'
import Dashboard from './pages/Dashboard.jsx';
import LogEntry from './pages/LogEntry.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/log-entry" element={<LogEntry />} />
</Routes>
  </BrowserRouter>
)

