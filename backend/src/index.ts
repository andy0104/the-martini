import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import * as express from "express";
import * as morgan from "morgan";
import * as dotenv from "dotenv";

// Import database service
import { initDatabase } from './services/database';
import { User } from "./entity/User";

// Load the env variables
dotenv.config();

const PORT = process.env.NODE_PORT || 5000;
const app = express();
app.use(morgan('dev'));

app.listen(PORT, () => {
  initDatabase();
  // try {
  //   // read connection options from ormconfig file (or ENV variables)
  //   const connectionOptions = await getConnectionOptions();
  //   console.log(connectionOptions);
    
  //   const connection = await createConnection(connectionOptions);
  //   console.log('Connected to the database');    
  // } catch (error) {
  //   console.log(`Database connection error`);
  //   console.error(error);
  // }
  
  // createConnection().then(async connection => {

  //   console.log("Inserting a new user into the database...");
  //   const user = new User();
  //   user.firstName = "Timber";
  //   user.lastName = "Saw";
  //   user.age = 25;
  //   await connection.manager.save(user);
  //   console.log("Saved a new user with id: " + user.id);

  //   console.log("Loading users from the database...");
  //   const users = await connection.manager.find(User);
  //   console.log("Loaded users: ", users);

  //   console.log("Here you can setup and run express/koa/any other framework.");

  // }).catch(error => console.log(error));

  console.log(`Server listening on PORT ${PORT} in ${process.env.NODE_ENV} mode!`);
});


