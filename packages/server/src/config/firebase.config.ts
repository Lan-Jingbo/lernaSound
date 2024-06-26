import { Module, Global } from '@nestjs/common';
import admin from 'firebase-admin';
import serviceAccount from './lernasound-firebase-adminsdk-gvj8o-edb0518c5a.json';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseConfigModule {}