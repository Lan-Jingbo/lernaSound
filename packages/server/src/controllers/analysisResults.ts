import { Request, Response } from 'express';
import AnalysisResultsService from '../services/analysisResults';

class AnalysisResultsController {
  static async saveResults(req: Request, res: Response) {
    try {
      const { userID, result } = req.body;
      await AnalysisResultsService.saveResults(userID, result);
      res.json({ message: 'Results saved' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AnalysisResultsController;
