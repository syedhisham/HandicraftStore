import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  status: { type: String, required: true, enum: ['pending', 'completed', 'cancelled','refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  customerEmail: { type: String },
});

export const Session = mongoose.model("Session", sessionSchema);
