import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('IDOR / BOLA', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule]}).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => { await app.close(); });

  it('denies access without role (deny by default)', async () => {
    await request(app.getHttpServer()).get('/invoices/secret-example').expect(403);
  });

  it('allows with role header (simulated JWT role claim)', async () => {
    await request(app.getHttpServer()).get('/invoices/secret-example').set('x-role','customer').expect(200);
  });
});
