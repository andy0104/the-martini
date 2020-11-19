module.exports = {
   "type": process.env.ITYPEORM_CONNECTION,
   "host": process.env.ITYPEORM_HOST,
   "port": process.env.ITYPEORM_PORT,
   "username": process.env.ITYPEORM_USERNAME,
   "password": process.env.ITYPEORM_PASSWORD,
   "database": process.env.ITYPEORM_DATABASE,
   "synchronize": process.env.ITYPEORM_SYNCHRONIZE,
   "logging": process.env.ITYPEORM_LOGGING,
   "migrationsTableName": process.env.ITYPEORM_MIGRATION_TABLE,
   "entities": [
      "build/entity/**/*.js"
   ],
   "migrations": [
      "build/migration/**/*.js"
   ],
   "subscribers": [
      "build/subscriber/**/*.js"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}