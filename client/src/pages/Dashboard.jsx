import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardCharts from '../components/DashboardCharts';
import moment from 'moment';
import '../styles/dashboard.css';
import userImage1 from '../components/images/f-user.png'
import userImage from '../components/images/m-user.png'
import EditLogPopup from '../components/EditLogPopup';
import { MdOutlineModeEdit, MdDelete } from 'react-icons/md';
import { IoCalendarNumberOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import ReminderComponent from '../components/Reminders';
import { IoMdFitness } from "react-icons/io";
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // State
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [reminders, setReminders] = useState([]);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editLogId, setEditLogId] = useState('');
  const [shownReminderIds, setShownReminderIds] = useState(new Set());

  // ....birthdate..........
  function calculateAge(birthday) {
    if (!birthday) return ''; // Safeguard
    const birthDate = new Date(birthday);
    if (isNaN(birthDate)) return ''; // Invalid date format
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  // On mount: load reminders (server first, else local)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        const server = Array.isArray(res.data.reminders) ? res.data.reminders : [];
        setReminders(server);
      } catch {
        setReminders([]);
      }
    };
    fetchUser();
  }, []);

  // Helper: persist both to localStorage and server
  const saveReminders = async (updated) => {
    setReminders(updated); // Update UI first

    for (const r of updated) {
      if (!r._id) {
        await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/reminders`, r, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`${import.meta.env.VITE_BACKEND_LINK}/api/reminders/${r._id}`, r, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    }
  };

  // Filters for logs
  useEffect(() => {
    if (logs.length === 0) return; 
    let f = [...logs];
    if (filterType !== 'all') {
      f = f.filter(l =>
        filterType === 'daily_log'
          ? l.type === 'daily_log'
          : l.data?.[filterType] !== undefined
      );
    }
    if (dateRange !== 'all') {
      const now = new Date();
      const from = new Date();
      from.setDate(now.getDate() - parseInt(dateRange));
      f = f.filter(l => {
        const d = new Date(l.timestamp);
        return d >= from && d <= now;
      });
    }
    if (searchField && searchValue) {
      const val = searchValue.toLowerCase();
      f = f.filter(l =>
        searchField === 'date'
          ? new Date(l.timestamp).toLocaleDateString().includes(val)
          : l.data?.[searchField]?.toString().toLowerCase().includes(val)
      );
    }
    setFilteredLogs(f);
  }, [logs, filterType, dateRange, searchField, searchValue]);
  // Logs fetch & edit
  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/api/logs`, { headers: { Authorization: `Bearer ${token}` } });
      setLogs(res.data);
    } catch {
      console.error('Failed to fetch logs');
      setLogs([]); 
    }
  };
  useEffect(() => { fetchLogs(); }, []);
  const openEditor = field => {
    const latest = logs.filter(l => l.type === 'daily_log' && l.data?.[field])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    if (!latest) return;
    setEditField(field);
    setEditValue(latest.data[field]);
    setEditLogId(latest._id);
  };
  const saveEditedLog = async value => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_LINK}/api/logs/${editLogId}`,
        { data: { ...logs.find(l => l._id === editLogId).data, [editField]: value } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditField(null); fetchLogs();
    } catch {
      console.error('Failed to save log');
      toast.error('Failed to save log. Please try again.');
      setEditField(null);
    }
  };
  const getLatest = field =>
    logs.filter(l => l.type === 'daily_log' && l.data?.[field])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.data[field] || 'No data';
  const latestMood = getLatest('mood');
  const latestSleep = getLatest('sleep');
  const latestWater = getLatest('water');
  const latestExercise = getLatest('exercise');
  const logout = () => { localStorage.removeItem('token'); navigate('/'); };
  const logEntry = () => { navigate('/log-entry'); };

  // daily reminder times and messages

  // Function to play sound

const playReminderSound = () => {
  const audio = new Audio('/toast.mp3'); 
  audio.volume = 1;
  audio.play().catch((e) => {
    console.warn('Audio play error:', e);
  });
};

useEffect(() => {
  if (!user) return;

  const hour = moment().hour();
  let message = '';

  if (hour < 12) {
    message = '☀️ Good morning! Time for your daily wellness check‑in.';
  } else if (hour >= 12 && hour < 17) {
    message = '🌤️ Good afternoon! Keep staying mindful and hydrated!';
  } else {
    message = '🌙 Good evening! Don’t forget to log today’s activities.';
  }

  toast(message, {
    toastId: 'welcome-toast',
    autoClose: false,
    closeOnClick: false,
    closeButton: true,
    position: 'top-center',
    progressStyle: { backgroundColor: '#38bdf8' }
  });

  playReminderSound(); 
}, [user]);

  // reminder//
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDate = now.toISOString().split('T')[0];

      reminders.forEach(async (reminder) => {
        if (
          reminder.date === currentDate &&
          reminder.time === currentTime &&
          !reminder.shown &&
          !shownReminderIds.has(reminder._id)
        ) {
          toast(`🔔 Reminder: ${reminder.message}`, {
            autoClose: false,
            closeOnClick: false,
            closeButton: true,
            position: "top-center",
            progressStyle: { backgroundColor: '#38bdf8' } 
          });

          setShownReminderIds(prev => new Set(prev).add(reminder._id));

          try {
            await fetch(`${import.meta.env.VITE_BACKEND_LINK}/api/reminders/${reminder._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ shown: true }),
            });
          } catch (err) {
            console.error("Failed to update reminder:", err);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders, shownReminderIds]);

useEffect(() => {
  if (!token) navigate('/');
}, []);
// ...........token



useEffect(() => {
  const interval = setInterval(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          toast.warn("Session expired. Logging out...", {
            progressStyle: { backgroundColor: '#f87171' }
          });
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (err) {
        console.log(err)
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, 10000); // Check every 10 seconds

  return () => clearInterval(interval);
}, []);
// nagivate to log-entry
  useEffect(() => {
    const checkIfLoggedToday = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/api/logs/check-today`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (!res.data.hasLoggedToday) {
          navigate('/log-entry');
        }
      } catch (err) {
        console.error('Failed to check today\'s log:', err);
        navigate('/');
      }
    };

    checkIfLoggedToday();
  }, []);

  return (
    <div className="dashboard-container dMain">
      <div className="dashboard-topbar dBar">
        <div className="logo-d">
          <IoMdFitness className='logo' />
          <h1 className="text-xl font-bold text-blue-700 hd1">Online Personal Wellness Tracker</h1>
        </div>
        <div className="flex gap-6 items-center top-large">
          <span className="text-sm font-medium flex items-center navDate"><IoCalendarNumberOutline className='cal' />{moment().format('MM/DD/YYYY')}</span>
          <button onClick={logout} className="text-red-500 hover:underline text-sm logoutBtn">Logout</button>
          <button onClick={logEntry} className="text-red-500 hover:underline text-sm logBtn">Log Entry</button>
        </div>
      </div>

      <div className="dashboard flex">
        <div className="leftside flex">
          <div className="dashboard-tabs dTabs ">
            <span className="active cursor-pointer ">Activities</span>
          </div>
          <div className="stats-cards grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Mood */}
            <div className="stat-card card-blue flex ">
              <div>
                <p className="font-semibold">Mood</p>
                <h2 className="text-xl">
                  {latestMood}
                </h2>
              </div>
              {latestMood && (
                <button onClick={() => openEditor('mood')} className='editBtn1'>
                  <MdOutlineModeEdit className="svg" />
                  Edit</button>
              )}
            </div>
            {/* Sleep */}
            <div className="stat-card card-sky flex ">
              <div>
                <p className="font-semibold">Sleep</p>
                <h2 className="text-xl">
                  {latestSleep} hours
                </h2>
              </div>
              {latestSleep && (
                <button onClick={() => openEditor('sleep')} className="editBtn2 bg-white border px-3 py-1 rounded text-sm">
                  <MdOutlineModeEdit className='svg' />
                  Edit
                </button>
              )}
            </div>
            {/* Water Intake */}
            <div className="stat-card card-rose flex ">
              <div>
                <p className="font-semibold">Water</p>
                <h2 className="text-xl">
                  {latestWater} glasses
                </h2>
              </div>
              {latestWater && (
                <button onClick={() => openEditor("water")} className="editBtn3 bg-white border text-sm px-3 py-1 rounded hover:bg-gray-100">
                  <MdOutlineModeEdit className='svg' />
                  Edit
                </button>
              )}
            </div>
            {/* Exercise */}
            <div className="stat-card card-green flex ">
              <div>
                <p className="font-semibold">Exercise</p>
                <h2 className="text-xl">
                  {latestExercise} min
                </h2>
              </div>
              {latestExercise && (
                <button onClick={() => openEditor("exercise")} className="editBtn4 bg-white border text-sm px-3 py-1 rounded hover:bg-gray-100">
                  <MdOutlineModeEdit className='svg' />
                  Edit
                </button>
              )}
            </div>
          </div>
          {/* ............ */}
          <div className="remindersMain-small">
            <ReminderComponent
              reminders={reminders}
              setReminders={saveReminders}
              token={token}
            />
          </div>
          {/* ......... */}
          <div className="chart-section dChart">
            <div className="chart-header">
              <h2 className="text-xl font-semibold ">Activity Statistics</h2>
              <div className="flex gap-2 flex-wrap filter-cont">
                <select onChange={e => setSearchField(e.target.value)} value={searchField}>
                  <option value="">Search by...</option>
                  <option value="mood">Mood</option>
                  <option value="sleep">Sleep</option>
                  <option value="water">Water</option>
                  <option value="exercise">Exercise</option>
                  <option value="date">Date</option>
                </select>
                <input
                  type="text"
                  placeholder="Search value..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                />
                <select onChange={e => setFilterType(e.target.value)} value={filterType}>
                  <option value="all">All Types</option>
                  <option value="daily_log">Daily Log</option>
                  <option value="water">Water</option>
                  <option value="exercise">Exercise</option>
                  <option value="sleep">Sleep</option>
                  <option value="mood">Mood</option>
                </select>
                <select onChange={e => setDateRange(e.target.value)} value={dateRange}>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            <DashboardCharts logs={filteredLogs} />
          </div>
        </div>     {/* left */}
        {/* ................ */}
        <div className="right">
          <div className="profile-sidebar sidebar">
            <div className="user-m">
              <div className="user-left">
                <div className="user">
                  <img src={user?.gender === 'Female' ? userImage1 : userImage} alt="User" />
                </div>
                <h2>{user?.name}</h2>
                <div className="line flex">
                  {user?.birthday && (
                    <p>Age: {calculateAge(user.birthday)} years</p>
                  )}
                  <p className='p-line'>{user?.country}</p>
                </div>
              </div>
              <div className="user-right">
                <div className="flex gap-6 items-center top-small">
                  <span className="text-sm font-medium flex items-center navDate"><IoCalendarNumberOutline className='cal' />{moment().format('MM/DD/YYYY')}</span>
                  <button onClick={logout} className="text-red-500 hover:underline text-sm logoutBtn">Logout</button>
                  <button onClick={logEntry} className="text-red-500 hover:underline text-sm logBtn">Log Entry</button>
                </div>
              </div>
            </div>
            <div className="remindersMain">
              <ReminderComponent
                reminders={reminders}
                setReminders={saveReminders}
                token={token}
              />
            </div>

          </div>
        </div>     {/* right */}
      </div>       {/*dashboard */}
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
        progressStyle={{ backgroundColor: '#10b981' }}
      />
      {editField && (
        <EditLogPopup
          field={editField}
          currentValue={editValue}
          onSave={saveEditedLog}
          onClose={() => setEditField(null)}
        />
      )}
    </div>
  );
}
