console.log(process.env.NODE_ENV);
module.exports = {
   "type": process.env.ITYPEORM_CONNECTION,
   "host": process.env.ITYPEORM_HOST,
   "port": process.env.ITYPEORM_PORT,
   "username": process.env.ITYPEORM_USERNAME,
   "password": process.env.ITYPEORM_PASSWORD,
   "database": process.env.ITYPEORM_DATABASE,
   "synchronize": process.env.ITYPEORM_SYNCHRONIZE,
   "logging": process.env.ITYPEORM_LOGGING,
   "migrationsTableName": "migrations",
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}