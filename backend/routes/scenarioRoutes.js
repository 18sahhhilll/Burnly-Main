import express from 'express';
import {
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
} from '../controllers/scenarioController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateCreateScenario, validateUpdateScenario } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getScenarios)
  .post(validateCreateScenario, createScenario);

router.route('/:id')
  .put(validateUpdateScenario, updateScenario)
  .delete(deleteScenario);

export default router;
