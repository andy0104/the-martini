import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import device from 'express-device';

// Import database service
import { initDatabase } from './services/database';
import { User } from "./entity/User";

// Import the routers
import AuthRouter from './routes/auth';

// Load the env variables
dotenv.config();

const PORT = process.env.NODE_PORT || 5000;
const app = express();
app.use(morgan('dev'));
// app.use(device.capture());

app.use('/api/auth', AuthRouter);

app.listen(PORT, () => {
  initDatabase();
  console.log(`Server listening on PORT ${PORT} in ${process.env.NODE_ENV} mode!`);
});


