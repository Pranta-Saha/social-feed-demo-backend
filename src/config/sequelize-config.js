import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "appifylab_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  },
  test: {
    username: process.env.TEST_DB_USER || "postgres",
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME || "appifylab_test",
    host: process.env.TEST_DB_HOST || "localhost",
    port: process.env.TEST_DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
};

export default config;
