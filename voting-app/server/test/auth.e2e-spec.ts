import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  });

  // afterAll - clean up after all tests finish
  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('201 - returns tokens on success', async () => {
      const res = await request(app.getHttpServer())
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
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'alice', password: 'Secret1!' })
        .expect(409);
    });

    it('400 - throws when body is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'al' }) // too short, missing password
        .expect(400);
    });
  });
});
