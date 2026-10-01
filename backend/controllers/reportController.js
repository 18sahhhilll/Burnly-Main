import mongoose from 'mongoose';
import Report from '../models/Report.js';
import UserUsage from '../models/UserUsage.js';
import { generateReportService } from '../services/reportService.js';

export const generateReport = async (req, res) => {
  try {
    const { ventureId, scenarioId, type } = req.body;

    if (!ventureId) {
      return res.status(400).json({ error: 'ventureId is required' });
    }

    const validTypes = ['market', 'competitors', 'roadmap', 'pitch', 'risk'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
    }

    // Atomic daily rate limit check per user (resets on UTC midnight 00:00:00Z)
    const dailyLimit = Number(process.env.REPORT_DAILY_LIMIT) || 10;
    const todayStr = new Date().toISOString().split('T')[0];

    // Skip DB buffering when Mongoose is disconnected (unit test mode)
    if (mongoose.connection.readyState === 1) {
      let usageDoc = await UserUsage.findOne({ userId: req.user.id, dateStr: todayStr });
      if (usageDoc && usageDoc.count >= dailyLimit) {
        return res.status(429).json({
          error: `Daily report generation limit reached (${dailyLimit}/${dailyLimit}). Try again tomorrow.`,
        });
      }

      try {
        usageDoc = await UserUsage.findOneAndUpdate(
          { userId: req.user.id, dateStr: todayStr, count: { $lt: dailyLimit } },
          { $inc: { count: 1 } },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        usageDoc = await UserUsage.findOneAndUpdate(
          { userId: req.user.id, dateStr: todayStr, count: { $lt: dailyLimit } },
          { $inc: { count: 1 } },
          { new: true }
        );
      }

      if (!usageDoc || usageDoc.count > dailyLimit) {
        return res.status(429).json({
          error: `Daily report generation limit reached (${dailyLimit}/${dailyLimit}). Try again tomorrow.`,
        });
      }
    } else {
      // Fallback count check for un-connected test environments
      const generatedToday = await Report.countDocuments({
        userId: req.user.id,
        generatedAt: { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
      });
      if (generatedToday >= dailyLimit) {
        return res.status(429).json({
          error: `Daily report generation limit reached (${dailyLimit}/${dailyLimit}). Try again tomorrow.`,
        });
      }
    }

    let report;
    try {
      report = await generateReportService({
        userId: req.user.id,
        ventureId,
        scenarioId,
        type,
      });
    } catch (genErr) {
      if (mongoose.connection.readyState === 1) {
        await UserUsage.updateOne(
          { userId: req.user.id, dateStr: todayStr, count: { $gt: 0 } },
          { $inc: { count: -1 } }
        ).catch(() => {});
      }
      throw genErr;
    }

    return res.status(201).json(report);
  } catch (error) {
    console.error('generateReport error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate report' });
  }
};

export const getReports = async (req, res) => {
  try {
    const { ventureId } = req.query;
    const query = { userId: req.user.id };

    if (ventureId) {
      query.ventureId = ventureId;
    }

    const reports = await Report.find(query).sort({ updatedAt: -1 });
    return res.json(reports);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch reports' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ _id: id, userId: req.user.id });

    if (!report) {
      return res.status(404).json({ error: 'Report not found or unauthorized' });
    }

    return res.json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch report' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!report) {
      return res.status(404).json({ error: 'Report not found or unauthorized' });
    }

    return res.json({ message: 'Report deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete report' });
  }
};
