import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const appConfig = {
  port: process.env.PORT || 5000,
  firebaseConfig: {
    databaseURL: 'https://<your-database-name>.firebaseio.com' // Replace
  }
};

export default appConfig;