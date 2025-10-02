/**
 * Compute M2 (Mean Time To Detect) for a single event.
 * Usage:
 *   node scripts/metrics/m2_mttd.js <introduced_ts_iso> <detection_ts_iso> [out_path]
 */
const fs = require('fs');
const [,, introduced, detected, outPath='reports/m2_mttd.json'] = process.argv;

if (!introduced || !detected) {
  console.error('Usage: node scripts/metrics/m2_mttd.js <introduced_ts_iso> <detection_ts_iso> [out_path]');
  process.exit(1);
}

const t0 = new Date(introduced).getTime();
const t1 = new Date(detected).getTime();
const seconds = (t1 - t0) / 1000;

const result = { introduced, detected, seconds, minutes: seconds/60 };
fs.mkdirSync(require('path').dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('M2 written to', outPath);
