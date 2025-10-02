/**
 * Compute M4 (Pipeline cycle time) from start/end timestamps.
 * Usage:
 *   node scripts/metrics/m4_cycle_time.js <start_ts_iso> <end_ts_iso> [out_path]
 */
const fs = require('fs');
const [,, startTs, endTs, outPath='reports/m4_cycle_time.json'] = process.argv;

if (!startTs || !endTs) {
  console.error('Usage: node scripts/metrics/m4_cycle_time.js <start_ts_iso> <end_ts_iso> [out_path]');
  process.exit(1);
}

const t0 = new Date(startTs).getTime();
const t1 = new Date(endTs).getTime();
const seconds = (t1 - t0) / 1000;

const result = { start: startTs, end: endTs, seconds, minutes: seconds/60 };
fs.mkdirSync(require('path').dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('M4 written to', outPath);
