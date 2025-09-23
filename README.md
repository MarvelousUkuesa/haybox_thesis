# PayBox STDD Starter (NestJS/TypeScript)

This starter implements your **Security Test-Driven Development** workflow with **Requirements-as-Tests** and **CI/CD gates**.

## 0) Prereqs
- Node.js 20+, Docker, GitHub account
- Create a new GitHub repo and push this template

## 1) Install & Run
```bash
npm ci
npm run test:sec      # unit + integration + BDD/property
npm run start:dev
```

## 2) What to Screenshot for your Thesis
- **PR Gate run:** Open a Pull Request → Actions → *PR Gate (Fast Security)* → screenshot summary
- **Nightly Security run:** Trigger *Nightly Security* via `Run workflow` → screenshot ZAP results + SBOM artifact
- **Release evidence:** Push a tag `v0.1.0` → Actions → *Release (Sign & Attest)* → screenshot Cosign/sign step + provenance artifact

## 3) How the Tests Map to Standards
See `docs/rat-mapping.csv` (import into Sheets for your appendix).

## 4) CI/CD Gates
- `.github/workflows/pr-gate.yml` → fast path (tests, Semgrep, Gitleaks, OSV)
- `.github/workflows/nightly-security.yml` → ZAP Baseline, SBOM via Syft, Trivy
- `.github/workflows/release-sign.yml` → Build image, sign with **Cosign** (keyless OIDC), attach **SLSA provenance**

## 5) ZAP Baseline Tips
- The starter exposes `/health` (public) and a protected endpoint `/invoices/secret-example` (requires `x-role` header). Baseline scan will hit `/health`. For authenticated scans, seed a session or add a login script later.

## 6) Customize for Real Auth
- Replace the demo guard in `src/security/auth.guard.ts` with proper **JWT validation (iss/aud/exp/alg)** and role checks.
- Add DTOs for real endpoints; expand property-based tests in `test/bdd/property-dto.spec.ts`.

## 7) Supply Chain Evidence
- **SBOM:** produced in Nightly (CycloneDX)
- **Signing:** Cosign signs your image on tag pushes (keyless via GitHub OIDC)
- **Provenance:** GitHub attestation step attaches SLSA-like provenance to the image

## 8) Commands Reference
```bash
# run tests
npm run test:sec

# local ZAP baseline against running app (optional)
docker run --rm -t owasp/zap2docker-stable zap-baseline.py -t http://host.docker.internal:3000 -a -I

# generate SBOM locally
docker run --rm -v $PWD:/workspace anchore/syft packages dir:/workspace -o cyclonedx-json > sbom.cdx.json
```
