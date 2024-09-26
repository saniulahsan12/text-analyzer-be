import { Test, TestingModule } from '@nestjs/testing';
import { TextAnalyzerService } from './text-analyzer.service';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextAnalyzerService],
    }).compile();

    service = module.get<TextAnalyzerService>(TextAnalyzerService);
  });

  test('counts the number of words in the text', () => {
    const text = 'Hello world, this is a test.';
    expect(service.countWords(text)).toBe(6);
  });

  test('counts the number of characters excluding spaces', () => {
    const text = 'Hello world!';
    expect(service.countCharacters(text)).toBe(11);
  });

  test('counts the number of sentences in the text', () => {
    const text = "Hello world. This is a test! Isn't it great?";
    expect(service.countSentences(text)).toBe(3);
  });

  test('counts the number of paragraphs in the text', () => {
    const text = 'First paragraph.\n\nSecond paragraph.';
    expect(service.countParagraphs(text)).toBe(2);
  });

  test('returns the longest words in each paragraph', () => {
    const text = 'Hello world.\nThis is a paragraph with longer words.';
    expect(service.longestWordsInParagraphs(text)).toEqual([
      ['hello', 'world'],
      ['paragraph'],
    ]);
  });
});
