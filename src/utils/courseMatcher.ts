/**
 * Intelligent Nigerian Higher Education Course Matcher
 * 
 * Handles institutional naming variations across Nigerian institutions:
 * - Ampersands vs 'and' (e.g. 'Metallurgical & Material Engineering' vs 'Metallurgical and Materials Engineering')
 * - Pluralization differences (e.g. 'Material' vs 'Materials')
 * - Program re-orderings (e.g. 'Materials and Metallurgical Engineering')
 * - Equivalent designations (e.g. 'Materials Science & Engineering' in OAU vs 'Metallurgical and Materials Engineering' in FUTA/UNILAG)
 * - Academic prefixes/suffixes ('B.Eng.', 'B.Sc.', 'ND', 'Faculty of...')
 */

export function normalizeCourseToken(token: string): string {
  let t = token.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (t.endsWith('ies')) t = t.slice(0, -3) + 'y';
  else if (t.endsWith('es') && !t.endsWith('ses')) t = t.slice(0, -2);
  else if (t.endsWith('s') && !t.endsWith('ss')) t = t.slice(0, -1);
  return t;
}

const STOP_WORDS = new Set([
  'and', 'in', 'of', 'for', 'with', '&', '/', '-', 'the', 
  'beng', 'bsc', 'ba', 'nd', 'hnd', 'btech', 'bed', 'programme', 'program', 'course', 'dept', 'department'
]);

export function tokenizeCourse(name: string): string[] {
  if (!name) return [];
  return name
    .toLowerCase()
    .split(/[\s,&/\-]+/)
    .map(normalizeCourseToken)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

function getCourseSynonyms(tokens: string[]): Set<string> {
  const set = new Set(tokens);
  
  // Metallurgical <-> Material / Materials <-> Materials Science
  if (set.has('metallurg') || set.has('metallurgical') || set.has('material') || set.has('materials')) {
    set.add('material');
    set.add('metallurg');
    set.add('metallurgical');
    set.add('materials');
  }
  
  // Electrical <-> Electronics
  if (set.has('elect') || set.has('electronic') || set.has('electrical')) {
    set.add('elect');
    set.add('electronic');
    set.add('electrical');
  }

  // Computer <-> Computing (Do NOT conflate with metallurgical or other engineering)
  if (set.has('comp') || set.has('computer') || set.has('comput')) {
    set.add('comput');
    set.add('computer');
  }

  // Mass Comm <-> Media / Communication
  if (set.has('comm') || set.has('communication')) {
    set.add('comm');
  }

  return set;
}

/**
 * Checks if two course names match fuzzily, accounting for spelling, word order,
 * plurals, and canonical Nigerian aliases.
 */
export function isCourseFuzzyMatch(courseName: string, query: string): boolean {
  if (!query || !query.trim() || !courseName || !courseName.trim()) return false;
  
  const qTrim = query.trim().toLowerCase();
  const cTrim = courseName.trim().toLowerCase();
  
  // Direct substring check
  if (cTrim.includes(qTrim) || qTrim.includes(cTrim)) return true;

  // Normalized clean alphanumeric comparison
  const qClean = qTrim.replace(/[^a-z0-9]/g, '');
  const cClean = cTrim.replace(/[^a-z0-9]/g, '');
  if (cClean === qClean || cClean.includes(qClean) || qClean.includes(cClean)) return true;

  const qTokens = tokenizeCourse(query);
  const cTokens = tokenizeCourse(courseName);
  if (qTokens.length === 0 || cTokens.length === 0) return false;

  const qSyn = getCourseSynonyms(qTokens);
  const cSyn = getCourseSynonyms(cTokens);

  let matches = 0;
  for (const qt of qSyn) {
    for (const ct of cSyn) {
      if (ct === qt || ct.startsWith(qt) || qt.startsWith(ct)) {
        matches++;
        break;
      }
    }
  }

  // If query consists of only 1 key subject word (e.g. "Metallurgical", "Medicine")
  if (qTokens.length === 1) {
    return matches >= 1;
  }

  // If query is multiple words, require at least 2 tokens (or all tokens if query length < 2)
  return matches >= Math.min(2, qTokens.length);
}

/**
 * Finds the best canonical matching course from an available list of courses
 */
export function findBestCourseMatch(query: string, availableCourses: string[]): string | null {
  if (!query || !availableCourses || availableCourses.length === 0) return null;
  const qTrim = query.trim().toLowerCase();

  // 1. Exact match
  const exact = availableCourses.find(c => c.toLowerCase().trim() === qTrim);
  if (exact) return exact;

  // 2. Normalized clean alphanumeric match
  const qClean = qTrim.replace(/[^a-z0-9]/g, '');
  const cleanMatch = availableCourses.find(c => c.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean);
  if (cleanMatch) return cleanMatch;

  // 3. Filter candidate matches
  const candidates = availableCourses.filter(c => isCourseFuzzyMatch(c, query));
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // 4. Score candidates by token overlap and length similarity
  const qTokens = tokenizeCourse(query);
  let best = candidates[0];
  let bestScore = -1;

  for (const c of candidates) {
    const cTokens = tokenizeCourse(c);
    let score = 0;
    for (const qt of qTokens) {
      if (cTokens.some(ct => ct === qt)) score += 3;
      else if (cTokens.some(ct => ct.startsWith(qt) || qt.startsWith(ct))) score += 1.5;
    }

    // Prefer courses where core distinctive words match (e.g. 'metallurg', 'civil', 'comput')
    const hasCoreMatch = qTokens.some(qt => 
      ['metallurg', 'comput', 'elect', 'civil', 'mech', 'chem', 'biochem', 'microbio'].some(k => qt.startsWith(k) && cTokens.some(ct => ct.startsWith(k)))
    );
    if (hasCoreMatch) score += 5;

    // Small bonus for similar token count
    const lengthDiff = Math.abs(qTokens.length - cTokens.length);
    score -= lengthDiff * 0.2;

    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  return best;
}
