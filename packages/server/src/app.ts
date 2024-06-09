import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import userPrefRoutes from './routes/userPreferences';
import analysisRoutes from './routes/analysisResults';
import authMiddleware from './middle/auth';

const app = express();

app.use(bodyParser.json());

// Apply middleware for protected routes
app.use('/api', authMiddleware);

// Public routes
app.use('/api', authRoutes);

// Protected routes
app.use('/api', userPrefRoutes);
app.use('/api', analysisRoutes);

export default app;