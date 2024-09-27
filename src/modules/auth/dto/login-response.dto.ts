import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty({ example: true, description: 'loggedIn' })
  loggedIn: boolean;

  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;
}
