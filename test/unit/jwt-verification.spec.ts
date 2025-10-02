import { decode, assertAlgAllowed, assertRegisteredClaims } from '../../src/security/jwt';

function makeToken(header: any, payload: any): string {
  const enc = (o: any) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${enc(header)}.${enc(payload)}.signature`;
}

describe('JWT verification helper', () => {
  test('rejects alg=none', () => {
    const t = makeToken({ alg: 'none' }, { iss: 'api', aud: 'web', exp: Math.floor(Date.now()/1000)+3600 });
    expect(() => {
      const { header } = decode(t);
      assertAlgAllowed(header, ['RS256']);
    }).toThrow(/Disallow alg=none/);
  });

  test('rejects unapproved alg', () => {
    const t = makeToken({ alg: 'HS256' }, { iss: 'api', aud: 'web', exp: Math.floor(Date.now()/1000)+3600 });
    expect(() => {
      const { header } = decode(t);
      assertAlgAllowed(header, ['RS256']);
    }).toThrow(/Algorithm not allowed/);
  });

  test('rejects missing/expired exp', () => {
    const t = makeToken({ alg: 'RS256' }, { iss: 'api', aud: 'web', exp: Math.floor(Date.now()/1000)-10 });
    const { header, payload } = decode(t);
    expect(() => assertAlgAllowed(header, ['RS256'])).not.toThrow();
    expect(() => assertRegisteredClaims(payload, { iss: 'api', aud: 'web' })).toThrow(/expired/);
  });

  test('accepts allowed alg and claims', () => {
    const t = makeToken({ alg: 'RS256' }, { iss: 'api', aud: ['web','mobile'], exp: Math.floor(Date.now()/1000)+3600 });
    const { header, payload } = decode(t);
    expect(() => assertAlgAllowed(header, ['RS256'])).not.toThrow();
    expect(() => assertRegisteredClaims(payload, { iss: 'api', aud: 'web' })).not.toThrow();
  });
});
