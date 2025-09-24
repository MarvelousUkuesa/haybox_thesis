import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // --- Security headers ---
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: { defaultSrc: ["'none'"] },
    })
  );
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.hsts({ maxAge: 15_552_000 }));
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

  // Bind to 0.0.0.0 so ZAP (host networking) can reach it
  await app.listen(Number(process.env.PORT ?? 3000), process.env.HOST ?? '0.0.0.0');
  logger.log(`HTTP server listening on http://${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 3000}`);
}

bootstrap().catch((err) => {
  console.error('❌ Nest failed to start:', err);
  process.exit(1);
});
