/**
 * Save minimal jest summary to reports/jest-summary.json
 * Usage in CI:
 *   npx jest --json --outputFile=reports/jest.json || true
 *   node scripts/metrics/jest_to_summary.js reports/jest.json reports/jest-summary.json
 */
const fs = require('fs');
const path = require('path');

const inPath = process.argv[2] || 'reports/jest.json';
const outPath = process.argv[3] || 'reports/jest-summary.json';

if (!fs.existsSync(inPath)) {
  console.error('Input not found:', inPath);
  process.exit(0);
}
const raw = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
const out = {
  numTotalTests: raw.numTotalTests || 0,
  numPassedTests: raw.numPassedTests || 0,
  numFailedTests: raw.numFailedTests || 0,
  startTime: raw.startTime || Date.now(),
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote', outPath);
