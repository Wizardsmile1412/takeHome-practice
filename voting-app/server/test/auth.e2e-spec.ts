import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from 'http';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';
import { Quote } from 'src/entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  // beforeAll - boots the app ONCE for all tests in this file
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // In-memory SQLite - fresh database, destroyed after tests finish
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User, Quote, Vote, RefreshToken],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Must apply the same middleware as main.ts - it doesn't run automatically in tests
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  // afterAll - clean up after all tests finish
  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('201 - returns tokens on success', async () => {
      const res = await request(httpServer)
        .post('/auth/register')
        .send({ username: 'alice', password: 'Secret1!' })
        .expect(201);

      // accessToken อยู่ใน body
      expect(res.body).toHaveProperty('accessToken');

      // refreshToken อยู่ใน Set-Cookie header
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('refresh_token');
    });

    it('409 - throws when username is already taken', async () => {
      // alice was already registered in the test above - same in-memory db
      await request(httpServer)
        .post('/auth/register')
        .send({ username: 'alice', password: 'Secret1!' })
        .expect(409);
    });

    it('400 - throws when body is invalid', async () => {
      await request(httpServer)
        .post('/auth/register')
        .send({ username: 'al' }) // too short, missing password
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    let cookies: string[]; // เก็บ cookie จาก register ไว้ใช้ต่อ

    beforeAll(async () => {
      // ต้อง register ก่อนเพื่อให้ได้ refresh_token cookie มา
      const res = await request(httpServer)
        .post('/auth/register')
        .send({ username: 'bob', password: 'Secret1!' });

      cookies = res.headers['set-cookie'] as unknown as string[];
    });

    it('200 - returns new accessToken with valid cookie', async () => {
      const res = await request(httpServer)
        .post('/auth/refresh')
        .set('Cookie', cookies) // ส่ง cookie กลับไปหา server
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
    });

    it('401 - throws when token is invalid', async () => {
      await request(httpServer)
        .post('/auth/refresh')
        .set('Cookie', ['refresh_token=fake-invalid-token']) // ← token ปลอม
        .expect(401);
    });
  });
});
