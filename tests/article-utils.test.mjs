import { expect, test } from 'bun:test';

import { countArticleWords, estimateReadingMinutes } from '../src/lib/article-utils.ts';

test('countArticleWords counts CJK characters and Latin words accurately', () => {
  expect(countArticleWords('')).toBe(0);
  expect(countArticleWords('<p>   </p>')).toBe(0);
  expect(countArticleWords('<p>你好世界</p>')).toBe(4);
  expect(countArticleWords('<p>Hello world from Cloudflare Workers</p>')).toBe(5);
  expect(countArticleWords('<h2>标题</h2><p>混合 English 文本 123</p>')).toBe(8);
});

test('estimateReadingMinutes returns at least 1 minute and scales by 350 words/min', () => {
  expect(estimateReadingMinutes(0)).toBe(1);
  expect(estimateReadingMinutes(200)).toBe(1);
  expect(estimateReadingMinutes(351)).toBe(2);
  expect(estimateReadingMinutes(1050)).toBe(3);
});
