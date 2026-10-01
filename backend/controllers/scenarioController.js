import Scenario from '../models/Scenario.js';
import Venture from '../models/Venture.js';

export const getScenarios = async (req, res) => {
  try {
    const { ventureId } = req.query;
    const query = { userId: req.user.id };

    if (ventureId) {
      // Verify ventureId belongs to caller
      const venture = await Venture.findOne({ _id: ventureId, userId: req.user.id });
      if (!venture) {
        return res.status(404).json({ error: 'Venture profile not found or unauthorized' });
      }
      query.ventureId = ventureId;
    }

    const scenarios = await Scenario.find(query).sort({ updatedAt: -1 });
    return res.json(scenarios);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch scenarios' });
  }
};

export const createScenario = async (req, res) => {
  try {
    const { title, data, ventureId } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Scenario title is required' });
    }

    let targetVentureId = ventureId;

    if (targetVentureId) {
      // Ownership check: verify ventureId belongs to req.user.id
      const venture = await Venture.findOne({ _id: targetVentureId, userId: req.user.id });
      if (!venture) {
        return res.status(404).json({ error: 'Referenced venture profile not found or unauthorized' });
      }
    } else {
      // If no ventureId supplied, find or create default venture for user
      let defaultVenture = await Venture.findOne({ userId: req.user.id });
      if (!defaultVenture) {
        defaultVenture = await Venture.create({
          userId: req.user.id,
          name: 'My Startup Venture',
        });
      }
      targetVentureId = defaultVenture._id;
    }

    const scenario = await Scenario.create({
      userId: req.user.id,
      ventureId: targetVentureId,
      title: title.trim(),
      data: data || {},
    });

    return res.status(201).json(scenario);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create scenario' });
  }
};

export const updateScenario = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, data } = req.body;

    const scenario = await Scenario.findOne({ _id: id, userId: req.user.id });
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or unauthorized' });
    }

    if (title !== undefined) scenario.title = title;
    if (data !== undefined) scenario.data = data;

    const updatedScenario = await scenario.save();
    return res.json(updatedScenario);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update scenario' });
  }
};

export const deleteScenario = async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or unauthorized' });
    }

    return res.json({ message: 'Scenario deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete scenario' });
  }
};
