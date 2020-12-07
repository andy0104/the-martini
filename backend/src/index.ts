import "reflect-metadata";
import app from './server';

// Import uitilities
import { __terminateServer } from './services/utility';

// Import database service
import { initDatabase } from './services/database';

const PORT = process.env.NODE_PORT || 5000;

const server = app.listen(PORT, async () => {
  try {
    await initDatabase(process.env.NODE_ENV);
  } catch (error) {
    console.log(error);
    throw error;
  }  
  console.log(`Server listening on PORT ${PORT} in ${process.env.NODE_ENV} mode!`);
  console.log(process.memoryUsage());
});

// Initialise the termination handler
const exitHandler = __terminateServer(server, {
  coredump: false,
  timeout: 500
});

// // get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  console.log(reason.message);
  console.log(promise);
  console.log('UnhandledRejection error');  
  exitHandler(1, 'unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);  
  exitHandler(1, 'uncaughtException');
});

process.on('SIGTERM', () => {    
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  exitHandler(0, 'SIGTERM');
});

process.on('SIGINT', () => {  
  console.log(`Process ${process.pid} has been interrupted`);
  exitHandler(0, 'SIGINT');
});


