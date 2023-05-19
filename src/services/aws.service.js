import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";

import path from "path";
import { v4 as uuidv4 } from "uuid";

let s3;
const root = path.dirname(require.main.filename);

const awsService = {
  init: async () => {
    try {
      s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_KEYID,
          secretAccessKey: process.env.AWS_SECRETKEY,
        },
        signatureVersion: "v4",
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

    const _uuid = file.uuid || uuidv4();
    console.log(`[AWS] Assigned uuid ${_uuid} to file ${file.filename}`);
    try {
      const _file = fs.readFileSync(`${root}/${file.path}`);

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `${bucketPath}${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: file.mimetype || "application/octet-stream",
      });

      const response = await s3.send(putObjectCommand);
      console.log(`[AWS] File uploaded successfully at ${response.Location}`);

      return _uuid;
    } catch (error) {
      console.log("[AWS] Error during file upload");
      throw error;
    } finally {
      console.log(
        `[AWS] Deleting file ${root}/${file.path} from temp directory`
      );
      fs.unlinkSync(`${root}/${file.path}`);
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

    if (!preferredUUID) console.log(`[AWS] File  has no uuid, creating uuid`);

    console.log(`[AWS] Creating base64 file uuid`);
    const _uuid = preferredUUID || uuidv4();
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

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `${bucketPath}${_uuid}.${extension}`,
        Body: _file,
        ACL: "public-read",
        ContentType: mimetype || "application/octet-stream",
      });

      const response = await s3.send(putObjectCommand);
      console.log(`[AWS] File uploaded successfully at ${response.Location}`);

      return _uuid;
    } catch (error) {
      console.log("[AWS] Error during file upload");
      throw error;
    } finally {
      console.log(
        `[AWS] Deleting file ${root}/${_uuid}.${extension} from temp directory`
      );
      fs.unlinkSync(`${root}/${_uuid}.${extension}`);
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
      console.log(`[AWS] File ${fileUUID} deleted succefully.`);

      return;
    } catch (error) {
      console.log("[AWS] Error during file deletion");
      throw error;
    }
  },
};

export default awsService;
