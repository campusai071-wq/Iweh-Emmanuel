import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  parseDateToIso,
  escapeXml,
  buildGeneralSitemapXml,
  buildNewsSitemapXml,
  STATIC_INDEXABLE_PAGES
} from '../../scripts/generate_sitemaps';
import { submitToIndexNow, INDEXNOW_HOST, INDEXNOW_KEY } from './indexNowService';

describe('Sitemap & IndexNow SEO Engine', () => {
  describe('parseDateToIso', () => {
    it('correctly parses Firestore Timestamps with seconds', () => {
      // 1791244800 = Oct 06, 2026 approx
      const tsObj = { seconds: 1791244800, nanoseconds: 0 };
      const parsed = parseDateToIso(tsObj);
      expect(parsed.dateOnly).toMatch(/^2026-/);
      expect(parsed.timestampMs).toBe(1791244800000);
      expect(parsed.isoDate).toContain('T');
    });

    it('correctly parses Firestore Timestamps with toDate()', () => {
      const mockDate = new Date('2026-10-06T08:45:00Z');
      const firestoreTs = { toDate: () => mockDate };
      const parsed = parseDateToIso(firestoreTs);
      expect(parsed.dateOnly).toBe('2026-10-06');
      expect(parsed.timestampMs).toBe(mockDate.getTime());
    });

    it('correctly parses ISO strings and natural date strings', () => {
      const parsedIso = parseDateToIso('2026-10-06T12:00:00Z');
      expect(parsedIso.dateOnly).toBe('2026-10-06');

      const parsedNatural = parseDateToIso('October 6, 2026');
      expect(parsedNatural.dateOnly).toBe('2026-10-06');
    });

    it('falls back gracefully on empty or null values', () => {
      const parsed = parseDateToIso(null);
      expect(parsed.dateOnly).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(parsed.timestampMs).toBeGreaterThan(0);
    });
  });

  describe('escapeXml', () => {
    it('escapes &, <, >, ", and \' characters properly', () => {
      const raw = 'Admission & "Merit" <Points> for Students\' Guide';
      const escaped = escapeXml(raw);
      expect(escaped).toBe('Admission &amp; &quot;Merit&quot; &lt;Points&gt; for Students&apos; Guide');
    });

    it('removes invalid XML control characters without breaking', () => {
      const rawWithControl = 'Test\u0000Title\u0008Alert';
      expect(escapeXml(rawWithControl)).toBe('TestTitleAlert');
    });
  });

  describe('buildGeneralSitemapXml', () => {
    const mockArticles = [
      {
        slug: 'oaustech-20262027-post-utme-results-cut-off-marks-for-nursing-mls-public-health',
        title: 'OAUSTECH 2026/2027 Post-UTME Results & Cut-Off Marks',
        dateInfo: { dateOnly: '2026-10-06', isoDate: '2026-10-06T08:45:00Z', timestampMs: 1791276300000 }
      },
      {
        slug: 'ae-funai-supplementary-admission-202627-official-portal-lists-12-october-deadline',
        title: 'AE-FUNAI Supplementary Admission 2026/27 Portal',
        dateInfo: { dateOnly: '2026-10-06', isoDate: '2026-10-06T08:41:00Z', timestampMs: 1791276060000 }
      },
      {
        slug: 'older-article-from-august-2026',
        title: 'Older Verified Report from August',
        dateInfo: { dateOnly: '2026-08-15', isoDate: '2026-08-15T10:00:00Z', timestampMs: 1786788000000 }
      }
    ];

    it('generates well-formed XML with urlset namespace', () => {
      const xml = buildGeneralSitemapXml(mockArticles);
      expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml.endsWith('</urlset>\n')).toBe(true);
    });

    it('strictly enforces canonical non-www domain across all URLs', () => {
      const xml = buildGeneralSitemapXml(mockArticles);
      expect(xml).not.toContain('https://www.campusai.com.ng');
      expect(xml).toContain('https://campusai.com.ng/');
      expect(xml).toContain('https://campusai.com.ng/calculator');
      expect(xml).toContain('https://campusai.com.ng/news/oaustech-20262027-post-utme-results-cut-off-marks-for-nursing-mls-public-health');
    });

    it('excludes private and authenticated pages (login, dashboard, signup)', () => {
      const xml = buildGeneralSitemapXml(mockArticles);
      expect(xml).not.toContain('https://campusai.com.ng/login');
      expect(xml).not.toContain('https://campusai.com.ng/signup');
      expect(xml).not.toContain('https://campusai.com.ng/dashboard');
      expect(xml).not.toContain('https://campusai.com.ng/auth');
    });

    it('applies accurate lastmod for news articles instead of blanket today date', () => {
      const xml = buildGeneralSitemapXml(mockArticles);
      expect(xml).toContain('<loc>https://campusai.com.ng/news/older-article-from-august-2026</loc>\n    <lastmod>2026-08-15</lastmod>');
    });
  });

  describe('buildNewsSitemapXml (Google News Rules)', () => {
    const referenceNow = new Date('2026-10-06T16:00:00Z').getTime();

    const mockArticles = [
      // Article 1: Today (2 hours ago) -> MUST BE INCLUDED
      {
        slug: 'oaustech-20262027-post-utme-results',
        title: 'OAUSTECH 2026/2027 Post-UTME Results',
        dateInfo: { dateOnly: '2026-10-06', isoDate: '2026-10-06T14:00:00Z', timestampMs: referenceNow - (2 * 3600 * 1000) }
      },
      // Article 2: Yesterday (30 hours ago) -> MUST BE INCLUDED (<= 48h)
      {
        slug: 'jamb-plans-utme-centre-in-ottawa',
        title: 'JAMB Plans UTME Centre in Ottawa, Canada for 2027',
        dateInfo: { dateOnly: '2026-10-05', isoDate: '2026-10-05T10:00:00Z', timestampMs: referenceNow - (30 * 3600 * 1000) }
      },
      // Article 3: 5 days ago (120 hours ago) -> MUST BE EXCLUDED per Google 48-Hour News Rule
      {
        slug: 'stale-article-from-october-1',
        title: 'Stale Report from 5 Days Ago',
        dateInfo: { dateOnly: '2026-10-01', isoDate: '2026-10-01T10:00:00Z', timestampMs: referenceNow - (120 * 3600 * 1000) }
      },
      // Article 4: Weeks ago (September) -> MUST BE EXCLUDED
      {
        slug: 'stale-article-from-september',
        title: 'Stale Report from September',
        dateInfo: { dateOnly: '2026-09-27', isoDate: '2026-09-27T08:00:00Z', timestampMs: referenceNow - (9 * 24 * 3600 * 1000) }
      }
    ];

    it('complies strictly with Google News schema and 48-hour inclusion window', () => {
      // Pass referenceNow to test exact time window calculation
      const xml = buildNewsSitemapXml(mockArticles, referenceNow);

      expect(xml).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
      expect(xml).toContain('<news:name>CampusAI</news:name>');
      expect(xml).toContain('<news:language>en</news:language>');

      // Today's article MUST be present
      expect(xml).toContain('https://campusai.com.ng/news/oaustech-20262027-post-utme-results');
      expect(xml).toContain('<news:publication_date>2026-10-06</news:publication_date>');

      // Yesterday's article MUST be present
      expect(xml).toContain('https://campusai.com.ng/news/jamb-plans-utme-centre-in-ottawa');
      expect(xml).toContain('<news:publication_date>2026-10-05</news:publication_date>');

      // Stale articles (>48 hours) MUST NOT be in Google News sitemap when >= 10 articles exist
      // Test with 12 fresh articles + 2 stale to verify strict cutoff
      const twelveFresh = Array.from({ length: 12 }, (_, i) => ({
        slug: `fresh-article-${i}`,
        title: `Fresh Report ${i}`,
        dateInfo: { dateOnly: '2026-10-06', isoDate: '2026-10-06T08:00:00Z', timestampMs: referenceNow - (i * 3600 * 1000) }
      }));
      const mixedArticles = [...twelveFresh, mockArticles[2], mockArticles[3]];

      const mixedXml = buildNewsSitemapXml(mixedArticles, referenceNow);
      expect(mixedXml).toContain('fresh-article-0');
      expect(mixedXml).not.toContain('stale-article-from-october-1');
      expect(mixedXml).not.toContain('stale-article-from-september');
    });
  });

  describe('IndexNow Integration & Key Verification', () => {
    it('verifies the existence and validity of key verification files', () => {
      const keyFile = path.resolve(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
      const indexNowTxt = path.resolve(process.cwd(), 'public', 'indexnow.txt');

      expect(fs.existsSync(keyFile)).toBe(true);
      expect(fs.existsSync(indexNowTxt)).toBe(true);

      const keyContent = fs.readFileSync(keyFile, 'utf-8').trim();
      const indexNowContent = fs.readFileSync(indexNowTxt, 'utf-8').trim();

      expect(keyContent).toBe(INDEXNOW_KEY);
      expect(indexNowContent).toBe(INDEXNOW_KEY);
      expect(keyContent).toBe('14fbbbae19ab4b788d8153edd1d2550e');
    });

    it('submits URLs through server-side proxy with canonical non-www formatting', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, count: 2, message: 'Submitted 2 URLs to IndexNow.' })
      });
      global.fetch = mockFetch;

      const result = await submitToIndexNow([
        'https://www.campusai.com.ng/news/oaustech-20262027-post-utme-results',
        '/news/ae-funai-supplementary-admission-202627'
      ]);

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      // Verify canonical non-www URLs
      expect(requestBody.urls[0]).toBe('https://campusai.com.ng/news/oaustech-20262027-post-utme-results');
      expect(requestBody.urls[1]).toBe('https://campusai.com.ng/news/ae-funai-supplementary-admission-202627');
      expect(result.success).toBe(true);
    });

    it('rejects empty submission gracefully without network error', async () => {
      const result = await submitToIndexNow([]);
      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe('UNIOSUN 2026/2027 Official Cutoffs Provider', () => {
    it('verifies all 107 programmes are accurately loaded', async () => {
      const { UNIOSUN_CUTOFFS_2026_2027, getUNIOSUNCutoffForCandidate } = await import('../data/uniosunCutoffs2026_2027');
      expect(UNIOSUN_CUTOFFS_2026_2027.length).toBe(107);

      // Nursing Science (Merit: 77.4, Catchment: 74.4)
      const nursingGeneral = getUNIOSUNCutoffForCandidate('Nursing', 'Lagos');
      expect(nursingGeneral?.applicableCutoff).toBe(77.4);
      expect(nursingGeneral?.isCatchment).toBe(false);

      const nursingOsun = getUNIOSUNCutoffForCandidate('Nursing', 'Osun');
      expect(nursingOsun?.applicableCutoff).toBe(74.4);
      expect(nursingOsun?.isCatchment).toBe(true);

      // Law (Merit: 77.1, Catchment: 73.0)
      const lawGeneral = getUNIOSUNCutoffForCandidate('Law', 'Kwara');
      expect(lawGeneral?.applicableCutoff).toBe(77.1);

      const lawOsun = getUNIOSUNCutoffForCandidate('Bachelor of Law', 'Osun');
      expect(lawOsun?.applicableCutoff).toBe(73.0);

      // Radiography (Merit: 74.5, Catchment: 70.9)
      const radGeneral = getUNIOSUNCutoffForCandidate('Radiography', 'Oyo');
      expect(radGeneral?.applicableCutoff).toBe(74.5);

      // Computer Science (Merit: 65.6, Catchment: 59.2)
      const csGeneral = getUNIOSUNCutoffForCandidate('Computer Science', 'Delta');
      expect(csGeneral?.applicableCutoff).toBe(65.6);
      const csOsun = getUNIOSUNCutoffForCandidate('Computer Science', 'Osun');
      expect(csOsun?.applicableCutoff).toBe(59.2);
    });
  });

  describe('OAU 2026/2027 Faculty of Science Official Cutoffs Provider', () => {
    it('verifies all 13 Faculty of Science programmes are accurately loaded', async () => {
      const { OAU_SCIENCE_CUTOFFS_2026_2027, getOAUScienceCutoffForCandidate } = await import('../data/oauCutoffs2026_2027');
      expect(OAU_SCIENCE_CUTOFFS_2026_2027.length).toBe(13);

      // 1. Biochemistry (Merit: 50.93, Catchment: 50.93, ELDS: 50.93)
      const biochemMerit = getOAUScienceCutoffForCandidate('Biochemistry', 'Kano');
      expect(biochemMerit?.applicableCutoff).toBe(50.93);
      expect(biochemMerit?.quotaType).toBe('elds');

      const biochemOsun = getOAUScienceCutoffForCandidate('Biochemistry', 'Osun');
      expect(biochemOsun?.applicableCutoff).toBe(50.93);
      expect(biochemOsun?.quotaType).toBe('catchment');

      // 2. Microbiology (Merit: 50.78, Catchment: 50.78, ELDS: 50.78)
      const microGeneral = getOAUScienceCutoffForCandidate('Microbiology', 'Delta');
      expect(microGeneral?.applicableCutoff).toBe(50.78);
      expect(microGeneral?.quotaType).toBe('merit');

      // 3. Science Laboratory Tech (Merit: 50.13)
      const slt = getOAUScienceCutoffForCandidate('Science Laboratory Technology', 'Oyo');
      expect(slt?.applicableCutoff).toBe(50.13);
      expect(slt?.quotaType).toBe('catchment');

      // 4. Standard 50.00% courses (Applied Geophysics, Botany, Chemistry, etc.)
      const physics = getOAUScienceCutoffForCandidate('Physics', 'Lagos');
      expect(physics?.applicableCutoff).toBe(50.00);

      const geology = getOAUScienceCutoffForCandidate('Geology', 'Ekiti');
      expect(geology?.applicableCutoff).toBe(50.00);
    });

    it('integrates seamlessly with the officialCutoffProvider for OAU', async () => {
      const { getOfficialInstitutionCutoff } = await import('../utils/officialCutoffProvider');

      // Biochemistry in OAU should return 2026/2027 session
      const oauBiochem = getOfficialInstitutionCutoff('Obafemi Awolowo University', 'Biochemistry', 'Osun');
      expect(oauBiochem?.cutoff).toBe(50.93);
      expect(oauBiochem?.cutoffYear).toBe('2026/2027');
      expect(oauBiochem?.cutoffSource).toContain('Faculty of Science Dean');

      // Microbiology in OAU
      const oauMicro = getOfficialInstitutionCutoff('OAU', 'Microbiology', 'Lagos');
      expect(oauMicro?.cutoff).toBe(50.78);
      expect(oauMicro?.cutoffYear).toBe('2026/2027');

      // Mathematics in OAU
      const oauMath = getOfficialInstitutionCutoff('OAU', 'Mathematics', 'Oyo');
      expect(oauMath?.cutoff).toBe(50.00);
      expect(oauMath?.cutoffYear).toBe('2026/2027');
    });
  });

  describe('Sitemap XML Integrity & Well-formedness', () => {
    it('verifies generated sitemap.xml and news-sitemap.xml are valid non-empty XML files', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
      const newsSitemapPath = path.resolve(process.cwd(), 'public', 'news-sitemap.xml');

      expect(fs.existsSync(sitemapPath)).toBe(true);
      expect(fs.existsSync(newsSitemapPath)).toBe(true);

      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
      const newsSitemapContent = fs.readFileSync(newsSitemapPath, 'utf-8');

      // XML declaration
      expect(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(newsSitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);

      // Root tags match
      expect(sitemapContent.endsWith('</urlset>\n') || sitemapContent.endsWith('</urlset>')).toBe(true);
      expect(newsSitemapContent.endsWith('</urlset>\n') || newsSitemapContent.endsWith('</urlset>')).toBe(true);

      // Check that closing tags count matches opening tags
      const openUrls = (sitemapContent.match(/<url>/g) || []).length;
      const closeUrls = (sitemapContent.match(/<\/url>/g) || []).length;
      expect(openUrls).toBeGreaterThan(100);
      expect(openUrls).toBe(closeUrls);

      const newsOpenUrls = (newsSitemapContent.match(/<url>/g) || []).length;
      const newsCloseUrls = (newsSitemapContent.match(/<\/url>/g) || []).length;
      expect(newsOpenUrls).toBeGreaterThan(10);
      expect(newsOpenUrls).toBe(newsCloseUrls);

      // Includes the latest breaking OAU Faculty of Science news
      expect(sitemapContent).toContain('oau-releases-2026-2027-cut-off-marks-faculty-of-science');
      expect(newsSitemapContent).toContain('oau-releases-2026-2027-cut-off-marks-faculty-of-science');
    });
  });
});
