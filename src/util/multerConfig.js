import multer from "multer";
import { extname, resolve } from "path";
import uuid from "uuid";

const multerConfig = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, cb) => {
      const imageUuid = uuid.v4();
      return cb(null, imageUuid + extname(file.originalname));
    },
  }),
};

export default multerConfig
