import mongoose from 'mongoose';

const userUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateStr: {
      type: String, // YYYY-MM-DD in UTC
      required: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userUsageSchema.index({ userId: 1, dateStr: 1 }, { unique: true });

const UserUsage = mongoose.model('UserUsage', userUsageSchema);
export default UserUsage;
