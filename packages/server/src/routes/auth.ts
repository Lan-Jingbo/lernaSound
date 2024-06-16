import { Router } from 'express';
import AuthController from '../controllers/auth';

const router = Router();

router.post('/login/getUserInfo', AuthController.login);

export default router;