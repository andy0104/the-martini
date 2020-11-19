import { createConnection, getConnectionOptions } from "typeorm";

export const initDatabase = async (): Promise<void> => {
  try {
    // read connection options from ormconfig file (or ENV variables)
    const connectionOptions = await getConnectionOptions();    
    const connection = await createConnection(connectionOptions);
    console.log('Connected to the database');
  } catch (error) {
    console.log(`Database connection error`);
    console.error(error);
  }
};