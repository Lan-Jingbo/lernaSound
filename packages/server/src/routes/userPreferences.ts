import { Router } from 'express';
import UserPreferencesController from '../controllers/userPreferences';

const router = Router();

router.post('/saveUserPreferences', UserPreferencesController.savePreferences);
router.get('/getUserPreferences', UserPreferencesController.getPreferences);

export default router;