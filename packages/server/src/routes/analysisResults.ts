import { Router } from 'express';
import AnalysisResultsController from '../controllers/analysisResults';

const router = Router();

router.post('/saveResults', AnalysisResultsController.saveResults);

export default router;