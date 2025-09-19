import { mapTransformOptionsToQuery } from '../utils/transformations.util';

describe('mapTransformOptionsToQuery', () => {
  it('returns empty object for empty input', () => {
    expect(mapTransformOptionsToQuery()).toEqual({});
    expect(mapTransformOptionsToQuery({})).toEqual({});
  });

  it('maps width/height/format', () => {
    expect(mapTransformOptionsToQuery({ width: 100, height: 200, format: 'webp' })).toEqual({
      w: 100,
      h: 200,
      f: 'webp',
    });
  });

  it('maps all supported options', () => {
    const opts = {
      width: 320,
      height: 240,
      format: 'jpg',
      quality: 80,
      crop: 'faces',
      cropMode: 'extract',
      blur: 5,
      radius: 10,
      background: 'fff',
      border: '2px_solid_black',
      rotation: 90,
      progressive: true,
      named: 'custom',
      raw: 'l-text,i-Imagekit,fs-50,l-end',
    };
    expect(mapTransformOptionsToQuery(opts)).toEqual({
      w: 320,
      h: 240,
      f: 'jpg',
      q: 80,
      c: 'faces',
      cm: 'extract',
      bl: 5,
      r: 10,
      bg: 'fff',
      b: '2px_solid_black',
      rt: 90,
      pr: 'true',
      n: 'custom',
      raw: 'l-text,i-Imagekit,fs-50,l-end',
    });
  });

  it('merges options correctly', () => {
    expect(mapTransformOptionsToQuery({ width: 100, format: 'jpg', blur: 2 })).toEqual({
      w: 100,
      f: 'jpg',
      bl: 2,
    });
  });
});
