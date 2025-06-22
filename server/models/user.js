
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  birthday: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  country: { type: String, required: true },

  reminders: [
    {
      date: String,
      time: String,
      message: String,
      shown: { type: Boolean, default: false }
    }
  ]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
