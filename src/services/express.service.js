import express from "express";
import fs from "fs";
import globalErrorHandler from "../middlewares/errorHandler.middleware";

const routeFiles = fs
  .readdirSync(__dirname + "/../routes/")
  .filter((file) => file.endsWith(".js"));

let server;
let routes = [];

const expressService = {
  init: async () => {
    try {
      /*
        Loading routes automatically
      */
      for (const file of routeFiles) {
        const route = await import(`../routes/${file}`);
        const routeName = Object.keys(route)[0];
        routes.push(route[routeName]);
      }

      server = express();
      server.disable("x-powered-by");
      server.use(express.json());
      server.use(routes);
      server.use(globalErrorHandler);

      await new Promise((resolve, reject) => {
        server.listen(process.env.SERVER_PORT, (error) =>
          error ? reject(error) : resolve()
        );
      });
      console.log(`[EXPRESS] Express initialized on port ${process.env.SERVER_PORT}`);
    } catch (error) {
      console.log("[EXPRESS] Error during express service initialization");
      throw error;
    }
  },
};

export default expressService;
