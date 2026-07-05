import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    interviewDate: {
      type: Date,
      required: true,
    },
    interviewType: {
      type: String,
      enum: ['online', 'offline', 'telephonic'],
      required: true,
    },
    round: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Interview', interviewSchema);
