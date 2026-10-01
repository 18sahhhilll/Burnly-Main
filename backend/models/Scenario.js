import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ventureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venture',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Scenario = mongoose.model('Scenario', scenarioSchema);
export default Scenario;
