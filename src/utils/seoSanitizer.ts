/**
 * SEO & Unicode Sanitization Utilities
 * Prevents Google Search Console "Truncated Unicode character" / unparsable structured data errors
 * by guaranteeing clean markdown stripping, surrogate-pair-safe Unicode truncation, and JSON-LD safety.
 */

export function cleanPlainText(text: string): string {
  if (!text) return '';
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove markdown links & images: ![alt](url) -> alt, [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove markdown headers (#, ##, ###)
    .replace(/^#+\s+/gm, '')
    .replace(/\n#+\s+/g, ' ')
    // Remove bold, italic, strikethrough (**, *, __, _, ~~)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    // Remove blockquotes and code blocks
    .replace(/^\s*>\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Convert newlines, tabs, and multiple whitespace to single space
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    // Strip orphaned high and low UTF-16 surrogates
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    .trim();
}

export function truncateCleanPlainText(text: string, maxLen: number = 155): string {
  const clean = cleanPlainText(text);
  if (!clean) return '';

  // Use Array.from to count actual Unicode code points / graphemes, NEVER splitting a 4-byte emoji
  const codePoints = Array.from(clean);
  if (codePoints.length <= maxLen) return clean;

  const targetLen = Math.max(10, maxLen - 3);
  const slice = codePoints.slice(0, targetLen).join('').trim();

  // Try breaking at word boundary if reasonable
  const lastSpace = slice.lastIndexOf(' ');
  const result = (lastSpace > Math.floor(maxLen * 0.4)) ? slice.slice(0, lastSpace).trim() : slice;

  // Final pass: ensure no lone surrogate remains
  return result.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '').trim() + '...';
}

export function sanitizeUnicodeForJsonLd(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Strip orphaned high and low surrogates
    return obj.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeUnicodeForJsonLd);
  }
  if (typeof obj === 'object') {
    const clean: any = {};
    for (const [key, val] of Object.entries(obj)) {
      clean[key] = sanitizeUnicodeForJsonLd(val);
    }
    return clean;
  }
  return obj;
}
