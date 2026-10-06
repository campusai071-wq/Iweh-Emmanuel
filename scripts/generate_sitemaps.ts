// scripts/generate_sitemaps.ts
import fs from 'fs';
import path from 'path';
import { db } from '../src/services/firebaseConfig';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { MOCK_NEWS } from '../src/constants';
import { UNIVERSITIES_DB } from '../src/data/universityData';

const BASE_DOMAIN = 'https://campusai.com.ng';
const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

export function parseDateToIso(val: any): { isoDate: string; dateOnly: string; timestampMs: number } {
  if (!val) {
    const d = new Date();
    return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
  }
  if (typeof val.toDate === 'function') {
    const d = val.toDate();
    if (!isNaN(d.getTime())) {
      return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
    }
  }
  if (typeof val.toMillis === 'function') {
    const d = new Date(val.toMillis());
    if (!isNaN(d.getTime())) {
      return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
    }
  }
  if (typeof val === 'object') {
    const sec = val.seconds ?? val._seconds;
    if (typeof sec === 'number') {
      const d = new Date(sec * 1000);
      if (!isNaN(d.getTime())) {
        return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
      }
    }
  }
  if (typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
    }
  }
  if (typeof val === 'string' && val.trim()) {
    const d = new Date(val.trim());
    if (!isNaN(d.getTime())) {
      return { isoDate: d.toISOString(), dateOnly: d.toISOString().split('T')[0], timestampMs: d.getTime() };
    }
  }
  const fallback = new Date();
  return { isoDate: fallback.toISOString(), dateOnly: fallback.toISOString().split('T')[0], timestampMs: fallback.getTime() };
}

export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/gu, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const STATIC_INDEXABLE_PAGES: Array<[string, string, string]> = [
  ['/', '1.0', 'daily'],
  ['/calculator', '0.95', 'daily'],
  ['/calculator-simple', '0.85', 'weekly'],
  ['/cbt-simulator', '0.95', 'daily'],
  ['/cbt', '0.95', 'daily'],
  ['/cbt-history', '0.85', 'weekly'],
  ['/cbt-locator', '0.95', 'daily'],
  ['/study-hub', '0.95', 'daily'],
  ['/study', '0.95', 'daily'],
  ['/target', '0.95', 'daily'],
  ['/jamb-target', '0.95', 'daily'],
  ['/ai-coach', '0.95', 'daily'],
  ['/admissions', '0.95', 'daily'],
  ['/syllabus', '0.95', 'daily'],
  ['/admission-checklist', '0.95', 'daily'],
  ['/checklist', '0.95', 'daily'],
  ['/universities', '0.95', 'daily'],
  ['/directory', '0.90', 'weekly'],
  ['/postutme', '0.95', 'daily'],
  ['/post-utme', '0.95', 'daily'],
  ['/result-slip', '0.95', 'daily'],
  ['/result-slip-guide', '0.95', 'daily'],
  ['/pdf-store', '0.90', 'weekly'],
  ['/discussions', '0.90', 'daily'],
  ['/discussion-hub', '0.90', 'daily'],
  ['/cgpa-calculator', '0.90', 'weekly'],
  ['/cgpa', '0.90', 'weekly'],
  ['/jamb-caps', '0.98', 'daily'],
  ['/caps', '0.95', 'daily'],
  ['/caps-portal', '0.95', 'daily'],
  ['/news', '0.95', 'daily'],
  ['/about', '0.70', 'weekly'],
  ['/premium', '0.70', 'weekly'],
  ['/contact', '0.70', 'monthly'],
  ['/contact-us', '0.70', 'monthly'],
  ['/support', '0.70', 'monthly'],
  ['/status', '0.60', 'daily'],
  ['/terms', '0.40', 'monthly'],
  ['/terms-of-service', '0.40', 'monthly'],
  ['/privacy', '0.40', 'monthly'],
  ['/privacy-policy', '0.40', 'monthly'],
  ['/calculator-privacy', '0.40', 'monthly'],
  ['/calculation-privacy', '0.40', 'monthly'],
  ['/cookies', '0.40', 'monthly'],
  ['/cookie-policy', '0.40', 'monthly']
];

export async function fetchAllNewsArticles(): Promise<any[]> {
  const articlesMap = new Map<string, any>();

  // 1. Fetch from Firestore
  try {
    const q = query(collection(db, 'news'), limit(5000));
    const snap = await getDocs(q);
    snap.forEach(d => {
      const data = d.data();
      const slug = (data.slug || d.id || '').toString().trim();
      const title = (data.title || data.headline || '').toString().trim();
      if (!slug || !title) return;
      articlesMap.set(slug, { id: d.id, slug, title, ...data });
    });
    console.log(`[Sitemaps] Loaded ${articlesMap.size} articles from Firestore.`);
  } catch (err) {
    console.warn('[Sitemaps] Warning fetching Firestore articles:', err);
  }

  // 2. Include seed MOCK_NEWS
  if (Array.isArray(MOCK_NEWS)) {
    MOCK_NEWS.forEach(m => {
      const slug = (m.slug || m.id || '').toString().trim();
      const title = (m.title || '').toString().trim();
      if (!slug || !title) return;
      if (!articlesMap.has(slug)) {
        articlesMap.set(slug, { ...m, slug, title });
      }
    });
  }

  const articles: any[] = [];
  for (const item of articlesMap.values()) {
    const dateVal = item.updatedAt || item.createdAt || item.publishDate || item.date;
    const dateInfo = parseDateToIso(dateVal);
    articles.push({
      ...item,
      dateInfo
    });
  }

  // Sort by freshest timestamp
  articles.sort((a, b) => b.dateInfo.timestampMs - a.dateInfo.timestampMs);
  return articles;
}

export function buildGeneralSitemapXml(articles: any[]): string {
  const todayStr = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const addedUrls = new Set<string>();

  const addUrl = (pathStr: string, lastmod: string, changefreq: string, priority: string) => {
    const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
    const fullUrl = `${BASE_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;
    if (!addedUrls.has(fullUrl)) {
      addedUrls.add(fullUrl);
      xml += `\n  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }
  };

  // 1. Static Core Public Pages
  STATIC_INDEXABLE_PAGES.forEach(([p, priority, freq]) => {
    addUrl(p, todayStr, freq, priority);
  });

  // 2. Institutional Directory Pages
  const knownSlugs = new Set<string>([
    'unilag', 'oau', 'ui', 'lasu', 'uniben', 'unilorin', 'unn', 'futa', 'abu',
    'fuoye', 'delsu', 'kwasu', 'aaua', 'yabatech', 'oou'
  ]);

  if (UNIVERSITIES_DB && typeof UNIVERSITIES_DB === 'object') {
    Object.keys(UNIVERSITIES_DB).forEach(k => {
      const slug = k.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (slug) knownSlugs.add(slug);
    });
  }

  knownSlugs.forEach(slug => {
    addUrl(`/universities/${slug}`, todayStr, 'weekly', '0.85');
  });

  // 3. Institutional Aggregate Calculator Pages
  knownSlugs.forEach(slug => {
    addUrl(`/${slug}-aggregate-calculator`, todayStr, 'weekly', '0.85');
  });

  // 4. All Valid Published News Articles
  articles.forEach(a => {
    const slug = a.slug;
    if (!slug) return;
    const lastmod = a.dateInfo.dateOnly || todayStr;
    addUrl(`/news/${encodeURI(slug)}`, lastmod, 'weekly', '0.80');
  });

  xml += `\n</urlset>\n`;
  return xml;
}

export function buildNewsSitemapXml(articles: any[], referenceTimeMs: number = Date.now()): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  const addedUrls = new Set<string>();

  // Filter: Articles published or updated in the last 48 hours (Google News requirement)
  let eligibleArticles = articles.filter(a => {
    const age = referenceTimeMs - a.dateInfo.timestampMs;
    // Within last 48 hours and not in the future by > 24 hours
    return age >= -86400000 && age <= TWO_DAYS_MS;
  });

  // If fewer than 10 articles in the last 48 hours, fall back to the freshest 15 articles to ensure feed vitality
  if (eligibleArticles.length < 10 && articles.length > 0) {
    eligibleArticles = articles.slice(0, 15);
  }

  eligibleArticles.forEach(a => {
    const slug = a.slug;
    if (!slug) return;
    const fullUrl = `${BASE_DOMAIN}/news/${encodeURI(slug)}`;
    if (addedUrls.has(fullUrl)) return;
    addedUrls.add(fullUrl);

    const publicationDate = a.dateInfo.dateOnly;
    const cleanTitle = escapeXml(a.title || 'CampusAI News');

    xml += `\n  <url>\n    <loc>${fullUrl}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>CampusAI</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${publicationDate}</news:publication_date>\n      <news:title>${cleanTitle}</news:title>\n    </news:news>\n  </url>`;
  });

  xml += `\n</urlset>\n`;
  return xml;
}

export async function generateSitemapsFiles(): Promise<{ generalCount: number; newsCount: number }> {
  console.log('[Sitemaps] Generating sitemaps...');
  const articles = await fetchAllNewsArticles();

  const generalXml = buildGeneralSitemapXml(articles);
  const newsXml = buildNewsSitemapXml(articles);

  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generalXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'news-sitemap.xml'), newsXml, 'utf-8');
  console.log(`[Sitemaps] Written to public/sitemap.xml and public/news-sitemap.xml`);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), generalXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'news-sitemap.xml'), newsXml, 'utf-8');
    console.log(`[Sitemaps] Written to dist/sitemap.xml and dist/news-sitemap.xml`);
  }

  const generalMatches = (generalXml.match(/<url>/g) || []).length;
  const newsMatches = (newsXml.match(/<url>/g) || []).length;

  console.log(`[Sitemaps] Done. General sitemap URLs: ${generalMatches}, Google News sitemap URLs: ${newsMatches}`);
  return { generalCount: generalMatches, newsCount: newsMatches };
}

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('generate_sitemaps.ts')) {
  generateSitemapsFiles()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[Sitemaps Error]:', err);
      process.exit(1);
    });
}
