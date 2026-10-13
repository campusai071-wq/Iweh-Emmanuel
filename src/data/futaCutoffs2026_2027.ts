/**
 * Federal University of Technology, Akure (FUTA) Undergraduate Admissions Unit
 * 2026/2027 Admission Exercise: Departmental Screening Cut Off Marks & Scoring Rules
 * Official 75:25 Point-Based Screening System: UTME (75%) + O'Level (25%)
 */

import { isCourseFuzzyMatch } from '../utils/courseMatcher';

export interface FUTACutoffProgramme {
  faculty: string;
  school: string;
  programme: string;
  code: string;
  merit: number;
  cutoff: number;
  catchment: number;
  elds: number;
}

export const FUTA_SESSION = "2026/2027";
export const FUTA_INSTITUTION_NAME = "Federal University of Technology, Akure (FUTA)";

export const FUTA_CUTOFFS_2026_2027: FUTACutoffProgramme[] = [
  // ── School of Engineering and Engineering Technology (SEET) ──
  { faculty: "SEET", school: "SEET", programme: "Electrical and Electronics Engineering", code: "EEE", merit: 74.37, cutoff: 74.37, catchment: 72.0, elds: 70.0 },
  { faculty: "SEET", school: "SEET", programme: "Mechanical Engineering", code: "MEE", merit: 73.75, cutoff: 73.75, catchment: 71.0, elds: 69.0 },
  { faculty: "SEET", school: "SEET", programme: "Civil and Environmental Engineering", code: "CVE", merit: 71.87, cutoff: 71.87, catchment: 69.5, elds: 67.5 },
  { faculty: "SEET", school: "SEET", programme: "Computer Engineering", code: "CPE", merit: 69.62, cutoff: 69.62, catchment: 67.5, elds: 65.0 },
  { faculty: "SEET", school: "SEET", programme: "Agricultural and Environmental Engineering", code: "AGE", merit: 55.12, cutoff: 55.12, catchment: 52.5, elds: 50.0 },
  { faculty: "SEET", school: "SEET", programme: "Metallurgical and Materials Engineering", code: "MME", merit: 54.87, cutoff: 54.87, catchment: 52.0, elds: 50.0 },
  { faculty: "SEET", school: "SEET", programme: "Mining Engineering", code: "MNE", merit: 54.75, cutoff: 54.75, catchment: 52.0, elds: 50.0 },
  { faculty: "SEET", school: "SEET", programme: "Information and Communication Technology", code: "ICT", merit: 49.75, cutoff: 49.75, catchment: 48.0, elds: 47.5 },
  { faculty: "SEET", school: "SEET", programme: "Industrial and Production Engineering", code: "IPE", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SEET", school: "SEET", programme: "Chemical and Polymer Engineering", code: "CPE", merit: 55.0, cutoff: 55.0, catchment: 52.5, elds: 50.0 },
  { faculty: "SEET", school: "SEET", programme: "Mechatronics Engineering", code: "MCE", merit: 70.0, cutoff: 70.0, catchment: 68.0, elds: 66.0 },

  // ── School of Computing (SOC) ──
  { faculty: "SOC", school: "SOC", programme: "Computer Science", code: "CSC", merit: 69.0, cutoff: 69.0, catchment: 66.5, elds: 64.5 },
  { faculty: "SOC", school: "SOC", programme: "Cyber Security", code: "CYB", merit: 63.75, cutoff: 63.75, catchment: 61.5, elds: 59.5 },
  { faculty: "SOC", school: "SOC", programme: "Software Engineering", code: "SEN", merit: 63.75, cutoff: 63.75, catchment: 61.5, elds: 59.5 },
  { faculty: "SOC", school: "SOC", programme: "Information Technology", code: "IFT", merit: 63.75, cutoff: 63.75, catchment: 61.5, elds: 59.5 },
  { faculty: "SOC", school: "SOC", programme: "Information Systems", code: "IFS", merit: 63.75, cutoff: 63.75, catchment: 61.5, elds: 59.5 },

  // ── School of Environmental Technology (SET) ──
  { faculty: "SET", school: "SET", programme: "Architecture", code: "ARC", merit: 72.87, cutoff: 72.87, catchment: 70.5, elds: 68.5 },
  { faculty: "SET", school: "SET", programme: "Surveying and Geoinformatics", code: "SVG", merit: 64.25, cutoff: 64.25, catchment: 62.0, elds: 60.0 },
  { faculty: "SET", school: "SET", programme: "Quantity Surveying", code: "QSV", merit: 57.0, cutoff: 57.0, catchment: 55.0, elds: 53.0 },
  { faculty: "SET", school: "SET", programme: "Building", code: "BLD", merit: 56.62, cutoff: 56.62, catchment: 54.5, elds: 52.5 },
  { faculty: "SET", school: "SET", programme: "Industrial Design", code: "IND", merit: 53.25, cutoff: 53.25, catchment: 51.0, elds: 49.0 },
  { faculty: "SET", school: "SET", programme: "Urban and Regional Planning", code: "URP", merit: 52.87, cutoff: 52.87, catchment: 50.5, elds: 48.5 },
  { faculty: "SET", school: "SET", programme: "Estate Management", code: "ESM", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },

  // ── School of Sciences (SOS) ──
  { faculty: "SOS", school: "SOS", programme: "Biochemistry", code: "BCH", merit: 63.37, cutoff: 63.37, catchment: 61.0, elds: 59.0 },
  { faculty: "SOS", school: "SOS", programme: "Microbiology", code: "MCB", merit: 63.0, cutoff: 63.0, catchment: 60.5, elds: 58.5 },
  { faculty: "SOS", school: "SOS", programme: "Industrial Mathematics", code: "MTH", merit: 59.0, cutoff: 59.0, catchment: 56.5, elds: 54.5 },
  { faculty: "SOS", school: "SOS", programme: "Biotechnology", code: "BTC", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SOS", school: "SOS", programme: "Biology", code: "BIO", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SOS", school: "SOS", programme: "Chemistry", code: "CHM", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SOS", school: "SOS", programme: "Physics", code: "PHY", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SOS", school: "SOS", programme: "Statistics", code: "STA", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },

  // ── School of Health and Health Technology (SHHT / CHS) ──
  { faculty: "SHHT", school: "SHHT", programme: "Medicine and Surgery", code: "MBBS", merit: 62.0, cutoff: 62.0, catchment: 60.0, elds: 58.0 },
  { faculty: "SHHT", school: "SHHT", programme: "Pharmacy", code: "PHM", merit: 60.0, cutoff: 60.0, catchment: 58.0, elds: 56.0 },
  { faculty: "SHHT", school: "SHHT", programme: "Nursing Science", code: "NSC", merit: 60.0, cutoff: 60.0, catchment: 58.0, elds: 56.0 },
  { faculty: "SHHT", school: "SHHT", programme: "Human Anatomy", code: "ANA", merit: 59.5, cutoff: 59.5, catchment: 57.5, elds: 55.5 },
  { faculty: "SHHT", school: "SHHT", programme: "Human Physiology", code: "PHS", merit: 57.25, cutoff: 57.25, catchment: 55.0, elds: 53.0 },
  { faculty: "SHHT", school: "SHHT", programme: "Medical Laboratory Science", code: "MLS", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SHHT", school: "SHHT", programme: "Biomedical Technology", code: "BMT", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },

  // ── School of Agriculture and Agricultural Technology (SAAT) ──
  { faculty: "SAAT", school: "SAAT", programme: "Food Science and Technology", code: "FST", merit: 58.12, cutoff: 58.12, catchment: 56.0, elds: 54.0 },
  { faculty: "SAAT", school: "SAAT", programme: "Forestry and Wood Technology", code: "FWT", merit: 57.5, cutoff: 57.5, catchment: 55.0, elds: 53.0 },
  { faculty: "SAAT", school: "SAAT", programme: "Animal Production and Health", code: "APH", merit: 55.37, cutoff: 55.37, catchment: 53.0, elds: 51.0 },
  { faculty: "SAAT", school: "SAAT", programme: "Agricultural Extension and Communication Technology", code: "AEC", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SAAT", school: "SAAT", programme: "Agricultural and Resource Economics", code: "ARE", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SAAT", school: "SAAT", programme: "Crop, Soil and Pest Management", code: "CSP", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SAAT", school: "SAAT", programme: "Ecotourism and Wildlife Management", code: "EWM", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SAAT", school: "SAAT", programme: "Fisheries and Aquaculture Technology", code: "FAT", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },

  // ── School of Earth and Mineral Sciences (SEMS) ──
  { faculty: "SEMS", school: "SEMS", programme: "Applied Geophysics", code: "AGP", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SEMS", school: "SEMS", programme: "Applied Geology", code: "AGD", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SEMS", school: "SEMS", programme: "Marine Science and Technology", code: "MST", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SEMS", school: "SEMS", programme: "Meteorology and Climate Science", code: "MCS", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },
  { faculty: "SEMS", school: "SEMS", programme: "Remote Sensing and GIS", code: "RSG", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 },

  // ── School of Logistics and Innovation Technology (SLIT) ──
  { faculty: "SLIT", school: "SLIT", programme: "Logistics and Transport Management", code: "LTM", merit: 47.5, cutoff: 47.5, catchment: 47.5, elds: 47.5 }
];

export const getFUTASchools = (): string[] => {
  const schools = new Set(FUTA_CUTOFFS_2026_2027.map(item => item.faculty));
  return Array.from(schools);
};

export const getFUTACutoffByCourse = (courseName: string): FUTACutoffProgramme | null => {
  if (!courseName) return null;
  const query = courseName.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  
  // 1. Exact match with normalized 'and'
  let match = FUTA_CUTOFFS_2026_2027.find(item => {
    const itemNorm = item.programme.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
    return itemNorm === query;
  });

  // 2. Substring match
  if (!match) {
    match = FUTA_CUTOFFS_2026_2027.find(item => {
      const itemNorm = item.programme.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
      return itemNorm.includes(query) || query.includes(itemNorm);
    });
  }

  // 3. Fuzzy domain matcher
  if (!match) {
    match = FUTA_CUTOFFS_2026_2027.find(item => isCourseFuzzyMatch(item.programme, courseName));
  }

  return match || null;
};

const FUTA_CATCHMENT_STATES = ["ondo", "ekiti", "osun", "oyo", "ogun", "lagos"];
const FUTA_ELDS_STATES = [
  "adamawa", "bauchi", "bayelsa", "benue", "borno", "cross river", "ebonyi", "gombe",
  "jigawa", "kaduna", "kano", "katsina", "kebbi", "kogi", "kwara", "nasarawa", "niger",
  "plateau", "rivers", "sokoto", "taraba", "yobe", "zamfara"
];

export interface FUTACandidateCutoff {
  programme: FUTACutoffProgramme | null;
  cutoff: number;
  quotaType: 'merit' | 'catchment' | 'elds';
  quotaLabel: string;
}

export const getFUTACutoffForCandidate = (courseName: string, stateOfOrigin?: string): FUTACandidateCutoff => {
  const prog = getFUTACutoffByCourse(courseName);
  if (!prog) {
    return {
      programme: null,
      cutoff: 47.5,
      quotaType: 'merit',
      quotaLabel: 'Institutional Minimum Baseline'
    };
  }

  const s = (stateOfOrigin || '').toLowerCase().trim();

  // 1. ELDS Check (Statutory 20% pool)
  if (FUTA_ELDS_STATES.includes(s)) {
    return {
      programme: prog,
      cutoff: prog.elds,
      quotaType: 'elds',
      quotaLabel: `FUTA ELDS Concession (${stateOfOrigin})`
    };
  }

  // 2. Catchment Check (Statutory 35% pool - Ondo, Ekiti, Osun, Oyo, Ogun, Lagos)
  if (FUTA_CATCHMENT_STATES.includes(s)) {
    return {
      programme: prog,
      cutoff: prog.catchment,
      quotaType: 'catchment',
      quotaLabel: `FUTA Catchment Pool (${stateOfOrigin})`
    };
  }

  // 3. National Merit (Statutory 45% open pool)
  return {
    programme: prog,
    cutoff: prog.merit,
    quotaType: 'merit',
    quotaLabel: 'National Merit Pool'
  };
};
