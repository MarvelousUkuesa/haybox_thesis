/**
 * Compute M5 (Evidence completeness) by checking for files.
 * Usage:
 *   node scripts/metrics/m5_evidence.js <comma_separated_files> [out_path]
 * Example:
 *   node scripts/metrics/m5_evidence.js sbom.cdx.json,provenance.jsonl,artifact.sig
 */
const fs = require('fs');
const path = require('path');
const [,, csv, outPath='reports/m5_evidence.json'] = process.argv;
if (!csv) {
  console.error('Usage: node scripts/metrics/m5_evidence.js <comma_separated_files> [out_path]');
  process.exit(1);
}
const files = csv.split(',').map(s => s.trim()).filter(Boolean);
const results = files.map(f => ({ file: f, exists: fs.existsSync(path.resolve(f)) }));
const completeness = results.filter(r => r.exists).length / files.length;

const payload = { checked: files, results, completeness };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log('M5 written to', outPath);
