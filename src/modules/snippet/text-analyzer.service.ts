import { Injectable } from '@nestjs/common';
import { SnippetDTO } from './dto/snippet.dto';

@Injectable()
export class TextAnalyzerService {
  countWords(snippetDto: SnippetDTO): number {
    return snippetDto.snippet.trim().split(/\s+/).length;
  }

  countCharacters(snippetDto: SnippetDTO): number {
    return snippetDto.snippet.replace(/\s+/g, '').length;
  }

  countSentences(snippetDto: SnippetDTO): number {
    return snippetDto.snippet.split(/[.!?]+/).filter(Boolean).length;
  }

  countParagraphs(snippetDto: SnippetDTO): number {
    return snippetDto.snippet.trim().split(/\n+/).filter(Boolean).length;
  }

  longestWordsInParagraphs(snippetDto: SnippetDTO): string[][] {
    return snippetDto.snippet.split(/\n+/).map((paragraph) => {
      const words = paragraph
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);
      const maxLength = Math.max(...words.map((word) => word.length));
      return words.filter((word) => word.length === maxLength);
    });
  }
}
