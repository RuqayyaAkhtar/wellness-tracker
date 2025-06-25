import React, { useState } from 'react';
import CircularTimer from './CircularTimer';
import { MdDelete } from 'react-icons/md';
import { CiCirclePlus } from "react-icons/ci";
import '../styles/reminder.css'
export default function ReminderSection({ reminders, setReminders }) {
    const COLORS = ['#00A2FF','#28BE9D', '#FD5353', '#FFAB2D'];

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    
    const handleAddReminder = async () => {
        if (!time || !message) {
            alert("Please fill time and message");
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_LINK}/api/reminders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    date: selectedDate,
                    time,
                    message,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                const updated = [...reminders, data.reminder];
                setReminders(updated);
                setTime("");
                setMessage("");

            } else {
                console.error("Add reminder failed", data);
            }
            
        } catch (err) {
            console.error("Error adding reminder:", err);
        }
    };
    const handleDelete = async (reminderId) => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_LINK}/api/reminders/${reminderId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updated = reminders.filter((r) => r._id !== reminderId);
            setReminders(updated);
        } catch (err) {
            console.error("Failed to delete reminder:", err);
        }
    };
    const filteredReminders = reminders.filter(r => r.date === selectedDate);
    return (
        <div>
            {/* Date Buttons */}
            <p className='add-r' style={{ textAlign: 'left', color: '#fffff', display: 'flex', alignItems: 'center', gap: '5px' }}><CiCirclePlus /> Add Reminder</p>
            <div className='dateDivM' >
                {[...Array(7)].map((_, i) => {
                    const d = new Date(today);
                    d.setDate(d.getDate() + i);
                    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateStr = d.toISOString().split('T')[0];
                    return (
                        <div
                            id='dateD'
                            key={i}
                            onClick={() => setSelectedDate(dateStr)}
                            style={{
                                borderRadius: '6px',
                                background: selectedDate === dateStr ? '#2696FD' : 'transparent',
                                // color: selectedDate === dateStr ? '#fffff' : '#6E6C94',
                                color: selectedDate === dateStr ? '#ffffff' : '#AAA7A7',
                                cursor: 'pointer',
                            }}
                            className='dateDiv'
                        >
                            {day} <br /> {d.getDate()}
                        </div>
                    );
                })}
            </div>
            {/* Input Row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }} className='form-r'>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                <input
                    type="text"
                    placeholder="Reminder message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={handleAddReminder}>Set Reminder</button>
            </div>
            {/* Reminders List */}
            <div className='reminder-list'>
                {filteredReminders.length === 0 ? (
                    <p className='no-remind'>No reminders set for this date.</p>
                ) : (
                    filteredReminders.map((r, i) => (
                        <div
                            className='reminder-item1'
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <div>
                                <CircularTimer targetTime={r.time} color={COLORS[i % COLORS.length]} />
                            </div>
                            <div className='small-rd' style={{ display: 'flex', justifyContent: 'space-between', width: '70%', alignItems: 'center' }}>

                                <div className='set-r'>
                                    <p style={{ textAlign: 'left', color: 'white' }}>{r.message}</p>
                                    <small style={{ width: 'max-content', color: '#AAA7A7' }}>{r.time}</small>
                                </div>
                                <button onClick={() => handleDelete(r._id)} className='del'>
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
