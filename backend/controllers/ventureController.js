import Venture from '../models/Venture.js';
import Scenario from '../models/Scenario.js';

export const getVentures = async (req, res) => {
  try {
    let ventures = await Venture.find({ userId: req.user.id }).sort({ updatedAt: -1 });

    // Auto-migration for legacy users: if no venture exists, create a default Venture profile
    // and link any existing scenarios to it.
    if (ventures.length === 0) {
      const defaultVenture = await Venture.create({
        userId: req.user.id,
        name: 'My Startup Venture',
        oneLiner: 'Startup financial model',
        stage: 'Seed',
      });

      // Update existing scenarios without ventureId
      await Scenario.updateMany(
        { userId: req.user.id, ventureId: { $exists: false } },
        { ventureId: defaultVenture._id }
      );

      ventures = [defaultVenture];
    }

    return res.json(ventures);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch ventures' });
  }
};

export const getVentureById = async (req, res) => {
  try {
    const { id } = req.params;
    const venture = await Venture.findOne({ _id: id, userId: req.user.id });

    if (!venture) {
      return res.status(404).json({ error: 'Venture profile not found or unauthorized' });
    }

    return res.json(venture);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch venture' });
  }
};

export const createVenture = async (req, res) => {
  try {
    const {
      name,
      oneLiner,
      problem,
      industry,
      businessModel,
      targetCustomer,
      geography,
      stage,
      team,
      financialSnapshot,
      revenueModelDetails,
      isSample,
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Venture name is required' });
    }

    const venture = await Venture.create({
      userId: req.user.id,
      name: name.trim(),
      oneLiner: oneLiner || '',
      problem: problem || '',
      industry: industry || 'Technology',
      businessModel: businessModel || 'subscription',
      targetCustomer: targetCustomer || 'B2B SMBs',
      geography: geography || 'India',
      stage: stage || 'Seed',
      team: team || {},
      financialSnapshot: financialSnapshot || {},
      revenueModelDetails: revenueModelDetails || {},
      isSample: Boolean(isSample),
    });

    // Auto-create a default base scenario linked to this new venture
    const defaultScenarioData = {
      startingCash: financialSnapshot?.startingCash ?? 1000000,
      monthlyRevenue: financialSnapshot?.monthlyRevenue ?? 25000,
      revenueGrowthRate: financialSnapshot?.revenueGrowthRate ?? 8,
      payrollSpend: financialSnapshot?.payrollSpend ?? 45000,
      marketingSpend: financialSnapshot?.marketingSpend ?? 12000,
      infrastructureSpend: financialSnapshot?.infrastructureSpend ?? 4000,
      opsSpend: financialSnapshot?.opsSpend ?? 5000,
      founderSalary: financialSnapshot?.founderSalary ?? 10000,
      hiringTimeline: [],
    };

    await Scenario.create({
      userId: req.user.id,
      ventureId: venture._id,
      title: `${venture.name} — Base Model`,
      data: defaultScenarioData,
    });

    return res.status(201).json(venture);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create venture' });
  }
};

export const updateVenture = async (req, res) => {
  try {
    const { id } = req.params;
    const venture = await Venture.findOne({ _id: id, userId: req.user.id });

    if (!venture) {
      return res.status(404).json({ error: 'Venture profile not found or unauthorized' });
    }

    const fieldsToUpdate = [
      'name',
      'oneLiner',
      'problem',
      'industry',
      'businessModel',
      'targetCustomer',
      'geography',
      'stage',
      'team',
      'financialSnapshot',
      'revenueModelDetails',
      'isSample',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        venture[field] = req.body[field];
      }
    });

    const updatedVenture = await venture.save();
    return res.json(updatedVenture);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update venture' });
  }
};

export const deleteVenture = async (req, res) => {
  try {
    const { id } = req.params;

    const venture = await Venture.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!venture) {
      return res.status(404).json({ error: 'Venture profile not found or unauthorized' });
    }

    // Clean up all scenarios associated with this venture
    await Scenario.deleteMany({ ventureId: id, userId: req.user.id });

    return res.json({ message: 'Venture profile and associated scenarios deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete venture' });
  }
};
