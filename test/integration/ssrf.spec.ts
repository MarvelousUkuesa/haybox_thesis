import { validateUrl } from '../../src/util/url-fetcher';

describe('SSRF URL validation', () => {
  const policy = { allowHosts: ['safe.example.com'] };

  test('rejects localhost', () => {
    expect(() => validateUrl('https://localhost/admin', policy)).toThrow(/Private/);
  });

  test('rejects HTTP (non-HTTPS)', () => {
    expect(() => validateUrl('http://safe.example.com/data', policy)).toThrow(/HTTPS/);
  });

  test('rejects host not in allow-list', () => {
    expect(() => validateUrl('https://evil.example.net/x', policy)).toThrow(/allow-list/);
  });

  test('accepts allowed host over HTTPS', () => {
    expect(() => validateUrl('https://safe.example.com/api', policy)).not.toThrow();
  });
});
