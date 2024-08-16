import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  generateFilename(file: Express.Multer.File): string {
    const randomName = crypto.randomBytes(16).toString('hex');
    return `${randomName}${extname(file.originalname)}`;
  }

  validateFile(file: Express.Multer.File): boolean {
    return file.mimetype.startsWith('image/');
  }

  async saveFile(file: Express.Multer.File, filename: string): Promise<void> {
    const path = `./uploads/avatars/${filename}`;
    await fs.writeFile(path, file.buffer);
  }
}
