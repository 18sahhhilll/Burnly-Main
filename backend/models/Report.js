import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario',
      index: true,
    },
    type: {
      type: String,
      enum: ['market', 'competitors', 'roadmap', 'pitch', 'risk'],
      required: true,
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    sources: [
      {
        title: { type: String, required: true },
        url: { type: String, default: '' },
        retrievalDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
      },
    ],
    inputsHash: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'generating'],
      default: 'completed',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
