import express from 'express';
import Log from '../models/log.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import moment from 'moment';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const existingLog = await Log.findOne({
      userId,
      timestamp: { $gte: todayStart, $lte: todayEnd },
      type: 'daily_log'
    });

    if (existingLog) {
      existingLog.data = {
        ...existingLog.data,
        ...req.body.data
      };
      existingLog.timestamp = new Date(); // update timestamp
      await existingLog.save();
      return res.status(200).json({ updated: true, log: existingLog });
    }

    const newLog = await Log.create({
      userId,
      type: req.body.type,
      data: req.body.data,
      timestamp: req.body.timestamp || new Date()
    });

    res.status(201).json({ created: true, log: newLog });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save log', error: err.message });
  }
});


router.put('/:id', verifyToken, async (req, res) => {
  try {
    const log = await Log.findOne({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ error: 'Log not found' });

    // Update data
    log.data = {
      ...log.data,
      ...req.body.data,
      date: log.data.date || new Date().toISOString().slice(0, 10)
    };
    await log.save();

    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
});




router.get('/', verifyToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch logs', error: err.message });
  }
});
// ....check today....
router.get('/check-today', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const log = await Log.findOne({
      userId,
      timestamp: { $gte: todayStart, $lte: todayEnd },
    });

    res.json({ hasLoggedToday: !!log });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
export default router;
