import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import fileupload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import csvRoutes from './routes/csv';
import errorHandler from './middleware/error';

// Load env vars
dotenv.config();

const app = express();

app.use(express.json());

// File uploading
app.use(fileupload());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

// Enable cors
app.use(cors());

// Prevent http param pollution
app.use(hpp());

app.use('/csv', csvRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
const server = app.listen(PORT, () => {
  console.log(
    colors.yellow.bold(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server and exit process
  server.close(() => process.exit(1));
});
