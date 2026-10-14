/**
 * Federal University of Agriculture, Abeokuta (FUNAAB)
 * Pre-Admission Screening 2026/2027: Available Programmes & Minimum Acceptable UTME Scores
 * Official Release from the Directorate of ICT Services Pre-Admission Screening Portal
 */

import { isCourseFuzzyMatch } from '../utils/courseMatcher';

export interface FUNAABCutoffProgramme {
  college: string; // Faculty / College (e.g. Agriculture, Biological Science, Engineering)
  programme: string;
  minUtme: number; // Minimum acceptable UTME score (e.g. 160, 180, 190, 200)
  isNew?: boolean;
  affiliate?: 'FUNAAB' | 'FUNAAB – FCAIB' | 'FUNAAB – OYSCATECH';
}

export const FUNAAB_SESSION = "2026/2027";
export const FUNAAB_INSTITUTION_NAME = "Federal University of Agriculture, Abeokuta (FUNAAB)";

export const FUNAAB_CUTOFFS_2026_2027: FUNAABCutoffProgramme[] = [
  // ── Agriculture (160 marks) ──
  { college: "Agriculture", programme: "Agricultural Administration", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Agricultural Economics and Farm Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Agricultural Extension and Rural Development", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Animal Breeding and Genetics", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Animal Nutrition", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Animal Physiology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Animal Production and Health", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Aquaculture and Fisheries Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Climate Science and Agricultural Meteorology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Crop Protection", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Environmental Management and Toxicology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Forest Resource Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Geology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Horticulture", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Hydrology And Water Resources Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Pasture and Range Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Plant Breeding and Seed Technology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Plant Physiology and Crop Production", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Soil Science and Land Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Water Resources Management and Agro-meteorology", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Wildlife and Eco-tourism Management", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Agriculture", programme: "Water Sanitation and Hygiene", minUtme: 160, isNew: true, affiliate: "FUNAAB" },

  // ── Biological Science ──
  { college: "Biological Science", programme: "Biochemistry", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Biotechnology", minUtme: 190, isNew: true, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Microbiology", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Public Health", minUtme: 190, isNew: true, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Pure and Applied Botany", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Pure and Applied Zoology", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Biological Science", programme: "Science Lab Technology", minUtme: 190, isNew: true, affiliate: "FUNAAB" },

  // ── Computing Science (200 marks) ──
  { college: "Computing Science", programme: "Computer Science", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Cyber Security", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Data Science", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Information Communication Technology", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Information Systems", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Information Technology", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Computing Science", programme: "Software Engineering", minUtme: 200, affiliate: "FUNAAB" },

  // ── Food Science and Human Ecology ──
  { college: "Food Science and Human Ecology", programme: "Clothing & Textile Design", minUtme: 180, isNew: true, affiliate: "FUNAAB" },
  { college: "Food Science and Human Ecology", programme: "Food Science and Technology", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Food Science and Human Ecology", programme: "Home Science and Management", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Food Science and Human Ecology", programme: "Hospitality and Tourism", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Food Science and Human Ecology", programme: "Nutrition and Dietetics", minUtme: 200, affiliate: "FUNAAB" },

  // ── Physical Science ──
  { college: "Physical Science", programme: "Chemistry", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Physical Science", programme: "Geophysics", minUtme: 180, isNew: true, affiliate: "FUNAAB" },
  { college: "Physical Science", programme: "Industrial Chemistry", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Physical Science", programme: "Mathematics", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Physical Science", programme: "Physics", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Physical Science", programme: "Statistics", minUtme: 200, affiliate: "FUNAAB" },

  // ── Engineering (200 marks) ──
  { college: "Engineering", programme: "Agricultural Engineering", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Engineering", programme: "Civil Engineering", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Engineering", programme: "Electrical and Electronics Engineering", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Engineering", programme: "Mechanical Engineering", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Engineering", programme: "Mechatronic Engineering", minUtme: 200, affiliate: "FUNAAB" },

  // ── Veterinary Medicine (200 marks) ──
  { college: "Veterinary Medicine", programme: "Veterinary Medicine", minUtme: 200, affiliate: "FUNAAB" },

  // ── Entrepreneurial and Development Studies ──
  { college: "Entrepreneurial and Development Studies", programme: "Accounting", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Banking and Finance", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Business Administration", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Cooperative Studies", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Development Studies", minUtme: 160, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Economics", minUtme: 200, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Entrepreneurial Studies", minUtme: 180, affiliate: "FUNAAB" },
  { college: "Entrepreneurial and Development Studies", programme: "Library and Information Science", minUtme: 180, affiliate: "FUNAAB" },

  // ── FUNAAB – FCAIB (Federal College of Agriculture, Ibadan) ──
  { college: "FUNAAB – FCAIB", programme: "Agriculture (FCAIB)", minUtme: 160, affiliate: "FUNAAB – FCAIB" },
  { college: "FUNAAB – FCAIB", programme: "Home Science and Management (FCAIB)", minUtme: 160, affiliate: "FUNAAB – FCAIB" },

  // ── FUNAAB – OYSCATECH (Oyo State College of Agriculture and Technology, Igboora) ──
  { college: "FUNAAB – OYSCATECH", programme: "Agricultural Engineering & Technology (OYSCATECH)", minUtme: 180, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Agriculture (OYSCATECH)", minUtme: 160, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Chemistry (OYSCATECH)", minUtme: 160, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Computer Science (OYSCATECH)", minUtme: 180, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Forestry and Wildlife Management (OYSCATECH)", minUtme: 160, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Microbiology (OYSCATECH)", minUtme: 180, affiliate: "FUNAAB – OYSCATECH" },
  { college: "FUNAAB – OYSCATECH", programme: "Statistics (OYSCATECH)", minUtme: 160, affiliate: "FUNAAB – OYSCATECH" }
];

export const getFUNAABColleges = (): string[] => {
  const colleges = new Set(FUNAAB_CUTOFFS_2026_2027.map(item => item.college));
  return Array.from(colleges);
};

export const getFUNAABCutoffByCourse = (courseName: string): FUNAABCutoffProgramme | null => {
  if (!courseName) return null;
  const query = courseName.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

  // 1. Exact match with normalized text
  let match = FUNAAB_CUTOFFS_2026_2027.find(item => {
    const itemNorm = item.programme.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
    return itemNorm === query;
  });

  // 2. Substring match
  if (!match) {
    match = FUNAAB_CUTOFFS_2026_2027.find(item => {
      const itemNorm = item.programme.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
      return itemNorm.includes(query) || query.includes(itemNorm);
    });
  }

  // 3. Fuzzy domain matcher
  if (!match) {
    match = FUNAAB_CUTOFFS_2026_2027.find(item => isCourseFuzzyMatch(item.programme, courseName));
  }

  return match || null;
};

export interface FUNAABCandidateCutoff {
  programme: FUNAABCutoffProgramme | null;
  minUtme: number;
  eligibilityStatus: string;
}

export const getFUNAABCutoffForCandidate = (courseName: string): FUNAABCandidateCutoff => {
  const prog = getFUNAABCutoffByCourse(courseName);
  if (!prog) {
    return {
      programme: null,
      minUtme: 160,
      eligibilityStatus: 'FUNAAB Institutional Baseline: 160 UTME'
    };
  }

  return {
    programme: prog,
    minUtme: prog.minUtme,
    eligibilityStatus: `Approved Pre-Admission Screening Threshold: ${prog.minUtme} UTME Marks`
  };
};
