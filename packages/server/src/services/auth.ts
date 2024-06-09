import { db } from '../config/firebase.config';

class AuthService {
  static async login(userName: string): Promise<number> {
    const userRef = db.collection('users').doc(userName);
    const doc = await userRef.get();
    if (!doc.exists) {
      const newUser = {
        userID: Date.now(),
        userName,
        eatingSettings: {},
        eatingAnalysisResults: []
      };
      await userRef.set(newUser);
      return newUser.userID;
    }
    return doc.data()?.userID;
  }
}

export default AuthService;
