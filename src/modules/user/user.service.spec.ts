import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserDTO } from './dto/user.dto';
import { UtilService } from '../../common/services/util.service';
import { ConfigService } from '@nestjs/config';
import TokenVerificationPayload from '../auth/interface/token.verification.interface';
import { UpdateUserDTO } from './dto/update-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const basePayload = {
    first_name: 'TestFName',
    last_name: 'TestLName',
    email: 'test@test.com',
  };

  const user = {
    id: Date.now(),
    ...basePayload,
    password: 'Password12#',
  } as User;

  const tokenVerificationPayload = {
    ...basePayload,
  } as TokenVerificationPayload;

  const createUserDto = {
    ...basePayload,
  } as UserDTO;

  const updateUserDto = {
    ...user,
  } as UpdateUserDTO;

  const token = 'mock_jwt_token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        UtilService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(token),
            verify: jest.fn().mockReturnValue(user),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(userService).toBeTruthy();
  });

  it('should sign a JWT', () => {
    const token = jwtService.sign(user);
    expect(jwtService.sign).toHaveBeenCalledWith(user);
    expect(token).toBe(token);
  });

  it('register => Should register a new user and return its data', async () => {
    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

    const result = await userService.register(createUserDto);

    expect(mockUserRepository.save).toBeCalled();
    expect(mockUserRepository.save).toBeCalledWith(createUserDto);

    expect(result).toEqual(user);
  });

  it('update => Should update a user and return data', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(createUserDto);
    jest.spyOn(mockUserRepository, 'save').mockResolvedValue(updateUserDto);

    const result = await userService.update(
      tokenVerificationPayload,
      user.id,
      updateUserDto,
    );
    expect(result.data.first_name).toEqual(updateUserDto.first_name);
  });

  it('findOne => should find a user by a given email and return its data', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(user);

    const result = await userService.findOne(user.email);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({
      where: { email: user.email },
    });
  });
});
