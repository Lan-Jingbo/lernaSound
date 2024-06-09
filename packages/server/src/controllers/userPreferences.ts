import { Request, Response } from 'express';
import UserPreferencesService from '../services/userPreferences';

class UserPreferencesController {
  static async savePreferences(req: Request, res: Response) {
    try {
      const { userID, eatingSettings } = req.body;
      await UserPreferencesService.savePreferences(userID, eatingSettings);
      res.json({ message: 'Preferences saved' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPreferences(req: Request, res: Response) {
    try {
      const { userID } = req.query;
      const preferences = await UserPreferencesService.getPreferences(userID as string);
      res.json({ eatingSettings: preferences });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserPreferencesController;