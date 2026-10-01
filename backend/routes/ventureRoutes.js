import express from 'express';
import {
  getVentures,
  getVentureById,
  createVenture,
  updateVenture,
  deleteVenture,
} from '../controllers/ventureController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateCreateVenture, validateUpdateVenture } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getVentures)
  .post(validateCreateVenture, createVenture);

router.route('/:id')
  .get(getVentureById)
  .put(validateUpdateVenture, updateVenture)
  .delete(deleteVenture);

export default router;
