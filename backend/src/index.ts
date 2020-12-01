import "reflect-metadata";
import express, { json } from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import device from 'express-device';

// Import error handler
import ErrorHandler from './services/errorhandler';

// Import database service
import { initDatabase } from './services/database';

// Import the routers
import AuthRouter from './routes/auth';
import CompanyRouter from './routes/company';
import ProjectRouter from './routes/project';

// Load the env variables
dotenv.config();

const PORT = process.env.NODE_PORT || 5000;
const app = express();
app.use(json());
app.use(cookieParser());
app.use(morgan('dev'));
// app.use(device.capture());

// Setup the application routes
app.use('/api/auth', AuthRouter);
app.use('/api/company', CompanyRouter);
app.use('/api/project', ProjectRouter);

// Error middleware
app.use(ErrorHandler);

app.listen(PORT, () => {
  initDatabase();
  console.log(`Server listening on PORT ${PORT} in ${process.env.NODE_ENV} mode!`);
});

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  console.log(reason.message);
  throw reason;
});

process.on('uncaughtException', (err) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});


