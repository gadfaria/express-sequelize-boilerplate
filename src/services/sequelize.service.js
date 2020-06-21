import { Sequelize } from "sequelize";
import fs from "fs";

const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));

let connection;

const sequelizeService = {
  init: async () => {
    try {
      connection = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          dialect: process.env.DB_TYPE,
        }
      );

      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        model.default.init(connection);
      }

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
