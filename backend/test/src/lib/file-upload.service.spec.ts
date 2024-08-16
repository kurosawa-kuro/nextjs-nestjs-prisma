import { FileUploadService } from '@/lib/file-upload.service';
import * as crypto from 'crypto';

jest.mock('fs/promises');
jest.mock('crypto');

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new FileUploadService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFilename', () => {
    it('should generate a random filename with correct extension', () => {
      const mockFile = {
        originalname: 'test.jpg',
      } as Express.Multer.File;

      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn().mockReturnValue('0123456789abcdef'),
      });

      const filename = service.generateFilename(mockFile);

      expect(filename).toBe('0123456789abcdef.jpg');
      expect(crypto.randomBytes).toHaveBeenCalledWith(16);
    });
  });

  describe('validateFile', () => {
    it('should return true for image files', () => {
      const mockImageFile = {
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      expect(service.validateFile(mockImageFile)).toBe(true);
    });

    it('should return false for non-image files', () => {
      const mockNonImageFile = {
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      expect(service.validateFile(mockNonImageFile)).toBe(false);
    });
  });
});
