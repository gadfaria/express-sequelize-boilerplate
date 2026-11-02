import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

let s3;

const putObject = async (key, body, contentType) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: body,
      ACL: "public-read",
      ContentType: contentType || "application/octet-stream",
    })
  );
  console.log(`[AWS] File uploaded successfully at ${key}`);
};

const awsService = {
  init: async () => {
    try {
      s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_KEYID,
          secretAccessKey: process.env.AWS_SECRETKEY,
        },
      });
      console.log("[AWS] AWS service initialized");
    } catch (error) {
      console.log("[AWS] Error during AWS service initialization");
      throw error;
    }
  },

  /**
   * Uploads a file saved on disk (e.g. by multer) and deletes the local copy
   */
  uploadFile: async (file, extension, bucketPath = "") => {
    if (!s3) throw new Error("[AWS] AWS service not initialized yet");

    const _uuid = file.uuid || crypto.randomUUID();
    const filePath = path.resolve(file.path);
    console.log(`[AWS] Assigned uuid ${_uuid} to file ${file.filename}`);

    try {
      const body = await fs.readFile(filePath);
      await putObject(`${bucketPath}${_uuid}.${extension}`, body, file.mimetype);

      return _uuid;
    } catch (error) {
      console.log("[AWS] Error during file upload");
      throw error;
    } finally {
      console.log(`[AWS] Deleting file ${filePath} from temp directory`);
      await fs.rm(filePath, { force: true });
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

    const _uuid = preferredUUID || crypto.randomUUID();
    console.log(`[AWS] Assigned uuid ${_uuid} to base64 file`);

    try {
      const body = Buffer.from(file.split(";base64,").pop(), "base64");
      await putObject(`${bucketPath}${_uuid}.${extension}`, body, mimetype);

      return _uuid;
    } catch (error) {
      console.log("[AWS] Error during file upload");
      throw error;
    }
  },

  deleteFile: async (fileUUID, extension, bucketPath = "") => {
    try {
      if (!s3) throw new Error("[AWS] AWS service not initialized yet");

      const deleteObjectCommand = new DeleteObjectCommand({
        Key: `${bucketPath}${fileUUID}.${extension}`,
        Bucket: process.env.AWS_BUCKET,
      });

      await s3.send(deleteObjectCommand);
      console.log(`[AWS] File ${fileUUID} deleted successfully.`);
    } catch (error) {
      console.log("[AWS] Error during file deletion");
      throw error;
    }
  },
};

export default awsService;
