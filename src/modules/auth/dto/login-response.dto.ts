import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: true, description: 'loggedIn' })
  loggedIn: boolean;

  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;
}
