// test/integration/security-headers.spec.ts
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import helmet from "helmet";

describe("Security headers", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Attach the same headers you expect in prod
    app.use(helmet()); // includes X-Content-Type-Options: nosniff
    app.use(
      helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: { defaultSrc: ["'none'"] },
      })
    );
    app.use(helmet.frameguard({ action: "deny" })); // X-Frame-Options: DENY
    app.use(helmet.hsts({ maxAge: 15552000 })); // Strict-Transport-Security
    app.use(helmet.referrerPolicy({ policy: "no-referrer" })); // Referrer-Policy

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("sets strict headers (ASVS 14.2)", async () => {
    const res = await request(app.getHttpServer()).get("/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["strict-transport-security"]).toBeDefined();
    expect(res.headers["content-security-policy"]).toMatch(
      /default-src 'none'/
    );
  });
});
