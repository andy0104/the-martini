import express, { json, Request, Response } from "express";
import os from 'os';
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import compression from 'compression';
import device from 'express-device';

// Import error handler
import ErrorHandler from './services/errorhandler';

// Import the routers
import AuthRouter from './routes/auth';
import CompanyRouter from './routes/company';
import ProjectRouter from './routes/project';
import NotFoundError from './errors/notfounderror';

// Load the env variables
dotenv.config();

// Set the libuv threads
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString();

const app = express();
// app.use(compression());
app.use(json());
app.use(cookieParser());
app.use(morgan('dev'));
// app.use(device.capture());

// Setup the application routes
app.use('/auth', AuthRouter);
app.use('/company', CompanyRouter);
app.use('/project', ProjectRouter);

// Handle 404 error
app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

// Error middleware
app.use(ErrorHandler);

export default app;