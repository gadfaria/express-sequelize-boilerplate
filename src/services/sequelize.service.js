import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import fs from "fs";

const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      const connection = new Sequelize(databaseConfig);

      /*
        Loading models automatically
      */
      const models = [];
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        models.push(model.default.init(connection));
      }

      // Associations can only be set once every model is initialized
      for (const model of models) {
        if (model.associate) model.associate(connection.models);
      }

      await connection.authenticate();

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
