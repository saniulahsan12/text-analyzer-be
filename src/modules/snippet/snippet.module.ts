import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { UtilService } from 'src/common/services/util.service';

import { Snippet } from './entity/snippet.entity';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';
import { TextAnalyzerService } from './text-analyzer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Snippet]), CacheModule.register()],
  controllers: [SnippetController],
  providers: [SnippetService, UtilService, TextAnalyzerService],
  exports: [SnippetService],
})
export class SnippetModule {}
