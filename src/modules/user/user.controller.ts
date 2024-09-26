import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { User } from 'src/common/decorators/user.decorator';

import { UserService } from './user.service';
import TokenVerificationPayload from '../auth/interface/token.verification.interface';
import { UpdateUserDTO } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(
    @User() user: TokenVerificationPayload,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(user, updateUserDTO);
  }
}
