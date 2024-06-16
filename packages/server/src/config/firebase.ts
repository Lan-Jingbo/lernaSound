import admin from 'firebase-admin';
import serviceAccount from './path/to/serviceAccountKey.json'; // Replace later

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com' // Replace URL later
});

const db = admin.firestore();

export { admin, db };