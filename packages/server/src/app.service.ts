import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {}

  async writeHelloWorld() {
    try {
      const db = this.firebaseAdmin.firestore();
      const docRef = db.collection('participants').doc('helloWorld');

      await docRef.set({
        message: 'Hello, World!',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { message: 'Document successfully written!' };
    } catch (error) {
      throw new Error('Failed to write document to Firestore');
    }
  }

  async readHelloWorld() {
    try {
      const db = this.firebaseAdmin.firestore();
      const docRef = db.collection('participants').doc('helloWorld');
      const doc = await docRef.get();

      if (doc.exists) {
        return doc.data();
      } else {
        return { message: 'No document found!' };
      }
    } catch (error) {
      throw new Error('Failed to read document from Firestore');
    }
  }

  async deleteHelloWorld() {
    try {
      const db = this.firebaseAdmin.firestore();
      const docRef = db.collection('participants').doc('helloWorld');
      await docRef.delete();

      return { message: 'Document successfully deleted!' };
    } catch (error) {
      throw new Error('Failed to delete document from Firestore');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}