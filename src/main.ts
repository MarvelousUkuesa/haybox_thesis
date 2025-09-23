import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Enable Helmet defaults (includes noSniff)
  app.use(helmet());

  // 2) Override/strengthen specific headers explicitly
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: { defaultSrc: ["'none'"] },
    })
  );
  app.use(helmet.frameguard({ action: "deny" })); // X-Frame-Options: DENY
  app.use(helmet.hsts({ maxAge: 15552000 })); // Strict-Transport-Security
  app.use(helmet.referrerPolicy({ policy: "no-referrer" })); // Referrer-Policy

  // Rate limit + validation
  app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
