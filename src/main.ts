import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Allow CI to override, but default to 3000/0.0.0.0
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const host = process.env.HOST ?? '0.0.0.0';

  const app = await NestFactory.create(AppModule);

  // --- Security headers ---
  app.use(helmet()); // includes X-Content-Type-Options: nosniff
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: { defaultSrc: ["'none'"] },
    })
  );
  app.use(helmet.frameguard({ action: 'deny' })); // X-Frame-Options: DENY
  app.use(helmet.hsts({ maxAge: 15552000 }));     // Strict-Transport-Security
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

  // --- Rate limiting & validation ---
  app.use(rateLimit({ windowMs: 60_000, max: 60 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(port, host);
  logger.log(`HTTP server listening on http://${host}:${port}`);
}

bootstrap().catch((err) => {
  // Ensure CI prints a useful error if boot fails
  // eslint-disable-next-line no-console
  console.error('❌ Nest failed to start:', err);
  process.exit(1);
});
