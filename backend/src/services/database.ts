import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const initDatabase = async (connection_name: string): Promise<Connection> => {
  try {
    // read connection options from ormconfig file (or ENV variables)
    const connectionOptions = await getConnectionOptions(connection_name);
    const connection = await createConnection(connectionOptions);
    return connection;
    console.log('Connected to the database');
  } catch (error) {
    console.log(`Database connection error`);
    console.error(error);
  }
};