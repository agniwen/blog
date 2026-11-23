/**
 * 统计文章纯文本或 HTML 的字数（按中文字符数 + 英文/数字词数计算）。
 */
export function countArticleWords(textOrHtml: string): number {
  const plain = textOrHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  if (!plain) return 0;

  const cjkMatches = plain.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  const withoutCjk = plain.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, ' ');
  const latinMatches = withoutCjk.match(/[a-zA-Z0-9]+(?:['’-][a-zA-Z0-9]+)*/g);
  const latinCount = latinMatches ? latinMatches.length : 0;

  return cjkCount + latinCount;
}

/**
 * 根据字数估算阅读分钟数（按每分钟 350 字估算，最少 1 分钟）。
 */
export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 350));
}
