import fs from "fs";
import AWS from "aws-sdk";
import path from "path";
import uuid from "uuid";

let s3;
const root = path.dirname(require.main.filename);

const awsService = {
  init: async () => {
    try {
      s3 = new AWS.S3({
        accessKeyId: process.env.AWS_KEYID,
        secretAccessKey: process.env.AWS_SECRETKEY,
      });
      console.log("[AWS] AWS service initialized");
    } catch (error) {
      console.log("[AWS] Error during AWS service initialization");
      throw error;
    }
  },

  uploadFile: async (file, extension, bucketPath = "") => {
    if (!s3) throw new Error("[AWS] AWS service not initialized yet");
    if (!file.uuid)
      console.log(`[AWS] File ${file.filename} has no uuid, creating uuid`);
    const _uuid = file.uuid || uuid.v4();
    console.log(`[AWS] Assigned uuid ${_uuid} to file ${file.filename}`);
    try {
      const _file = fs.readFileSync(`${root}/${file.path}`);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${bucketPath}${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: file.mimetype || "application/octet-stream",
      };

      return await new Promise((resolve, reject) => {
        s3.upload(params, (s3Err, data) => {
          try {
            if (s3Err) throw s3Err;
            console.log(`[AWS] File uploaded successfully at ${data.Location}`);
            `${root}/${file.path}`;
            fs.unlinkSync(`${root}/${file.path}`);
            console.log(
              `[AWS] Deleting file ${root}/${file.path} from temp directory`
            );
            resolve(_uuid);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.log("[AWS] Error during file upload");
      console.log(
        `[AWS] Deleting file ${root}/${file.path} from temp directory`
      );
      fs.unlinkSync(`${root}/${file.path}`);
      throw error;
    }
  },
  uploadFileAsBase64: async (
    file,
    extension,
    mimetype,
    preferredUUID = "",
    bucketPath = ""
  ) => {
    if (!s3) throw new Error("[AWS] AWS service not initialized yet");
    console.log(`[AWS] Creating base64 file uuid`);
    const _uuid = preferredUUID || uuid.v4();
    console.log(`[AWS] Assigned uuid ${_uuid} to base64 file`);
    try {
      const base64File = file.split(";base64,").pop();
      fs.writeFileSync(`${root}/${_uuid}.${extension}`, base64File, {
        encoding: "base64",
      });
      console.log(
        `[AWS] Converted base64 file with ${_uuid} to binary file ${_uuid}.${extension}`
      );
      const _file = fs.readFileSync(`${root}/${_uuid}.${extension}`);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${bucketPath}${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: mimetype || "application/octet-stream",
      };
      return await new Promise((resolve, reject) => {
        s3.upload(params, (s3Err, data) => {
          try {
            if (s3Err) throw s3Err;
            console.log(`[AWS] File uploaded successfully at ${data.Location}`);
            `${root}/${_uuid}.${extension}`;
            fs.unlinkSync(`${root}/${_uuid}.${extension}`);
            console.log(
              `[AWS] Deleting file ${root}/${_uuid}.${extension} from temp directory`
            );
            resolve(_uuid);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.log("[AWS] Error during file upload");
      console.log(
        `[AWS] Deleting file ${root}/${_uuid}.${extension} from temp directory`
      );
      fs.unlinkSync(`${root}/${_uuid}.${extension}`);
      throw error;
    }
  },
  deleteFile: (fileUUID, extension, bucketPath = "") => {
    try {
      if (!s3) throw new Error("[AWS] AWS service not initialized yet");
      return new Promise((resolve, reject) => {
        s3.deleteObject(
          {
            Key: `${bucketPath}${fileUUID}.${extension}`,
            Bucket: process.env.AWS_BUCKET,
          },
          (s3Err, data) => {
            if (s3Err) {
              reject(s3Err);
            }
            console.log(`[AWS] File ${fileUUID} deleted succefully.`);
            resolve;
          }
        );
      });
    } catch (error) {
      console.log("[AWS] Error during file deletion");
      throw error;
    }
  },
  deleteFiles: async (fileUUIDArray, extension, bucketPath = "") => {
    try {
      if (!s3) throw new Error("[AWS] AWS service not initialized yet");
      await Promise.all(
        fileUUIDArray.map((fileUUID) =>
          this.deleteFile(fileUUID, extension, bucketPath)
        )
      );
      console.log("[AWS] All files deleted succefully.");
    } catch (error) {
      console.log("[AWS] Error during files deletion");
      throw error;
    }
  },
};

export default awsService;