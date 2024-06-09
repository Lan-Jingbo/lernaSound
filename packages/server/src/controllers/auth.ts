import { Request, Response } from 'express';
import AuthService from '../services/auth';

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const userID = await AuthService.login(req.body.userName);
      res.json({ userID });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AuthController;
