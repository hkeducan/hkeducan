import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.S3_REGION || 'us-east-1'
});
export async function uploadBuffer(key: string, buffer: Buffer, contentType: string) {
  await s3.putObject({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType
  }).promise();
  return { key };
}
export function getObjectUrl(key: string) {
  const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, '');
  const bucket = process.env.S3_BUCKET!;
  return `${endpoint}/${bucket}/${key}`;
}
export async function getObjectToFile(key: string, localPath: string) {
  const fs = require('fs');
  const params = { Bucket: process.env.S3_BUCKET!, Key: key };
  const stream = s3.getObject(params).createReadStream();
  await new Promise((resolve, reject) => {
    const write = fs.createWriteStream(localPath);
    stream.pipe(write);
    stream.on('error', reject);
    write.on('finish', resolve);
    write.on('error', reject);
  });
}
