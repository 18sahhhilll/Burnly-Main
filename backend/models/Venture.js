import mongoose from 'mongoose';

const ventureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    oneLiner: {
      type: String,
      trim: true,
      default: '',
    },
    problem: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      trim: true,
      default: 'Technology',
    },
    businessModel: {
      type: String,
      enum: ['subscription', 'transactional', 'marketplace', 'services', 'other'],
      default: 'subscription',
    },
    targetCustomer: {
      type: String,
      trim: true,
      default: 'B2B SMBs',
    },
    geography: {
      type: String,
      trim: true,
      default: 'India',
    },
    stage: {
      type: String,
      enum: ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Growth'],
      default: 'Seed',
    },
    team: {
      foundersCount: { type: Number, default: 1 },
      headcount: { type: Number, default: 3 },
      keyRoles: { type: String, default: 'Engineering, Product, Sales' },
    },
    financialSnapshot: {
      startingCash: { type: Number, default: 1000000 },
      monthlyRevenue: { type: Number, default: 25000 },
      revenueGrowthRate: { type: Number, default: 8 },
      payrollSpend: { type: Number, default: 45000 },
      marketingSpend: { type: Number, default: 12000 },
      infrastructureSpend: { type: Number, default: 4000 },
      opsSpend: { type: Number, default: 5000 },
      founderSalary: { type: Number, default: 10000 },
      fundingRaisedSoFar: { type: Number, default: 0 },
      plannedRaise: { type: Number, default: 5000000 },
    },
    revenueModelDetails: {
      pricing: { type: Number, default: 0 },
      customerCount: { type: Number, default: 0 },
      churnRate: { type: Number, default: 0 },
      cac: { type: Number, default: 0 },
      grossMargin: { type: Number, default: 100 },
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Venture = mongoose.model('Venture', ventureSchema);
export default Venture;
