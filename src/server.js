import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { loggerPino } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

// Use .env PORT or default 3000
const PORT = process.env.PORT ?? 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Logger middleware
app.use(loggerPino);

// Routes
app.use('/notes', notesRoutes);

// 404 handler (must be after routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Connect to DB BEFORE starting server
await connectMongoDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});