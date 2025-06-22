// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineLock } from "react-icons/ai";
import { BsPersonPlus, BsPerson } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import '../styles/signin.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/auth/login`, form);
    const token = res.data.token;
    localStorage.setItem('token', token);

    // ✅ Show success toast
    toast.success("Login successful!", {
      progressStyle: { backgroundColor: '#10b981' } // green line
    });

    // NEW: check if today's log exists
    const check = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/api/logs/check-today`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Redirect after a short delay to let toast appear
    setTimeout(() => {
      if (check.data.hasLoggedToday) {
        navigate('/dashboard');
      } else {
        navigate('/log-entry');
      }
    }, 1500);

  } catch (err) {
    toast.error(err.response?.data?.msg || "Login failed", {
      progressStyle: { backgroundColor: '#f87171' } // red line
    });
  }
};


  return (
    <div className=" loginMainS ">
      <div className='sign-in'>
       <h2 className="text-2xl font-bold logh">LOGIN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <label htmlFor="mail" className="block text-sm font-medium">Email</label>
        <div className="flex items-center border rounded px-3 py-2 dInS">
          <BsPersonPlus className="mr-2 text-gray-500 in" />
          <input
            id="mail"
            name="email"
            onChange={handleChange}
            type="email"
            required
            className="w-full focus:outline-none bg-in"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <label htmlFor="pass" className="block text-sm font-medium">Password</label>
        <div className="flex items-center border rounded px-3 py-2 dInS">
          <AiOutlineLock className="mr-2 text-gray-500 in" />
          <input
            id="pass"
            name="password"
            onChange={handleChange}
            type="password"
            required
            className="w-full focus:outline-none bg-in"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="w-full py-2 rounded transition loginBtn" id="loginBtn">
          LOGIN
        </button>
      </form>

      {/* Extra Info */}
      <div className="text-center mt-6">
        <BsPerson className="mx-auto text-3xl text-gray-500 mb-2 icon" />
        <p className="text-sm font-semibold">No account yet?</p>
        <p className="text-xs text-gray-600 mt-1">
          Registering allows you to track your wellness logs. Just fill in the fields below, and we’ll set up a new account.
        </p>
        <button
          // onClick={showSignup}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition rout"
        >
        <a href="/register">SIGNUP</a>  
        </button>
      </div>
      </div>
    
<ToastContainer 
  position="top-center" 
  autoClose={3000} 
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  transition={Slide}
/>
    </div>
  );
}
