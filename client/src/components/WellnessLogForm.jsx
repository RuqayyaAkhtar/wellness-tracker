import { useState } from 'react';
import axios from 'axios';

export default function WellnessLogForm({ onLogCreated }) {
  const [type, setType] = useState('water');
  const [data, setData] = useState({});
  const token = localStorage.getItem('token');

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/logs`, {
        type,
        data,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData({});
      onLogCreated(); // refresh log list
    } catch (err) {
      console.error('Failed to save log:', err);
      alert('Failed to save log');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 mb-6">
      <h3 className="text-xl font-bold">Log Wellness Activity</h3>

      <select value={type} onChange={e => { setType(e.target.value); setData({}); }} className="w-full p-2 border rounded">
        <option value="water">Water</option>
        <option value="exercise">Exercise</option>
        <option value="sleep">Sleep</option>
        <option value="mood">Mood</option>
      </select>

      {type === 'water' && (
        <input type="number" name="glasses" placeholder="Glasses of water" value={data.glasses || ''} onChange={handleChange} className="w-full p-2 border rounded" />
      )}

      {type === 'exercise' && (
        <>
          <input type="text" name="activity" placeholder="Type of exercise" value={data.activity || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="duration" placeholder="Duration (minutes)" value={data.duration || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </>
      )}

      {type === 'sleep' && (
        <>
          <input type="time" name="start" value={data.start || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="time" name="end" value={data.end || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </>
      )}

      {type === 'mood' && (
        <>
          <select name="mood" value={data.mood || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select mood</option>
            <option value="happy">😊 Happy</option>
            <option value="neutral">😐 Neutral</option>
            <option value="sad">😢 Sad</option>
          </select>
          <input type="text" name="note" placeholder="Note (optional)" value={data.note || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </>
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Log
      </button>
    </form>
    </div>
    
  );
}
