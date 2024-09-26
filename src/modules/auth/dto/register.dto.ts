import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

import { BaseDTO } from 'src/common/dtos/base.dto';

/**
 * An Register DTO object.
 */
export class RegisterDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: true,
  })
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: true,
  })
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @ApiProperty({
    uniqueItems: true,
    example: 'test@test.com',
    description: 'User email',
  })
  @IsString()
  @MinLength(4)
  @IsEmail()
  email: string;

  @IsOptional()
  @ApiProperty({
    example: 'Password12#',
    description: 'User password',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'weak password provided',
  })
  password?: string;
}
