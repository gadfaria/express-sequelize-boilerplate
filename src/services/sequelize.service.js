import { Sequelize } from "sequelize";
import fs from "fs";

const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));

let connection;

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const sequelizeService = {
  init: async () => {
    try {
      connection = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      /*
        Loading models automatically
      */
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
