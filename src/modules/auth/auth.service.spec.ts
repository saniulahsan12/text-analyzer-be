import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UtilService } from '../../common/services/util.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../common/decorators/user.decorator';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let utilService: UtilService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockUser = {
    email: 'test@example.com',
    refresh_token: 'validToken',
    first_name: 'John',
    last_name: 'Doe',
    id: Date.now(),
    password: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UtilService,
          useValue: {
            getSuccessResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    utilService = module.get<UtilService>(UtilService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        authService.login({
          email: mockUser.email,
          password: mockUser.password,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password mismatch', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: mockUser.email,
          password: mockUser.password + '_wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should throw ForbiddenException if refresh token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new ForbiddenException('ACCESS_DENIED');
      });

      await expect(
        authService.refreshTokens({
          email: mockUser.email,
          refreshToken: 'invalidToken',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return new access and refresh tokens', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        email: mockUser.email,
        expiresIn: Date.now() + 10000,
      });
      jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue({ email: mockUser.email });
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'getTokens').mockReturnValue({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });
  });
});
