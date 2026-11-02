import "./config/env";
import sequelizeService from "./services/sequelize.service";
import awsService from "./services/aws.service";
import expressService from "./services/express.service";

// Express goes last so the server only accepts requests once everything else is ready
const services = [sequelizeService, awsService, expressService];

(async () => {
  try {
    for (const service of services) {
      await service.init();
    }
    console.log("Server initialized.");
    //PUT ADDITIONAL CODE HERE.
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
