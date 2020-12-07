module.exports = [{
   "name": "dev",
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
}, {
   "name": "test",
   "type": process.env.ITYPEORM_TEST_CONNECTION,
   "host": process.env.ITYPEORM_TEST_HOST,
   "port": process.env.ITYPEORM_TEST_PORT,
   "username": process.env.ITYPEORM_TEST_USERNAME,
   "password": process.env.ITYPEORM_TEST_PASSWORD,
   "database": process.env.ITYPEORM_TEST_DATABASE,
   "synchronize": process.env.ITYPEORM_TEST_SYNCHRONIZE,
   "logging": false,
   "migrationsTableName": process.env.ITYPEORM_TEST_MIGRATION_TABLE,
   "dropSchema": true,
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
}]