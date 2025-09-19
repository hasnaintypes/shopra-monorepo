import { ResponsiveService } from '../responsive/responsive.service';

jest.mock('../../src/imagekit.client', () => ({
  getMediaProviderClient: () => ({
    url: ({
      path,
      transformation,
    }: {
      path: string;
      transformation?: Array<Record<string, string | number>>;
    }) => {
      // Simulate ImageKit URL transformation string
      const params =
        transformation && transformation[0]
          ? Object.entries(transformation[0])
              .map(([k, v]) => `${k}-${v}`)
              .join(',')
          : '';
      return `https://fake.imagekit.io${path}?tr:${params}`;
    },
  }),
}));

describe('ResponsiveService', () => {
  let service: ResponsiveService;

  beforeEach(() => {
    service = new ResponsiveService();
  });

  it('getTransformedUrl returns valid URL', () => {
    const url = service.getTransformedUrl('/foo.jpg', { width: 100, format: 'webp' });
    expect(typeof url).toBe('string');
    expect(url).toContain('tr:w-100,f-webp');
  });

  it('generateSrcset returns valid srcset', () => {
    const srcset = service.generateSrcset('/foo.jpg', [320, 640], { format: 'webp' });
    expect(typeof srcset).toBe('string');
    expect(srcset).toContain('320w');
    expect(srcset).toContain('640w');
  });

  it('generateSrcset snapshot', () => {
    const srcset = service.generateSrcset('/foo.jpg', [320, 640, 1280], { format: 'webp' });
    expect(srcset).toMatchSnapshot();
  });

  // TODO: test logger on error
});
