import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { getObjectUrl, uploadBuffer } from '../upload/s3.service';
dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.S3_REGION || 'us-east-1'
});

@Injectable()
export class UploadService {
  async getPresignedUrl(key: string, contentType: string) {
    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
      Expires: 60 * 60 // 1 hour
    };
    return s3.getSignedUrlPromise('putObject', params);
  }

  getObjectUrl(key: string) {
    return getObjectUrl(key);
  }

  async uploadFromLocalPath(key: string, localPath: string, contentType: string) {
    const fs = require('fs');
    const buffer = fs.readFileSync(localPath);
    await uploadBuffer(key, buffer, contentType);
  }
}