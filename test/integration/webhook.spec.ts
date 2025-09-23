import { verifyHmac } from '../../src/payments/webhook.util';

describe('Webhook HMAC verification', () => {
  it('accepts valid signature and rejects tampered/replayed', () => {
    const secret = 'test_secret';
    const ts = Date.now();
    const body = JSON.stringify({orderId:'123', amount:1000});
    const CryptoJS = require('crypto-js');
    const sig = CryptoJS.HmacSHA256(`${ts}.${body}`, secret).toString(CryptoJS.enc.Base64);
    expect(verifyHmac(body, sig, secret, 5*60*1000, ts)).toBe(true);
    expect(verifyHmac(JSON.stringify({orderId:'123', amount:1001}), sig, secret, 5*60*1000, ts)).toBe(false);
    expect(verifyHmac(body, sig, secret, 0, ts - 10000)).toBe(false);
  });
});
