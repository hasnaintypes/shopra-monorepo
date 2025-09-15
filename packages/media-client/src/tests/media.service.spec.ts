import { LoggerService } from '@shopra/logging';
import * as fs from 'fs';
import { Buffer } from 'node:buffer';
import * as imagekitClient from '../imagekit.client';
import { MediaService } from '../media.service';

jest.mock('imagekit');
jest.mock('@shopra/logging');
jest.mock('@shopra/kafka', () => ({
  KafkaProducer: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
  })),
}));

const mockUpload = jest.fn();
const mockDeleteFile = jest.fn();
const mockUrl = jest.fn();
const mockListFiles = jest.fn();

jest.spyOn(imagekitClient, 'getMediaProviderClient').mockReturnValue({
  upload: mockUpload,
  deleteFile: mockDeleteFile,
  url: mockUrl,
  listFiles: mockListFiles,
});

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};
(
  LoggerService as unknown as { mockImplementation: (fn: () => typeof logger) => void }
).mockImplementation(() => logger);

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MediaService();
  });

  it('should upload and return result', async () => {
    mockUpload.mockResolvedValue({ fileId: 'id', filePath: '/foo', url: 'http://img' });
    const result = await service.upload(Buffer.from('data'), { fileName: 'foo.jpg' });
    expect(result).toEqual({ fileId: 'id', filePath: '/foo', url: 'http://img' });
    expect(logger.info).toHaveBeenCalledWith('Upload successful', expect.any(Object));
  });

  it('should log and throw on upload error', async () => {
    mockUpload.mockRejectedValue(new Error('fail'));
    await expect(service.upload(Buffer.from('data'), { fileName: 'foo.jpg' })).rejects.toThrow(
      'fail',
    );
    expect(logger.error).toHaveBeenCalledWith('Upload failed', expect.any(Object));
  });

  it('should getUrl with transform', () => {
    mockUrl.mockReturnValue('http://img?tr=w-100');
    const url = service.getUrl('/foo', { width: 100 });
    expect(url).toContain('tr=w-100');
  });

  it('should delete file and log', async () => {
    mockDeleteFile.mockResolvedValue(undefined);
    await service.delete('id');
    expect(logger.info).toHaveBeenCalledWith('Delete successful', { fileId: 'id' });
  });

  it('should log and throw on delete error', async () => {
    mockDeleteFile.mockRejectedValue(new Error('fail'));
    await expect(service.delete('id')).rejects.toThrow('fail');
    expect(logger.error).toHaveBeenCalledWith('Delete failed for fileId: id', expect.any(Error));
  });

  it('should upload a real image file', async () => {
    const imagePath = 'src/tests/data/test_image.png';
    const imageBuffer = fs.readFileSync(imagePath);
    mockUpload.mockResolvedValue({ fileId: 'imgid', filePath: '/imgpath', url: 'http://imgurl' });
    const result = await service.upload(imageBuffer, { fileName: 'test_image.jpg' });
    expect(result).toEqual({ fileId: 'imgid', filePath: '/imgpath', url: 'http://imgurl' });
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        file: imageBuffer,
        fileName: 'test_image.jpg',
      }),
    );
  });

  it('should list files and log', async () => {
    const files = [
      { fileId: 'id1', name: 'foo.jpg', url: 'http://img1', filePath: '/foo.jpg', type: 'image' },
      { fileId: 'id2', name: 'bar.jpg', url: 'http://img2', filePath: '/bar.jpg', type: 'image' },
    ];
    mockListFiles.mockResolvedValue(files);
    const result = await service.listFiles({});
    expect(result).toEqual(files);
    expect(logger.info).toHaveBeenCalledWith('Listed files', { count: files.length });
    expect(mockListFiles).toHaveBeenCalledWith({});
  });
});
