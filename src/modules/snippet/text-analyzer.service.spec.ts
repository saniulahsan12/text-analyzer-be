import { Test, TestingModule } from '@nestjs/testing';
import { TextAnalyzerService } from './text-analyzer.service';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;
  const text = 'Hello world.\nThis is a paragraph with longer words.';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextAnalyzerService],
    }).compile();

    service = module.get<TextAnalyzerService>(TextAnalyzerService);
  });

  test('counts the number of words in the text', () => {
    expect(service.countWords(text)).toBe(9);
  });

  test('counts the number of characters excluding spaces', () => {
    expect(service.countCharacters(text)).toBe(43);
  });

  test('counts the number of sentences in the text', () => {
    expect(service.countSentences(text)).toBe(2);
  });

  test('counts the number of paragraphs in the text', () => {
    expect(service.countParagraphs(text)).toBe(2);
  });

  test('returns the longest words in each paragraph', () => {
    expect(service.longestWordsInParagraphs(text)).toEqual([
      ['hello', 'world'],
      ['paragraph'],
    ]);
  });
});
