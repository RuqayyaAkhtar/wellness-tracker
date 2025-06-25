import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import User from '../models/user.js'; 

const router = express.Router();

// POST: Add a new reminder
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { date, time, message } = req.body;

  try {
    const user = await User.findById(userId);
    const newReminder = { date, time, message, shown: false };
    user.reminders.push(newReminder);
    await user.save();
    const savedReminder = user.reminders[user.reminders.length - 1]; // last added
    res.json({ reminder: savedReminder });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add reminder', error: err });
  }
});

// PUT: Update shown status
router.put('/:id', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;

  try {
    const user = await User.findById(userId);
    const reminder = user.reminders.id(reminderId);
    if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });

    Object.assign(reminder, req.body);
    await user.save();
    res.json({ reminder });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update reminder', error: err });
  }
});

// DELETE: Remove a reminder
router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;

  try {
    const user = await User.findById(userId);
    user.reminders = user.reminders.filter(r => r._id.toString() !== reminderId);
    await user.save();
    res.json({ msg: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete reminder', error: err });
  }
});

export default router;
