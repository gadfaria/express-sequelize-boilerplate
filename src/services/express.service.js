import express from "express";
import routes from "../routes/index.route";
import bodyParser from "body-parser";

let server;

/*
  body-parser: Parse incoming request bodies in a middleware before your handlers, 
  available under the req.body property.
*/

const expressService = {
  init: async () => {
    try {
      server = express();
      server.use(bodyParser.json());
      server.use(routes);

      server.listen(3004);
      console.log("[EXPRESS] Express initialized");
    } catch (error) {
      console.log("[EXPRESS] Error during express service initialization");
      throw error;
    }
  },
};

export default expressService;
