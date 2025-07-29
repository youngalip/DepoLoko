const express = require('express');
const router = express.Router();
const actionPlanController = require('../controllers/actionPlanController');

// GET all
router.get('/', actionPlanController.getAllActionPlan);
// GET by id
router.get('/:id', actionPlanController.getActionPlanById);
// POST create
router.post('/', actionPlanController.createActionPlan);
// DELETE
router.delete('/:id', actionPlanController.deleteActionPlan);

module.exports = router;
