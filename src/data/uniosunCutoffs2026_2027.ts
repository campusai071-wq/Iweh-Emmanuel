/**
 * Osun State University (UNIOSUN), Osogbo
 * Directorate of Academic Affairs — Admissions Office
 * General Merit and Indigene/Catchment Cut-Off Marks for All Programmes for the 2026/2027 Admission Exercise
 * Official Approval: Signed by A.A. Adewuyi (Deputy Registrar) on 07/10/2026.
 */

export interface UniosunCutoffProgramme {
  sn: number;
  programme: string;
  generalCutoff: number; // General Merit Cut-off
  catchmentCutoff: number; // Osun Indigene / Catchment Cut-off
  faculty: string;
}

export const UNIOSUN_SESSION = "2026/2027";
export const UNIOSUN_INSTITUTION_NAME = "Osun State University (UNIOSUN)";
export const UNIOSUN_OFFICIAL_DATE = "October 7, 2026";
export const UNIOSUN_OFFICIAL_SIGNATORY = "A.A. Adewuyi, Deputy Registrar";

export const UNIOSUN_CUTOFFS_2026_2027: UniosunCutoffProgramme[] = [
  // Page 1: Agriculture & Education
  { sn: 1, programme: "B. Agric. Economics", generalCutoff: 55.6, catchmentCutoff: 46.0, faculty: "Agriculture" },
  { sn: 2, programme: "B. Agric. Extension", generalCutoff: 53.6, catchmentCutoff: 41.0, faculty: "Agriculture" },
  { sn: 3, programme: "B. Agric. Forestry", generalCutoff: 50.0, catchmentCutoff: 40.0, faculty: "Agriculture" },
  { sn: 4, programme: "B. Agric. Agronomy", generalCutoff: 58.9, catchmentCutoff: 47.0, faculty: "Agriculture" },
  { sn: 5, programme: "B. Agric. Animal Science", generalCutoff: 56.8, catchmentCutoff: 45.0, faculty: "Agriculture" },
  { sn: 6, programme: "B. Agric. Fisheries and Aquaculture", generalCutoff: 51.9, catchmentCutoff: 40.0, faculty: "Agriculture" },
  { sn: 7, programme: "B. Agric. Wildlife Mgt.", generalCutoff: 49.8, catchmentCutoff: 40.0, faculty: "Agriculture" },
  { sn: 8, programme: "B.A. (Ed) English", generalCutoff: 58.8, catchmentCutoff: 48.0, faculty: "Education" },
  { sn: 9, programme: "B.A. (Ed) Chemistry", generalCutoff: 53.9, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 10, programme: "B.A. (Ed) Economics", generalCutoff: 55.4, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 11, programme: "B.A. (Ed) Education Guidance and Counseling", generalCutoff: 60.6, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 12, programme: "B.A. (Ed) Education Management", generalCutoff: 58.2, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 13, programme: "B.Sc. (Ed) Mathematics", generalCutoff: 43.0, catchmentCutoff: 40.0, faculty: "Education" },
  { sn: 14, programme: "B.Sc. (Ed) Political Science", generalCutoff: 58.6, catchmentCutoff: 50.0, faculty: "Education" },
  { sn: 15, programme: "B.Sc. (Ed) Biology", generalCutoff: 56.4, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 16, programme: "B.Sc. (Ed) Educational Technology", generalCutoff: 56.7, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 17, programme: "B.Sc. (Ed) Physics", generalCutoff: 53.6, catchmentCutoff: 40.0, faculty: "Education" },
  { sn: 18, programme: "B.Sc. (Ed) Computer Science", generalCutoff: 54.3, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 19, programme: "B.Sc. (Ed) Business Education", generalCutoff: 58.4, catchmentCutoff: 45.0, faculty: "Education" },
  { sn: 20, programme: "B.Sc. (Ed) Environmental Education", generalCutoff: 52.0, catchmentCutoff: 45.0, faculty: "Education" },

  // Page 2: Education, Health Sciences, Humanities, Media, Law
  { sn: 21, programme: "B. Ed. Adult Education", generalCutoff: 54.7, catchmentCutoff: 40.0, faculty: "Education" },
  { sn: 22, programme: "B. Sc. Anatomy", generalCutoff: 61.4, catchmentCutoff: 53.5, faculty: "Basic Medical Sciences" },
  { sn: 23, programme: "B. Health Information Management", generalCutoff: 61.3, catchmentCutoff: 56.5, faculty: "Health Sciences" },
  { sn: 24, programme: "B. Environmental Health Science", generalCutoff: 60.9, catchmentCutoff: 55.5, faculty: "Health Sciences" },
  { sn: 25, programme: "B.Sc. Nursing", generalCutoff: 77.4, catchmentCutoff: 74.4, faculty: "Clinical / Health Sciences" },
  { sn: 26, programme: "B.Sc. Physiology", generalCutoff: 63.2, catchmentCutoff: 57.5, faculty: "Basic Medical Sciences" },
  { sn: 27, programme: "B.Sc. Public Health", generalCutoff: 64.6, catchmentCutoff: 60.6, faculty: "Health Sciences" },
  { sn: 28, programme: "B.MLS (Medical Laboratory Science)", generalCutoff: 73.8, catchmentCutoff: 70.0, faculty: "Health Sciences" },
  { sn: 29, programme: "B.Sc. Nutrition and Dietetics", generalCutoff: 63.0, catchmentCutoff: 58.0, faculty: "Health Sciences" },
  { sn: 30, programme: "B.Sc. Radiography and Radiation Science", generalCutoff: 74.5, catchmentCutoff: 70.9, faculty: "Health Sciences" },
  { sn: 31, programme: "B.Sc. Pharmacology", generalCutoff: 65.7, catchmentCutoff: 57.6, faculty: "Basic Medical Sciences" },
  { sn: 32, programme: "B.A. English & Intl. Studies", generalCutoff: 63.4, catchmentCutoff: 52.3, faculty: "Humanities & Culture" },
  { sn: 33, programme: "B.A. French & Intl. Studies", generalCutoff: 63.6, catchmentCutoff: 45.0, faculty: "Humanities & Culture" },
  { sn: 34, programme: "B.A. History & Intl. Studies", generalCutoff: 64.3, catchmentCutoff: 53.1, faculty: "Humanities & Culture" },
  { sn: 35, programme: "B.A. Linguistics & Com. Art", generalCutoff: 64.1, catchmentCutoff: 47.0, faculty: "Humanities & Culture" },
  { sn: 36, programme: "B.A. Philosophy", generalCutoff: 61.5, catchmentCutoff: 51.4, faculty: "Humanities & Culture" },
  { sn: 37, programme: "B.A. Theatre Arts", generalCutoff: 62.7, catchmentCutoff: 56.0, faculty: "Humanities & Culture" },
  { sn: 38, programme: "B.A. Tourism Studies", generalCutoff: 56.2, catchmentCutoff: 42.9, faculty: "Humanities & Culture" },
  { sn: 39, programme: "B.A. Yoruba", generalCutoff: 53.2, catchmentCutoff: 40.0, faculty: "Humanities & Culture" },
  { sn: 40, programme: "B.A. Arabic Language & Lit.", generalCutoff: 56.8, catchmentCutoff: 45.0, faculty: "Humanities & Culture" },
  { sn: 41, programme: "B.A. Islamic Studies", generalCutoff: 58.1, catchmentCutoff: 40.0, faculty: "Humanities & Culture" },
  { sn: 42, programme: "B.A. Christian Religion Studies", generalCutoff: 47.1, catchmentCutoff: 40.0, faculty: "Humanities & Culture" },
  { sn: 43, programme: "B.Sc. Mass Communication", generalCutoff: 68.7, catchmentCutoff: 63.4, faculty: "Communication Studies" },
  { sn: 44, programme: "B.Sc. Advertising", generalCutoff: 62.0, catchmentCutoff: 46.8, faculty: "Communication Studies" },
  { sn: 45, programme: "B.Sc. Public Relations", generalCutoff: 67.6, catchmentCutoff: 60.8, faculty: "Communication Studies" },
  { sn: 46, programme: "B.Sc. Broadcasting", generalCutoff: 65.4, catchmentCutoff: 55.6, faculty: "Communication Studies" },
  { sn: 47, programme: "B.Sc. Journalism and Media Studies", generalCutoff: 64.5, catchmentCutoff: 59.6, faculty: "Communication Studies" },
  { sn: 48, programme: "LLB (Bachelor of Law)", generalCutoff: 77.1, catchmentCutoff: 73.0, faculty: "Law" },
  { sn: 49, programme: "Common & Islamic Law", generalCutoff: 71.3, catchmentCutoff: 66.5, faculty: "Law" },
  { sn: 50, programme: "B.Sc. Criminology & Security Studies", generalCutoff: 66.7, catchmentCutoff: 59.4, faculty: "Social Sciences" },
  { sn: 51, programme: "B.Sc. Peace & Conflict Studies", generalCutoff: 62.9, catchmentCutoff: 48.2, faculty: "Social Sciences" },

  // Page 3: Management, Social Sciences, Environmental, Engineering
  { sn: 52, programme: "B.Sc. Accounting", generalCutoff: 69.0, catchmentCutoff: 61.0, faculty: "Management Sciences" },
  { sn: 53, programme: "B.Sc. Banking & Finance", generalCutoff: 64.2, catchmentCutoff: 55.5, faculty: "Management Sciences" },
  { sn: 54, programme: "B.Sc. Marketing", generalCutoff: 61.7, catchmentCutoff: 55.4, faculty: "Management Sciences" },
  { sn: 55, programme: "B.Sc. Geography", generalCutoff: 53.3, catchmentCutoff: 45.0, faculty: "Social Sciences" },
  { sn: 56, programme: "B.Sc. Business Admin.", generalCutoff: 64.7, catchmentCutoff: 59.2, faculty: "Management Sciences" },
  { sn: 57, programme: "B.Sc. Economics", generalCutoff: 65.0, catchmentCutoff: 55.6, faculty: "Social Sciences" },
  { sn: 58, programme: "B.Sc. Entrepreneurial Studies", generalCutoff: 62.6, catchmentCutoff: 55.9, faculty: "Management Sciences" },
  { sn: 59, programme: "B.Sc. Industrial Relations & Personnel Management", generalCutoff: 62.8, catchmentCutoff: 51.3, faculty: "Management Sciences" },
  { sn: 60, programme: "B.Sc. Political Science", generalCutoff: 63.0, catchmentCutoff: 55.5, faculty: "Social Sciences" },
  { sn: 61, programme: "B.Sc. Sociology", generalCutoff: 63.9, catchmentCutoff: 53.0, faculty: "Social Sciences" },
  { sn: 62, programme: "B.Sc. International Relations & Diplomacy", generalCutoff: 68.0, catchmentCutoff: 59.8, faculty: "Social Sciences" },
  { sn: 63, programme: "B.Sc. Cooperative & Rural Development", generalCutoff: 58.5, catchmentCutoff: 47.9, faculty: "Social Sciences" },
  { sn: 64, programme: "B.Sc. Public Administration", generalCutoff: 61.1, catchmentCutoff: 51.0, faculty: "Management Sciences" },
  { sn: 65, programme: "B.Sc. Psychology", generalCutoff: 61.8, catchmentCutoff: 53.8, faculty: "Social Sciences" },
  { sn: 66, programme: "B.Sc. Demography & Social Statistics", generalCutoff: 58.1, catchmentCutoff: 44.8, faculty: "Social Sciences" },
  { sn: 67, programme: "B.Sc. Social Work", generalCutoff: 61.2, catchmentCutoff: 44.0, faculty: "Social Sciences" },
  { sn: 68, programme: "B.Sc. Development Studies", generalCutoff: 57.9, catchmentCutoff: 48.1, faculty: "Social Sciences" },
  { sn: 69, programme: "B.Sc. Politics, Philosophy and Economics", generalCutoff: 57.5, catchmentCutoff: 48.0, faculty: "Social Sciences" },
  { sn: 70, programme: "B.Sc. Local Government and Development Studies", generalCutoff: 57.5, catchmentCutoff: 43.6, faculty: "Social Sciences" },
  { sn: 71, programme: "B.Sc. Social Standards", generalCutoff: 55.7, catchmentCutoff: 44.0, faculty: "Social Sciences" },
  { sn: 72, programme: "B.Sc. Transport Management", generalCutoff: 50.3, catchmentCutoff: 40.0, faculty: "Management Sciences" },
  { sn: 73, programme: "B.Eng. Agric. Engineering", generalCutoff: 57.2, catchmentCutoff: 45.5, faculty: "Engineering" },
  { sn: 74, programme: "B.Eng. Chemical Engineering", generalCutoff: 61.7, catchmentCutoff: 56.9, faculty: "Engineering" },
  { sn: 75, programme: "B.Sc. Building", generalCutoff: 59.1, catchmentCutoff: 51.9, faculty: "Environmental Sciences" },
  { sn: 76, programme: "B.Sc. Estate Management", generalCutoff: 56.6, catchmentCutoff: 45.1, faculty: "Environmental Sciences" },
  { sn: 77, programme: "B.Sc. Food Science & Tech.", generalCutoff: 60.3, catchmentCutoff: 53.1, faculty: "Basic & Applied Sciences" },
  { sn: 78, programme: "B.Sc. Statistics", generalCutoff: 57.3, catchmentCutoff: 48.2, faculty: "Basic & Applied Sciences" },
  { sn: 79, programme: "B.Eng. Civil Engineering", generalCutoff: 64.0, catchmentCutoff: 57.7, faculty: "Engineering" },
  { sn: 80, programme: "B.Eng. Electrical/Electronics", generalCutoff: 63.0, catchmentCutoff: 55.1, faculty: "Engineering" },
  { sn: 81, programme: "B.Eng. Mechanical Engineering", generalCutoff: 63.8, catchmentCutoff: 55.7, faculty: "Engineering" },

  // Page 4: Pure & Applied Sciences, Computing, Environmental, Engineering
  { sn: 82, programme: "B.Sc. Biochemistry", generalCutoff: 60.3, catchmentCutoff: 50.3, faculty: "Basic Medical / Sciences" },
  { sn: 83, programme: "B.Sc. Biotechnology", generalCutoff: 62.1, catchmentCutoff: 55.6, faculty: "Basic & Applied Sciences" },
  { sn: 84, programme: "B.Sc. Chemistry", generalCutoff: 59.0, catchmentCutoff: 49.8, faculty: "Basic & Applied Sciences" },
  { sn: 85, programme: "B.Sc. Computer Science", generalCutoff: 65.6, catchmentCutoff: 59.2, faculty: "Computing & IT" },
  { sn: 86, programme: "B.Sc. Cybersecurity", generalCutoff: 63.8, catchmentCutoff: 58.5, faculty: "Computing & IT" },
  { sn: 87, programme: "B.Sc. Geology", generalCutoff: 57.1, catchmentCutoff: 45.3, faculty: "Basic & Applied Sciences" },
  { sn: 88, programme: "B.Sc. Industrial Chemistry", generalCutoff: 61.4, catchmentCutoff: 54.2, faculty: "Basic & Applied Sciences" },
  { sn: 89, programme: "B.Sc. Information System", generalCutoff: 60.0, catchmentCutoff: 51.8, faculty: "Computing & IT" },
  { sn: 90, programme: "B.Sc. Mathematics", generalCutoff: 54.7, catchmentCutoff: 48.6, faculty: "Basic & Applied Sciences" },
  { sn: 91, programme: "B.Sc. Microbiology", generalCutoff: 60.4, catchmentCutoff: 52.4, faculty: "Basic & Applied Sciences" },
  { sn: 92, programme: "B.Sc. Plant Biology", generalCutoff: 55.3, catchmentCutoff: 45.9, faculty: "Basic & Applied Sciences" },
  { sn: 93, programme: "B.Sc. Science Laboratory Technology", generalCutoff: 62.2, catchmentCutoff: 57.9, faculty: "Basic & Applied Sciences" },
  { sn: 94, programme: "B.Sc. Software Engineering", generalCutoff: 66.1, catchmentCutoff: 59.8, faculty: "Computing & IT" },
  { sn: 95, programme: "B.Sc. Urban & Regional Planning", generalCutoff: 51.6, catchmentCutoff: 45.7, faculty: "Environmental Sciences" },
  { sn: 96, programme: "B.Sc. Animal and Environmental Biology", generalCutoff: 58.1, catchmentCutoff: 50.3, faculty: "Basic & Applied Sciences" },
  { sn: 97, programme: "B.Sc. Physics with Electronics", generalCutoff: 58.5, catchmentCutoff: 48.5, faculty: "Basic & Applied Sciences" },
  { sn: 98, programme: "BLIS Library and Information Science", generalCutoff: 54.2, catchmentCutoff: 45.7, faculty: "Education / Information" },
  { sn: 99, programme: "Industrial Mathematics", generalCutoff: 54.1, catchmentCutoff: 46.3, faculty: "Basic & Applied Sciences" },
  { sn: 100, programme: "B.Sc. Quantity Survey", generalCutoff: 59.2, catchmentCutoff: 50.9, faculty: "Environmental Sciences" },
  { sn: 101, programme: "B.Sc. Architecture", generalCutoff: 61.5, catchmentCutoff: 53.8, faculty: "Environmental Sciences" },
  { sn: 102, programme: "B.Sc. Information Technology", generalCutoff: 62.4, catchmentCutoff: 57.5, faculty: "Computing & IT" },
  { sn: 103, programme: "B.Sc. Brewing Science and Technology", generalCutoff: 55.7, catchmentCutoff: 43.8, faculty: "Basic & Applied Sciences" },
  { sn: 104, programme: "B.Sc. Family and Consumer Science", generalCutoff: 50.3, catchmentCutoff: 45.0, faculty: "Agriculture / Science" },
  { sn: 105, programme: "B.Eng. Computer Engineering", generalCutoff: 63.4, catchmentCutoff: 58.3, faculty: "Engineering" },
  { sn: 106, programme: "B.Eng. Mechatronics Engineering", generalCutoff: 66.8, catchmentCutoff: 58.9, faculty: "Engineering" },
  { sn: 107, programme: "B.Sc. Data Science", generalCutoff: 61.5, catchmentCutoff: 56.9, faculty: "Computing & IT" }
];

function normalizeCourse(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/^b\.(?:sc|a|eng|ed|mls)\.?\s*/i, '')
    .replace(/\(ed\)\s*/i, '')
    .replace(/llb\s*\((?:bachelor of law)?\)/i, 'law')
    .replace(/\band\b/g, '')
    .replace(/&/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Looks up the official 2026/2027 UNIOSUN cut-off mark for a candidate.
 * If the candidate's state of origin is Osun State, returns the catchment/indigene cut-off mark.
 * Otherwise, returns the General Merit cut-off mark.
 */
export function getUNIOSUNCutoffForCandidate(
  courseName: string,
  stateOfOrigin?: string
): { item: UniosunCutoffProgramme; applicableCutoff: number; isCatchment: boolean } | null {
  if (!courseName) return null;
  const nTarget = normalizeCourse(courseName);
  const targetWantsEd = /\b(ed|education)\b|\(ed\)/i.test(courseName);

  const exactMatches = UNIOSUN_CUTOFFS_2026_2027.filter(c => normalizeCourse(c.programme) === nTarget);
  let match = exactMatches.find(c => {
    const progIsEd = /\(ed\)|education/i.test(c.programme) || c.faculty === 'Education';
    return targetWantsEd ? progIsEd : !progIsEd;
  }) || exactMatches[0];

  if (!match) {
    // Fuzzy search
    const fuzzyMatches = UNIOSUN_CUTOFFS_2026_2027.filter(c => {
      const nc = normalizeCourse(c.programme);
      return nc.includes(nTarget) || nTarget.includes(nc);
    });
    match = fuzzyMatches.find(c => {
      const progIsEd = /\(ed\)|education/i.test(c.programme) || c.faculty === 'Education';
      return targetWantsEd ? progIsEd : !progIsEd;
    }) || fuzzyMatches[0];
  }

  if (!match) return null;

  const isOsunIndigene = (stateOfOrigin || '').toLowerCase().trim() === 'osun';
  return {
    item: match,
    applicableCutoff: isOsunIndigene ? match.catchmentCutoff : match.generalCutoff,
    isCatchment: isOsunIndigene
  };
}
