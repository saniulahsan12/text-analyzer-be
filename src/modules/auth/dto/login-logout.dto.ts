import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Password12#',
  })
  password: string;
}

export class LogoutDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;
}
