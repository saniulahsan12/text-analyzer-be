import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UtilService } from 'src/common/services/util.service';
import TokenVerificationPayload from '../auth/interface/token.verification.interface';
import { Snippet } from './entity/snippet.entity';
import { SnippetDTO, UpdateSnippetDTO } from './dto/snippet.dto';
import { ResponseDTO } from 'src/common/dtos/response.dto';

@Injectable()
export class SnippetService {
  constructor(
    @InjectRepository(Snippet)
    private snippetRepository: Repository<Snippet>,
    private utilService: UtilService,
  ) {}

  async findOneById(id: number): Promise<ResponseDTO<Snippet>> {
    try {
      const snippet = await this.snippetRepository.findOne({ where: { id } });
      return this.utilService.getSuccessResponse(snippet, 'RESPONSE_SNIPPET');
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(null, 'RESPONSE_SNIPPET_READ_ERROR'),
        error?.status ?? HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async delete(
    authUser: TokenVerificationPayload,
    id: number,
  ): Promise<ResponseDTO<DeleteResult>> {
    try {
      console.log({
        id,
        created_by: authUser.id,
      });
      const snippet = await this.snippetRepository.delete({
        id,
        created_by: authUser.id,
      });
      return this.utilService.getSuccessResponse(
        snippet,
        'RESPONSE_SNIPPET_DELETED',
      );
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(
          null,
          'RESPONSE_SNIPPET_DELETE_ERROR',
        ),
        error?.status ?? HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async create(
    authUser: TokenVerificationPayload,
    snippetDto: SnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    try {
      const snippet = await this.snippetRepository.save({
        ...snippetDto,
        user_id: authUser.id,
        created_by: authUser.id,
      });
      return this.utilService.getSuccessResponse(
        snippet,
        'RESPONSE_SNIPPET_CREATED',
      );
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(
          null,
          'RESPONSE_SNIPPET_CREATE_ERROR',
        ),
        error?.status ?? HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async update(
    authUser: TokenVerificationPayload,
    id: number,
    updateSnippetDto: UpdateSnippetDTO,
  ): Promise<ResponseDTO<Snippet>> {
    try {
      await this.snippetRepository.update(
        { id, created_by: authUser.id },
        {
          ...updateSnippetDto,
          updated_by: authUser.id,
          updated_at: new Date(),
        },
      );
      const snippet = await this.snippetRepository.findOne({
        where: {
          id,
          created_by: authUser.id,
        },
      });
      return this.utilService.getSuccessResponse(
        snippet,
        'RESPONSE_SNIPPET_CREATED',
      );
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(
          null,
          'RESPONSE_SNIPPET_CREATE_ERROR',
        ),
        error?.status ?? HttpStatus.NOT_MODIFIED,
      );
    }
  }
}
