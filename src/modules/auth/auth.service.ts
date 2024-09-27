import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UtilService } from 'src/common/services/util.service';
import { ResponseDTO } from 'src/common/dtos/response.dto';

import { LoginDTO, LogoutDTO } from './dto/login-logout.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { EBcrypt } from 'src/common/enums/bcrypt.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private utilService: UtilService,
    private readonly userService: UserService,
  ) {}

  async validateUser(payload: User): Promise<User | null> {
    const user = await this.userService.findOne(payload.email);
    if (user) {
      return user;
    }
    return null;
  }

  async login(LoginDTO: LoginDTO): Promise<ResponseDTO<LoginResponseDTO>> {
    const { email, password } = LoginDTO;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('ACCESS_DENIED');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('PASSWORD_MISMATCHED');
    }

    const payload = {
      email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
    };

    const { accessToken, refreshToken } = this.getTokens(payload);

    this.userService.updateRefreshToken(email, refreshToken);
    return this.utilService.getSuccessResponse(
      {
        loggedIn: true,
        accessToken,
        refreshToken,
      },
      'RESPONSE_LOGIN_SUCCESS',
    );
  }

  getTokens(payload: any): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_TIMEOUT'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(RefreshTokenDTO: RefreshTokenDTO) {
    const { email, refreshToken } = RefreshTokenDTO;

    const refreshTokenMatches = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    if (!refreshTokenMatches) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const decodedToken = this.jwtService.decode(refreshToken);

    if (decodedToken['expiresIn'] * 1000 < Date.now()) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const user = await this.userService.findOneByEmail(decodedToken['email']);
    if (!user || !user.refresh_token || user.refresh_token !== refreshToken) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const payload = {
      email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
    };

    const tokens = this.getTokens(payload);

    await this.userService.updateRefreshToken(user.email, tokens.refreshToken);
    return this.utilService.getSuccessResponse(
      tokens,
      'RESPONSE_REFRESH_TOKEN_SUCCESS',
    );
  }

  public async logout(requestDto: LogoutDTO): Promise<ResponseDTO> {
    const { email } = requestDto;
    this.userService.updateRefreshToken(email, null);
    return this.utilService.getSuccessResponse(null, 'RESPONSE_LOGOUT_SUCCESS');
  }

  async registration(userDto: RegisterDTO): Promise<ResponseDTO> {
    const { email } = userDto;
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new ConflictException('USER_EXISTS');
    }
    try {
      userDto.password = await bcrypt.hash(
        userDto.password,
        EBcrypt.SALT_OR_ROUND,
      );
      const result = await this.userService.register(userDto);
      delete result.password;
      delete result.refresh_token;
      if (result) {
        return this.utilService.getSuccessResponse(
          result,
          'RESPONSE_REGISTRATION_SUCCESS',
        );
      }
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(
          null,
          'RESPONSE_USER_REGISTRATION_ERROR',
        ),
        error?.status ?? HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
