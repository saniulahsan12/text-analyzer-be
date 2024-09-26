import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SnippetService } from './snippet.service';
import { Snippet } from './entity/snippet.entity';
import { SnippetDTO, UpdateSnippetDTO } from './dto/snippet.dto';
import { User } from 'src/common/decorators/user.decorator';
import TokenVerificationPayload from '../auth/interface/token.verification.interface';
import { ResponseDTO } from 'src/common/dtos/response.dto';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  get(@Param('id') id: number): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  post(
    @User() authUser: TokenVerificationPayload,
    @Body() snippetDto: SnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.create(authUser, snippetDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(
    @User() authUser: TokenVerificationPayload,
    @Param('id') id: number,
    @Body() updateSnippetDto: UpdateSnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.update(authUser, id, updateSnippetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  delete(
    @User() authUser: TokenVerificationPayload,
    @Param('id') id: number,
  ): Promise<ResponseDTO<DeleteResult>> {
    return this.snippetService.delete(authUser, id);
  }
}
