// src/firebase/firebase.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {}

  async testConnection() {
    const db = this.firebaseAdmin.firestore();
    const docRef = db.collection('testCollection').doc('helloWorld');

    // Writing "Hello, World!" to Firestore
    await docRef.set({
      message: 'Hello, World!',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Reading the document back
    const doc = await docRef.get();

    if (doc.exists) {
      return doc.data();
    } else {
      return { message: 'No document found!' };
    }
  }
}