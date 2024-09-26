import { Injectable } from '@nestjs/common';
@Injectable()
export class TextAnalyzerService {
  countWords(snippet: string): number {
    return snippet.trim().split(/\s+/).length;
  }

  countCharacters(snippet: string): number {
    return snippet.replace(/\s+/g, '').length;
  }

  countSentences(snippet: string): number {
    return snippet.split(/[.!?]+/).filter(Boolean).length;
  }

  countParagraphs(snippet: string): number {
    return snippet.trim().split(/\n+/).filter(Boolean).length;
  }

  longestWordsInParagraphs(snippet: string): string[][] {
    return snippet.split(/\n+/).map((paragraph) => {
      const words = paragraph
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);
      const maxLength = Math.max(...words.map((word) => word.length));
      return words.filter((word) => word.length === maxLength);
    });
  }
}
