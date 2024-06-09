import { db } from '../config/firebase';

class UserPreferencesService {
  static async savePreferences(userID: number, eatingSettings: any): Promise<void> {
    const userRef = db.collection('users').doc(String(userID));
    await userRef.update({ eatingSettings });
  }

  static async getPreferences(userID: string): Promise<any> {
    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();
    if (!doc.exists) throw new Error('User not found');
    return doc.data()?.eatingSettings;
  }
}

export default UserPreferencesService;