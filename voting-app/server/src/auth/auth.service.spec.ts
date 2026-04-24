import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

// 1. Define mocks here — outside everything
const mockUsersService = {
  findByUsername: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-access-token'),
};

const mockRefreshTokenRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

// 2. describe block wraps everything
describe('AuthService', () => {
  let service: AuthService;

  // 3. beforeEach is where module setup + compile lives
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // 4. Your it() tests go here
  describe('register()', () => {
    it('throws ConflictException when username is already taken', async () => {
      //Arrange
      mockUsersService.findByUsername.mockResolvedValue({
        id: 1,
        username: 'alice',
      });

      //Act & Assert
      await expect(
        service.register({ username: 'alice', password: 'Secret1!' }),
      ).rejects.toThrow(ConflictException);
    });

    it('returns tokens when username is free', async () => {
      //Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 1, username: 'alice' });
      mockRefreshTokenRepo.create.mockReturnValue({
        token: 'rt',
        expiresAt: new Date(),
      });
      mockRefreshTokenRepo.save.mockResolvedValue(undefined);

      //Act
      const result = await service.register({
        username: 'alice',
        password: 'Secret1!',
      });

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login()', () => {
    it('throws UnauthorizedException when user not found', async () => {
      //Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);
      //Act & Assert
      await expect(
        service.login({ username: 'alice', password: 'Secret1!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      //Arrange
      mockUsersService.findByUsername.mockResolvedValue({
        id: 1,
        username: 'alice',
        hashedPassword: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.login({ username: 'alice', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens when credentials are valid', async () => {
      //Arrange
      mockUsersService.findByUsername.mockResolvedValue({
        id: 1,
        username: 'alice',
        hashedPassword: 'hashed',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockRefreshTokenRepo.create.mockResolvedValue({
        token: 'rt-token',
        expiresAt: new Date(),
      });
      mockRefreshTokenRepo.save.mockResolvedValue(undefined);

      //Act
      const result = await service.login({
        username: 'alice',
        password: 'Secret1!',
      });

      //Assert
      expect(result).toHaveProperty('accessToken', 'signed-access-token');
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.refreshToken).toBe('string');
    });
  });
});
