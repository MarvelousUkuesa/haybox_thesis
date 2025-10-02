# 4. Results

## 4.1 Execution Overview
We executed five change cycles across two pipelines on the same NestJS/TypeScript service. The **baseline** workflow ran only functional tests, while the **security-driven** workflow executed functional tests plus RATs and pre-merge gates (SAST, secrets, SCA) with scheduled DAST and container scans.

**Run summary**
- Cycles executed: {{cycles_count}}
- Commits analyzed: {{commits_total}}
- PRs (baseline, security): {{prs_baseline}} / {{prs_security}}
- Total tests run: {{tests_total}} (pass rate: {{tests_pass_rate}}%)

## 4.2 RQ1 — Can ASVS requirements be expressed as executable tests?
- ASVS items mapped to tests: **{{rq1_asvs_percent}}%** ({{rq1_asvs_implemented}} / {{rq1_asvs_total}})
- Average time to author RAT: **{{rq1_author_minutes_avg}} min**
- Test smells observed: **{{rq1_test_smells}}**

**Evidence:** `docs/rat-mapping.csv`, `test/**`

## 4.3 RQ2 — What is the minimal effective gate set?
- True Positive (TP) rate by gate: SAST **{{rq2_tp_sast}}%**, Secrets **{{rq2_tp_secrets}}%**, SCA **{{rq2_tp_sca}}%**, DAST **{{rq2_tp_dast}}%**
- False Positives per 1k LOC changed: **{{rq2_fp_per_kloc}}**
- Gate latency budget (median added minutes): **{{rq2_latency_median}}**

**Evidence:** `reports/semgrep.sarif`, `reports/gitleaks.json`, `reports/osv.json`, `reports/zap.json` (as available).

## 4.4 RQ3 — Do supply-chain attestations add enforceable value?
- Evidence completeness score: **{{rq3_evidence_score}}** (SBOM, signature, provenance)
- Policy evaluation: **{{rq3_policy_pass}}** passes / **{{rq3_policy_fail}}** fails
- Overhead minutes (median): **{{rq3_overhead_minutes}}**

**Evidence:** release artifacts from `.github/workflows/release-sign.yml`.

## 4.5 RQ4 — Impact vs. baseline
**M1 Security defect density (defects/KLOC):** baseline **{{m1_baseline}}**, security **{{m1_security}}**  
**M2 Mean time-to-detect (minutes):** baseline **{{m2_baseline}}**, security **{{m2_security}}**  
**M3 Regression resilience (% prevented reintroduction):** **{{m3_regression}}%**  
**M4 Pipeline cycle time (minutes):** baseline **{{m4_baseline}}**, security **{{m4_security}}**

Statistical tests (Mann–Whitney U where applicable):  
- M2: U={{m2_u}}, p={{m2_p}}, Cliff’s δ={{m2_delta}}  
- M4: U={{m4_u}}, p={{m4_p}}, Cliff’s δ={{m4_delta}}

## 4.6 Notable Findings
- {{finding_1}}
- {{finding_2}}
- {{finding_3}}

## 4.7 Threats to Validity (Observed)
- Construct: {{threat_construct}}
- Internal: {{threat_internal}}
- External: {{threat_external}}
- Conclusion: {{threat_conclusion}}

## 4.8 Replication Artifacts
- Workflows: `.github/workflows/pr-gate.yml`, `.github/workflows/pr-gate-baseline.yml`, `.github/workflows/nightly-security.yml`, `.github/workflows/release-sign.yml`
- Evidence bundle: `reports/**`, SBOM/signature/provenance under release assets.
