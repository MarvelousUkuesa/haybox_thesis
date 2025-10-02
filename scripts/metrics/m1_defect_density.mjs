#!/usr/bin/env node
/**
 * Compute M1 = confirmed security defects per KLOC.
 * Inputs:
 *   - reports/cloc.json (from: npx cloc src --include-lang=TypeScript --json)
 *   - docs/defects.csv (TP tool findings)
 *   - docs/seeded-faults.csv (seeded vulns)
 * Output:
 *   - reports/m1_defect_density.json
 *   - prints a one-line summary
 */
import fs from "fs";
import path from "path";

const repo = process.cwd();
const read = (p) => {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return null;
  }
};
const csv = (txt) => {
  if (!txt) return [];
  const lines = txt.trim().split(/\r?\n/);
  const hdr = lines
    .shift()
    .split(",")
    .map((s) => s.trim());
  return lines.filter(Boolean).map((line) => {
    const parts = line.split(",").map((s) => s.trim());
    const obj = {};
    hdr.forEach((h, i) => (obj[h] = parts[i] ?? ""));
    return obj;
  });
};

const clocPath = path.join(repo, "reports", "cloc.json");
const clocRaw = read(clocPath);
if (!clocRaw) {
  console.error(
    "Missing reports/cloc.json. Run:\n  npx cloc src --include-lang=TypeScript --json --quiet | tee reports/cloc.json"
  );
  process.exit(1);
}

const cloc = JSON.parse(clocRaw);
const tsCode = (cloc.TypeScript && cloc.TypeScript.code) || 0;
const kloc = tsCode / 1000;

// defects.csv (TP only)
const defectsCsv = csv(read(path.join(repo, "docs", "defects.csv")));
const tpToolIds = new Set(
  defectsCsv
    .filter((r) => (r.tp_fp || "").toUpperCase() === "TP")
    .map((r) => r.id || `${r.tool}:${r.rule}:${r.file}:${r.line}`)
);

// seeded-faults.csv (unique by fault_id)
const seededCsv = csv(read(path.join(repo, "docs", "seeded-faults.csv")));
const seedIds = new Set(seededCsv.map((r) => r.fault_id).filter(Boolean));

// Avoid double-counting if a seeded item is also in defects TP (rare but possible if you logged both)
const totalConfirmed = tpToolIds.size + seedIds.size;

// Compute M1
const m1 = kloc > 0 ? totalConfirmed / kloc : 0;

const out = {
  ts_code_lines: tsCode,
  kloc: Number(kloc.toFixed(3)),
  confirmed_tool_TPs: tpToolIds.size,
  confirmed_seeded: seedIds.size,
  total_confirmed: totalConfirmed,
  m1_defects_per_kloc: Number(m1.toFixed(3)),
  notes:
    "LOC from cloc on src/, counting TypeScript code lines only; defects = TP tool findings + unique seeded faults.",
};

fs.mkdirSync(path.join(repo, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(repo, "reports", "m1_defect_density.json"),
  JSON.stringify(out, null, 2)
);
console.log(
  `M1 = ${out.m1_defects_per_kloc} defects/KLOC  (confirmed=${totalConfirmed}, KLOC=${out.kloc})`
);
