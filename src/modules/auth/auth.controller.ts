import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

import { UtilService } from 'src/common/services/util.service';
import { User } from 'src/common/decorators/user.decorator';

import TokenVerificationPayload from './interface/token.verification.interface';
import { LoginDTO, LogoutDTO } from './dto/login-logout.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { ResponseDTO } from 'src/common/dtos/response.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDTO } from './dto/register.dto';
import { UserDTO } from '../user/dto/user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private utilService: UtilService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'This endpoint is used for login' })
  @ApiOkResponse({ type: LoginResponseDTO, description: 'Login Successfully' })
  @ApiBody({ type: LoginDTO })
  async login(@Body() LoginDTO: LoginDTO): Promise<ResponseDTO> {
    return await this.authService.login(LoginDTO);
  }

  @Get('profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  getProfile(@User() user: TokenVerificationPayload) {
    try {
      return this.utilService.getSuccessResponse(
        user,
        'RESPONSE_AUTH_TOKEN_DECODE',
        'RESPONSE_AUTH_TOKEN_DECODE',
      );
    } catch (err) {
      return this.utilService.getErrorResponse(
        err?.message,
        'RESPONSE_AUTH_TOKEN_ERROR',
        'RESPONSE_AUTH_TOKEN_ERROR',
      );
    }
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renew refresh token' })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: RefreshTokenDTO,
  })
  refreshTokens(@Body() RefreshTokenDTO: RefreshTokenDTO) {
    return this.authService.refreshTokens(RefreshTokenDTO);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout from browser' })
  @ApiOkResponse({
    status: 200,
    description: 'Logout Success',
    type: LogoutDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  logout(@Body() LogoutDTO: LogoutDTO): Promise<ResponseDTO> {
    return this.authService.logout(LogoutDTO);
  }

  @Post('register')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Registers a user to the system.',
    type: UserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async register(@Body() userDto: RegisterDTO): Promise<ResponseDTO> {
    return await this.authService.registration(userDto);
  }
}
