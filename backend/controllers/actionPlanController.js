const ActionPlan = require('../models/actionPlanModel');

exports.getAllActionPlan = async (req, res) => {
  try {
    const data = await ActionPlan.getAllActionPlan();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActionPlanById = async (req, res) => {
  try {
    const data = await ActionPlan.getActionPlanById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createActionPlan = async (req, res) => {
  try {
    const data = await ActionPlan.createActionPlan(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteActionPlan = async (req, res) => {
  try {
    await ActionPlan.deleteActionPlan(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
