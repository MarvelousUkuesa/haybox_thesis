# Metrics Scripts (M2, M4, M5)

Examples:
- M2 (MTTD): `node scripts/metrics/m2_mttd.js 2025-09-01T10:00:00Z 2025-09-01T10:05:40Z`
- M4 (Cycle time): `node scripts/metrics/m4_cycle_time.js 2025-09-01T10:00:00Z 2025-09-01T10:06:10Z`
- M5 (Evidence completeness): `node scripts/metrics/m5_evidence.js "dist/sbom.cdx.json,dist/provenance.jsonl,dist/cosign.sig"`

Outputs are written to `reports/` by default and can be uploaded as CI artifacts.
