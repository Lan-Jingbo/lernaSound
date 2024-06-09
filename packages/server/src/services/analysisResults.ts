import { db, admin } from '../config/firebase.config';

class AnalysisResultsService {
  static async saveResults(userID: number, result: any): Promise<void> {
    const userRef = db.collection('users').doc(String(userID));
    await userRef.update({ eatingAnalysisResults: admin.firestore.FieldValue.arrayUnion(result) });
  }
}

export default AnalysisResultsService;