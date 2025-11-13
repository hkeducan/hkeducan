import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { getObjectToFile, uploadBuffer } from '../upload/s3.service';
import { UploadService } from '../upload/upload.service';
import { VideosService } from '../videos/videos.service';
import { execFile } from 'child_process';
@Injectable()
@Processor('ffmpeg')
export class FfmpegProcessor {
  private readonly logger = new Logger(FfmpegProcessor.name);
  constructor(private uploadService: UploadService, private videosService: VideosService) {}

  @Process()
  async handle(job: Job) {
    const { key, videoId } = job.data as { key: string; videoId: string };
    this.logger.log(`Processing job for key=${key} videoId=${videoId}`);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hk-'));
    const localInput = path.join(tmpDir, path.basename(key));
    try {
      // download from S3 to localInput
      await getObjectToFile(key, localInput);
      // prepare outputs
      const outMp4 = path.join(tmpDir, `${path.parse(localInput).name}-out.mp4`);
      const thumb = path.join(tmpDir, `${path.parse(localInput).name}-thumb.jpg`);
      // run ffmpeg via child_process (ensure ffmpeg installed)
      await this.runFfmpeg(['-y','-i', localInput, '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', outMp4]);
      await this.runFfmpeg(['-y','-i', localInput, '-ss', '00:00:01.000', '-vframes', '1', thumb]);
      // upload processed files
      await this.uploadService.uploadFromLocalPath(`processed/${path.basename(outMp4)}`, outMp4, 'video/mp4');
      await this.uploadService.uploadFromLocalPath(`thumbnails/${path.basename(thumb)}`, thumb, 'image/jpeg');
      // update video record
      const videoKey = `processed/${path.basename(outMp4)}`;
      const thumbnailKey = `thumbnails/${path.basename(thumb)}`;
      await this.videosService.markProcessed(videoId, videoKey, thumbnailKey);
      this.logger.log(`Job completed for videoId=${videoId}`);
    } catch (err) {
      this.logger.error('Ffmpeg job failed', err);
      throw err;
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  }

  async runFfmpeg(args: string[]) {
    return new Promise<void>((resolve, reject) => {
      const proc = execFile('ffmpeg', args, (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
