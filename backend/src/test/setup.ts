import { Connection, getConnection } from 'typeorm';
import app from '../server';
import { initDatabase } from '../services/database';

let connection: Connection;

beforeAll(async () => {
  try {
    // Connect to the database before starting the tests
    // await initDatabase('test');    
  } catch (error) {
    throw error;
  }
});

beforeEach(async () => {
  // Do something before each test
});

afterAll(async () => {
  // Close connection to the database
  try {    
    // getConnection('test').close();
  } catch (error) {
    throw error;
  }
});