import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * A DTO representing a login user.
 */
export class UserLoginDTO {
  @ApiProperty({ example: 'admin', description: 'Username/Email' })
  @IsString()
  readonly email: string;

  @ApiProperty({ example: 'admin', description: 'User password' })
  @IsString()
  readonly password: string;
}
