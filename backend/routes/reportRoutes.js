import express from 'express';
import {
  generateReport,
  getReports,
  getReportById,
  deleteReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

export default router;
