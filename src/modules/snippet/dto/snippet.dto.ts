import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

import { BaseDTO } from 'src/common/dtos/base.dto';

export class SnippetDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty({
    example:
      'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.',
    description: 'generally a paragraph or multiple paragraphs',
    required: true,
  })
  @IsString()
  snippet: string;
}

export class UpdateSnippetDTO extends PartialType(SnippetDTO) {}
