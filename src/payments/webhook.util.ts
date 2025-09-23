import CryptoJS from 'crypto-js';

export function verifyHmac(body: string, signature: string, secret: string, toleranceMs = 5*60*1000, ts?: number): boolean {
  const now = Date.now();
  const timestamp = ts ?? now;
  if (Math.abs(now - timestamp) > toleranceMs) return false;
  const message = `${timestamp}.${body}`;
  const mac = CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Base64);
  return mac === signature;
}
