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
import { LoginDto, LogoutDto } from './dto/login-logout.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResponseDTO } from 'src/common/dtos/response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
  @ApiOkResponse({ type: LoginResponseDto, description: 'Login Successfully' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<ResponseDTO> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  getProfile(@User() user: TokenVerificationPayload) {
    try {
      return this.utilService.getSuccessResponse(
        user,
        'AUTH_RESPONSE_SUCCESS',
        'AUTH_RESPONSE_SUCCESS',
      );
    } catch (err) {
      return this.utilService.getErrorResponse(
        err?.message,
        'AUTH_RESPONSE_ERROR',
        'AUTH_RESPONSE_ERROR',
      );
    }
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renew refresh token' })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: RefreshTokenDto,
  })
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout from browser' })
  @ApiOkResponse({
    status: 200,
    description: 'Logout Success',
    type: LogoutDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  logout(@Body() logoutDto: LogoutDto): Promise<ResponseDTO> {
    return this.authService.logout(logoutDto);
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
