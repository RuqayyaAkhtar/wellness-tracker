import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/authRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import logRoutes from './routes/logRoutes.js';

// Config
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
const PORT = process.env.PORT || 5000
const app = express();
app.use(cors());
app.use(express.json());


// APIs
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/logs", logRoutes);



app.get('/',(req,res)=>{
  res.redirect(process.env.FRONTEND_URL);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});