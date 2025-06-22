import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/log.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const moods = ['😢', '😟', '😐', '😊', '😁'];

// const moods = [
//   { name: 'tear', icon: <BsEmojiTear /> },
//   { name: 'frown', icon: <BsEmojiFrown /> },
//   { name: 'neutral', icon: <BsEmojiNeutral /> },
//   { name: 'smile', icon: '😊' },
//   { name: 'grin', icon: '😁' }
// ];

export default function LogEntry() {
  const [form, setForm] = useState({
    date: '',
    water: '',
    exercise: '',
    sleep: '',
    mood: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMoodSelect = (emoji) => {
    setForm({ ...form, mood: emoji });
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/logs`, {
        type: 'daily_log',
        data: form,
        timestamp: form.date || new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard'); //dashboard
    } catch (err) {
        console.error('Log submission failed:', err);
      toast.error('Log submission failed');
    }
  };

  return (
    <div className=" logMainL">
      <div className='log-entry'>
        <form onSubmit={handleSubmit} className=" p-8 rounded w-full max-w-md space-y-6 shadow">
        <h2 className="text-2xl font-bold text-center logh">WELLNESS LOG ENTRY</h2>

        <div className='lb1'>
          <label className="block font-semibold mb-1">Date</label>
          <input type="date" name="date" onChange={handleChange} className="w-full p-2 border rounded date-inp" required />
        </div>

        <div>
          <label className="block font-semibold mb-1">Water</label>
          <input type="number" name="water" placeholder="0 Glasses" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Exercise</label>
          <input type="number" name="exercise" placeholder="0 Minutes" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Sleep</label>
          <input type="number" name="sleep" placeholder="0 Hours" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Mood</label>
          <div className="flex gap-2 moodD ">
            {moods.map(m => (
              <button
                type="button"
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={`text-2xl p-2 rounded hover:bg-gray-200 moodB ${form.mood === m ? 'bg-gray-300' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-red-400 hover:bg-red-500 text-white py-2 font-semibold rounded">
          SAVE
        </button>
      </form>
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
