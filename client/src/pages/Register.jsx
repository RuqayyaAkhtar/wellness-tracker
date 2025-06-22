import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CiFileOn } from "react-icons/ci";
import { BsPerson, BsPersonPlus } from "react-icons/bs";
import { MdOutlineCake } from "react-icons/md";
import { PiGlobeHemisphereWestDuotone } from "react-icons/pi";
import { BsGenderFemale } from "react-icons/bs";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import '../styles/register.css';

export default function Register() {
  // const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
  birthday: '',
  gender: '',
  country: ''
});

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required.", {
        progressStyle: { backgroundColor: '#f87171' } // red
      });
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.", {
        progressStyle: { backgroundColor: '#f87171' }
      });
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        progressStyle: { backgroundColor: '#f87171' }
      });
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      toast.success("Registered successfully!", {
        progressStyle: { backgroundColor: '#10b981' } // green
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed", {
        progressStyle: { backgroundColor: '#f87171' }
      });
    }
  };

  return (
    <div className="loginMain">
      <div className='sign-up'>
        <h2 className="text-2xl font-bold logh">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <div className="flex items-center border rounded px-3 py-2 dIn">
            <CiFileOn className="mr-2 text-gray-500 in" />
            <input
              id="name"
              name="name"
              onChange={handleChange}
              type="text"
              required
              placeholder="Enter your name"
              className="w-full focus:outline-none bg-in"
            />
          </div>

          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <div className="flex items-center border rounded px-3 py-2 dIn">
            <BsPersonPlus className="mr-2 text-gray-500 in" />
            <input
              id="email"
              name="email"
              onChange={handleChange}
              type="email"
              required
              placeholder="Enter your email"
              className="w-full focus:outline-none bg-in"
            />
          </div>

          {/* Password */}
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <div className="flex items-center border rounded px-3 py-2 dIn relative">
            <AiOutlineLock className="mr-2 text-gray-500 in" />
            <input
              id="password"
              name="password"
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              className="w-full focus:outline-none bg-in"
            />
            <p
              onClick={() => setShowPassword(!showPassword)}
              className=" cursor-pointer text-gray-600 ic"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </p>
          </div>
          {/* birthday */}
          <label htmlFor="password" className="block text-sm font-medium">Birthday</label>
          <div className="flex items-center border rounded px-3 py-2 dIn relative">
            <MdOutlineCake className="mr-2 text-gray-500 in" />
            <input id="birthday" type="date" name="birthday" className="w-full focus:outline-none bg-in" onChange={handleChange} required />
          </div>
          {/* gender */}
          <label htmlFor="password" className="block text-sm font-medium">Gender</label>
          <div className="flex items-center border rounded px-3 py-2 dIn relative">
            <BsGenderFemale className="mr-2 text-gray-500 in" />
            <select className="w-full focus:outline-none bg-in select" name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* country */}
          <label htmlFor="password" className="block text-sm font-medium">Country</label>
          <div className="flex items-center border rounded px-3 py-2 dIn relative">
            <PiGlobeHemisphereWestDuotone className="mr-2 text-gray-500 in" />
            <input
              id="country"
              name="country"
              type="text"
              placeholder="Enter your country"
              onChange={handleChange}
              className="w-full focus:outline-none bg-in"
              required
            />
          </div>
          {/* ........ */}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition">
            REGISTER
          </button>
        </form>

        <div className="text-center mt-6">
          {/* <BsPerson className="mx-auto text-3xl text-gray-500 mb-2" /> */}
          <p className="text-sm font-semibold">Already have an account?</p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition rout">
            <a href="/">
              LOGIN
            </a>
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
        progressStyle={{ backgroundColor: '#10b981' }} // default green
      />
    </div>
  );
}
