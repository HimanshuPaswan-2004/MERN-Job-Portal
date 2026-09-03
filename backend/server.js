import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './src/config/db.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import companyRoutes from './src/routes/companyRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('JobPortal API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
