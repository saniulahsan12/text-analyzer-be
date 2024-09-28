import { TextAnalyzerService } from './text-analyzer.service';
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
import { UtilService } from 'src/common/services/util.service';

@ApiTags('Snippets')
@Controller('snippets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SnippetController {
  constructor(
    private readonly snippetService: SnippetService,
    private readonly textAnalyzerService: TextAnalyzerService,
    private readonly utilService: UtilService,
  ) {}

  @Get()
  getAll(
    @User() authUser: TokenVerificationPayload,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.findAll(authUser);
  }

  @Get(':id')
  get(
    @User() authUser: TokenVerificationPayload,
    @Param('id') id: number,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.findOneById(authUser, id);
  }

  @Post()
  post(
    @User() authUser: TokenVerificationPayload,
    @Body() snippetDto: SnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.create(authUser, snippetDto);
  }

  @Put(':id')
  update(
    @User() authUser: TokenVerificationPayload,
    @Param('id') id: number,
    @Body() updateSnippetDto: UpdateSnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    return this.snippetService.update(authUser, id, updateSnippetDto);
  }

  @Delete(':id')
  delete(
    @User() authUser: TokenVerificationPayload,
    @Param('id') id: number,
  ): Promise<ResponseDTO<DeleteResult>> {
    return this.snippetService.delete(authUser, id);
  }

  @Post('word-count')
  findWordCounts(@Body() snippetDto: SnippetDTO): ResponseDTO<number> {
    return this.utilService.getSuccessResponse(
      this.textAnalyzerService.countWords(snippetDto.snippet),
      'RESPONSE_WORD_COUNT',
    );
  }

  @Post('character-count')
  findCharacterCounts(@Body() snippetDto: SnippetDTO): ResponseDTO<number> {
    return this.utilService.getSuccessResponse(
      this.textAnalyzerService.countCharacters(snippetDto.snippet),
      'RESPONSE_CHARACTER_COUNT',
    );
  }

  @Post('sentence-count')
  findSentenceCounts(@Body() snippetDto: SnippetDTO): ResponseDTO<number> {
    return this.utilService.getSuccessResponse(
      this.textAnalyzerService.countSentences(snippetDto.snippet),
      'RESPONSE_SENTENCE_COUNT',
    );
  }

  @Post('pragraph-count')
  findParagraphCounts(@Body() snippetDto: SnippetDTO): ResponseDTO<number> {
    return this.utilService.getSuccessResponse(
      this.textAnalyzerService.countParagraphs(snippetDto.snippet),
      'RESPONSE_PARAGRAPH_COUNT',
    );
  }

  @Post('longest-words')
  findLongestWords(@Body() snippetDto: SnippetDTO): ResponseDTO<string[][]> {
    return this.utilService.getSuccessResponse(
      this.textAnalyzerService.longestWordsInParagraphs(snippetDto.snippet),
      'RESPONSE_LONGEST_WORDS',
    );
  }
}
