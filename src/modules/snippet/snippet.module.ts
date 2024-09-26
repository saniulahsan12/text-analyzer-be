import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilService } from 'src/common/services/util.service';

import { Snippet } from './entity/snippet.entity';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Snippet])],
  controllers: [SnippetController],
  providers: [SnippetService, UtilService],
  exports: [SnippetService],
})
export class SnippetModule {}
