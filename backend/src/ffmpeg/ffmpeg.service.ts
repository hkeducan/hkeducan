import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class FfmpegService {
  constructor(private uploadService: UploadService) {}

  async transcodeAndThumb(inputKey: string, outputKeyBase: string) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hk-'));
    const inputPath = path.resolve(inputKey);
    const outMp4 = path.join(tmpDir, `${outputKeyBase}.mp4`);
    const thumb = path.join(tmpDir, `${outputKeyBase}.jpg`);

    await this.runFf(['-y', '-i', inputPath, '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', outMp4]);
    await this.runFf(['-y', '-i', inputPath, '-ss', '00:00:01.000', '-vframes', '1', thumb]);

    await this.uploadService.uploadFromLocalPath(`processed/${path.basename(outMp4)}`, outMp4, 'video/mp4');
    await this.uploadService.uploadFromLocalPath(`thumbnails/${path.basename(thumb)}`, thumb, 'image/jpeg');

    fs.unlinkSync(outMp4);
    fs.unlinkSync(thumb);
    fs.rmdirSync(tmpDir);

    return {
      videoKey: `processed/${path.basename(outMp4)}`,
      thumbnailKey: `thumbnails/${path.basename(thumb)}`
    };
  }

  runFf(args: string[]) {
    return new Promise<void>((resolve, reject) => {
      const proc = spawn('ffmpeg', args);
      proc.on('error', (err) => reject(err));
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('ffmpeg exited with code ' + code));
      });
    });
  }
}