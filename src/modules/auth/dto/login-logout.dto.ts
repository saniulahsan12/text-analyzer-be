import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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

export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;
}
