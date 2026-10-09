/**
 * Official Obafemi Awolowo University (OAU), Ile-Ife
 * 2026/2027 Academic Session: Official Departmental Admission Cut-Off Marks
 * 
 * Complete and verified departmental admission cut-offs across all 12 Faculties:
 * - Administration
 * - Computing Science and Engineering
 * - Technology
 * - Social Sciences
 * - Agriculture
 * - Pharmacy
 * - Arts
 * - Environmental Design and Management (EDM)
 * - College of Health Sciences
 * - Law
 * - Science
 * - Education
 */

import { isCourseFuzzyMatch } from '../utils/courseMatcher';

export interface OAUCutoffProgramme2026 {
  faculty: string;
  programme: string;
  merit: number;
  catchment: {
    osun?: number;
    oyo?: number;
    ondo?: number;
    ogun?: number;
    ekiti?: number;
    lagos?: number;
    all?: number;
  };
  elds: number | Record<string, number>;
}

export const OAU_SESSION = "2026/2027";
export const OAU_SESSION_2026_2027 = "2026/2027";
export const OAU_INSTITUTION_NAME = "Obafemi Awolowo University (OAU), Ile-Ife";

export const OAU_CATCHMENT_STATES = ['osun', 'oyo', 'ondo', 'ogun', 'ekiti', 'lagos'];

export const ELDS_STATES = [
  'adamawa', 'bauchi', 'bayelsa', 'benue', 'borno', 'cross river', 'ebonyi', 'edo',
  'gombe', 'jigawa', 'kano', 'kaduna', 'katsina', 'kebbi', 'kogi', 'kwara', 'nasarawa',
  'niger', 'plateau', 'rivers', 'sokoto', 'taraba', 'yobe', 'zamfara'
];

export const OAU_CUTOFFS_2026_2027: OAUCutoffProgramme2026[] = [
  // ── 1. Faculty of Administration ──
  {
    faculty: "Faculty of Administration",
    programme: "Accounting",
    merit: 66.78,
    catchment: { osun: 64.00, oyo: 63.20, ondo: 58.45, ogun: 63.20, ekiti: 59.63, lagos: 55.70 },
    elds: { benue: 52.23, crossriver: 54.68, ebonyi: 53.98, kogi: 61.05, kwara: 60.60, default: 52.23 }
  },
  {
    faculty: "Faculty of Administration",
    programme: "Business Administration",
    merit: 57.70,
    catchment: { osun: 55.93, oyo: 55.10, ondo: 54.18, ogun: 53.48, ekiti: 52.30, lagos: 57.13 },
    elds: { bayelsa: 55.75, benue: 51.40, kogi: 53.83, kwara: 52.98, rivers: 55.18, default: 51.40 }
  },
  {
    faculty: "Faculty of Administration",
    programme: "International Relations",
    merit: 50.73,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Administration",
    programme: "Local Government and Development Studies",
    merit: 51.58,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Administration",
    programme: "Public Administration",
    merit: 52.10,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },

  // ── 2. Faculty of Computing Science and Engineering ──
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Computer Engineering",
    merit: 67.40,
    catchment: { osun: 62.33, oyo: 59.25, ondo: 57.32, ogun: 61.28, ekiti: 58.00, lagos: 53.90 },
    elds: { ebonyi: 63.78, bayelsa: 63.80, benue: 59.83, kogi: 65.55, kwara: 59.33, default: 59.33 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Computer with Economics",
    merit: 60.03,
    catchment: { osun: 56.70, oyo: 52.48, ondo: 59.75, ogun: 52.35, ekiti: 54.35, lagos: 54.00 },
    elds: { ebonyi: 54.95, kogi: 59.93, default: 54.95 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Computer Science with Economics",
    merit: 60.03,
    catchment: { osun: 56.70, oyo: 52.48, ondo: 59.75, ogun: 52.35, ekiti: 54.35, lagos: 54.00 },
    elds: { ebonyi: 54.95, kogi: 59.93, default: 54.95 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Computer with Mathematics",
    merit: 68.20,
    catchment: { osun: 65.30, oyo: 60.85, ondo: 59.05, ogun: 62.05, ekiti: 54.80, lagos: 54.28 },
    elds: { ebonyi: 60.08, bayelsa: 64.95, benue: 58.63, kogi: 62.38, crossriver: 57.88, kwara: 67.90, kaduna: 55.18, default: 55.18 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Computer Science with Mathematics",
    merit: 68.20,
    catchment: { osun: 65.30, oyo: 60.85, ondo: 59.05, ogun: 62.05, ekiti: 54.80, lagos: 54.28 },
    elds: { ebonyi: 60.08, bayelsa: 64.95, benue: 58.63, kogi: 62.38, crossriver: 57.88, kwara: 67.90, kaduna: 55.18, default: 55.18 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Cybersecurity",
    merit: 62.03,
    catchment: { osun: 58.50, oyo: 59.00, ondo: 53.05, ogun: 58.35, ekiti: 55.73, lagos: 52.48 },
    elds: { benue: 54.58, kogi: 57.48, rivers: 57.78, kwara: 53.73, default: 53.73 }
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Information and Communication Technology",
    merit: 56.25,
    catchment: { osun: 53.18, oyo: 53.85, ondo: 52.38, ogun: 53.33, ekiti: 55.00, lagos: 55.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Information Systems",
    merit: 52.58,
    catchment: { osun: 52.00, oyo: 52.00, ondo: 52.00, ogun: 52.00, ekiti: 52.00, lagos: 52.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Computing Science and Engineering",
    programme: "Software Engineering",
    merit: 68.08,
    catchment: { osun: 65.28, oyo: 61.00, ondo: 55.65, ogun: 62.23, ekiti: 56.13, lagos: 52.45 },
    elds: { ebonyi: 65.08, kogi: 61.30, kwara: 60.93, default: 60.93 }
  },

  // ── 3. Faculty of Technology ──
  {
    faculty: "Faculty of Technology",
    programme: "Aerospace Engineering",
    merit: 72.03,
    catchment: { osun: 66.95, oyo: 67.88, ondo: 69.95, ogun: 70.18, ekiti: 62.98, lagos: 57.00 },
    elds: 58.05
  },
  {
    faculty: "Faculty of Technology",
    programme: "Agricultural and Environmental Engineering",
    merit: 51.45,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Technology",
    programme: "Chemical Engineering",
    merit: 51.43,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Technology",
    programme: "Civil Engineering",
    merit: 65.25,
    catchment: { osun: 62.90, oyo: 61.05, ondo: 52.95, ogun: 60.875, ekiti: 59.625, lagos: 54.20 },
    elds: 51.63
  },
  {
    faculty: "Faculty of Technology",
    programme: "Electrical and Electronic Engineering",
    merit: 68.38,
    catchment: { osun: 63.93, oyo: 65.08, ondo: 59.33, ogun: 62.50, ekiti: 52.20, lagos: 54.05 },
    elds: 52.55
  },
  {
    faculty: "Faculty of Technology",
    programme: "Food Science and Technology",
    merit: 50.50,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Technology",
    programme: "Materials Science and Engineering",
    merit: 51.38,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Technology",
    programme: "Metallurgical and Materials Engineering",
    merit: 51.38,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Technology",
    programme: "Mechanical Engineering",
    merit: 69.73,
    catchment: { osun: 66.85, oyo: 66.28, ondo: 59.03, ogun: 61.50, ekiti: 57.53, lagos: 55.43 },
    elds: 52.80
  },

  // ── 4. Faculty of Social Sciences ──
  {
    faculty: "Faculty of Social Sciences",
    programme: "Demography and Social Statistics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Economics",
    merit: 63.43,
    catchment: { osun: 59.68, oyo: 59.05, ondo: 53.33, ogun: 58.48, ekiti: 56.10, lagos: 57.43 },
    elds: 53.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Entrepreneurship",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Geography",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Political Science",
    merit: 59.90,
    catchment: { osun: 56.53, oyo: 56.88, ondo: 52.45, ogun: 56.53, ekiti: 52.50, lagos: 52.50 },
    elds: 51.70
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Psychology",
    merit: 51.33,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Sociology and Anthropology",
    merit: 50.78,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Mass Communication",
    merit: 62.38,
    catchment: { osun: 58.85, oyo: 59.25, ondo: 53.73, ogun: 56.40, ekiti: 51.55, lagos: 50.33 },
    elds: 53.09
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Film Production",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Broadcast Journalism",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 59.00
  },
  {
    faculty: "Faculty of Social Sciences",
    programme: "Information Science and Media Studies",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 59.00
  },

  // ── 5. Faculty of Agriculture ──
  {
    faculty: "Faculty of Agriculture",
    programme: "Agricultural Economics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Agricultural Extension",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Animal Sciences",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Consumer Sciences",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Crop Production",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Forestry",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Agriculture",
    programme: "Soil Science",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },

  // ── 6. Faculty of Pharmacy ──
  {
    faculty: "Faculty of Pharmacy",
    programme: "Pharmacy",
    merit: 76.23,
    catchment: { osun: 74.75, oyo: 72.73, ondo: 73.43, ogun: 73.13, ekiti: 71.35, lagos: 62.03 },
    elds: { benue: 63.38, crossriver: 61.08, ebonyi: 66.45, kaduna: 74.00, kogi: 69.98, kwara: 73.25, rivers: 67.13, default: 61.08 }
  },

  // ── 7. Faculty of Arts ──
  {
    faculty: "Faculty of Arts",
    programme: "Drama",
    merit: 56.83,
    catchment: { osun: 56.80, oyo: 53.95, ondo: 51.98, ogun: 52.55, ekiti: 50.25, lagos: 51.33 },
    elds: 50.60
  },
  {
    faculty: "Faculty of Arts",
    programme: "Dramatic Arts",
    merit: 56.83,
    catchment: { osun: 56.80, oyo: 53.95, ondo: 51.98, ogun: 52.55, ekiti: 50.25, lagos: 51.33 },
    elds: 50.60
  },
  {
    faculty: "Faculty of Arts",
    programme: "English Language",
    merit: 59.88,
    catchment: { osun: 57.30, oyo: 56.28, ondo: 53.33, ogun: 52.25, ekiti: 54.63, lagos: 53.23 },
    elds: 51.83
  },
  {
    faculty: "Faculty of Arts",
    programme: "French",
    merit: 50.45,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "German",
    merit: 51.38,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "Portuguese",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "History",
    merit: 51.13,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "Linguistics",
    merit: 58.28,
    catchment: { osun: 55.35, oyo: 55.60, ondo: 51.50, ogun: 51.88, ekiti: 51.55, lagos: 54.60 },
    elds: 50.80
  },
  {
    faculty: "Faculty of Arts",
    programme: "Yoruba",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "Music",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "Philosophy",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.90
  },
  {
    faculty: "Faculty of Arts",
    programme: "Literature in English",
    merit: 52.05,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Arts",
    programme: "Religious Studies",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },

  // ── 8. Faculty of Environmental Design and Management (EDM) ──
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Architecture",
    merit: 69.18,
    catchment: { osun: 67.18, oyo: 66.80, ondo: 59.03, ogun: 65.28, ekiti: 64.20, lagos: 63.25 },
    elds: 58.45
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Building",
    merit: 51.70,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Estate Management",
    merit: 52.13,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Fine and Applied Arts",
    merit: 50.50,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Quantity Surveying",
    merit: 52.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Surveying and Geoinformatics",
    merit: 51.30,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Environmental Design and Management",
    programme: "Urban and Regional Planning",
    merit: 52.78,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },

  // ── 9. College of Health Sciences ──
  {
    faculty: "College of Health Sciences",
    programme: "Medicine and Surgery",
    merit: 87.85,
    catchment: { osun: 86.55, ondo: 86.55, ekiti: 86.93, oyo: 84.43, ogun: 86.45, lagos: 81.95 },
    elds: 81.95
  },
  {
    faculty: "College of Health Sciences",
    programme: "Dentistry",
    merit: 80.73,
    catchment: { osun: 80.45, ondo: 79.48, ekiti: 80.13, oyo: 77.48, ogun: 79.48, lagos: 76.53 },
    elds: 76.53
  },
  {
    faculty: "College of Health Sciences",
    programme: "Nursing Science",
    merit: 79.55,
    catchment: { osun: 78.43, ondo: 77.63, ekiti: 76.525, oyo: 77.78, ogun: 75.80, lagos: 72.20 },
    elds: 72.20
  },
  {
    faculty: "College of Health Sciences",
    programme: "Medical Rehabilitation",
    merit: 74.70,
    catchment: { osun: 74.33, ondo: 73.70, ekiti: 71.38, oyo: 73.60, ogun: 72.93, lagos: 62.50 },
    elds: 62.50
  },
  {
    faculty: "College of Health Sciences",
    programme: "Occupational Therapy",
    merit: 72.90,
    catchment: { osun: 72.63, ondo: 72.63, ekiti: 69.975, oyo: 72.38, ogun: 72.63, lagos: 60.13 },
    elds: 60.13
  },
  {
    faculty: "College of Health Sciences",
    programme: "Human Nutrition and Dietetics",
    merit: 69.50,
    catchment: { osun: 68.45, ondo: 62.50, ekiti: 62.23, oyo: 66.80, ogun: 65.80, lagos: 55.30 },
    elds: 55.30
  },

  // ── 10. Faculty of Law ──
  {
    faculty: "Faculty of Law",
    programme: "Law",
    merit: 77.65,
    catchment: { osun: 76.875, oyo: 76.53, ondo: 75.05, ogun: 75.78, ekiti: 75.53, lagos: 69.68 },
    elds: {
      bayelsa: 68.40,
      benue: 75.88,
      ebonyi: 75.90,
      gombe: 63.13,
      kaduna: 57.05,
      kebbi: 53.43,
      kogi: 76.10,
      kwara: 76.83,
      niger: 58.15,
      plateau: 73.83,
      rivers: 71.85,
      taraba: 67.03,
      default: 67.03
    }
  },

  // ── 11. Faculty of Science ──
  {
    faculty: "Faculty of Science",
    programme: "Applied Geophysics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Biochemistry",
    merit: 50.93,
    catchment: { osun: 50.93, oyo: 50.93, ondo: 50.93, ogun: 50.93, ekiti: 50.93, lagos: 50.93 },
    elds: 50.93
  },
  {
    faculty: "Faculty of Science",
    programme: "Botany",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Chemistry",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Engineering Physics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Geology",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Industrial Chemistry",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Mathematics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Microbiology",
    merit: 50.78,
    catchment: { osun: 50.78, oyo: 50.78, ondo: 50.78, ogun: 50.78, ekiti: 50.78, lagos: 50.78 },
    elds: 50.78
  },
  {
    faculty: "Faculty of Science",
    programme: "Physics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Science Laboratory Technology",
    merit: 50.13,
    catchment: { osun: 50.13, oyo: 50.13, ondo: 50.13, ogun: 50.13, ekiti: 50.13, lagos: 50.13 },
    elds: 50.13
  },
  {
    faculty: "Faculty of Science",
    programme: "Statistics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Science",
    programme: "Zoology",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00
  },

  // ── 12. Faculty of Education ──
  {
    faculty: "Faculty of Education",
    programme: "Education Economics",
    merit: 54.38,
    catchment: { osun: 51.20, oyo: 52.00, ondo: 52.00, ogun: 52.00, ekiti: 53.63, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Geography",
    merit: 51.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education History",
    merit: 58.60,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Religious Studies",
    merit: 55.43,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education English",
    merit: 57.58,
    catchment: { osun: 50.70, oyo: 53.73, ondo: 53.78, ogun: 51.05, ekiti: 52.33, lagos: 53.73 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education French",
    merit: 51.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Yoruba",
    merit: 51.90,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Political Science",
    merit: 53.18,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Fine Arts",
    merit: 55.30,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Music",
    merit: 52.65,
    catchment: { osun: 50.25, oyo: 50.50, ondo: 50.50, ogun: 50.50, ekiti: 50.50, lagos: 50.50 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Adult Education",
    merit: 60.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Guidance and Counselling",
    merit: 55.43,
    catchment: { osun: 50.20, oyo: 53.40, ondo: 53.50, ogun: 55.13, ekiti: 54.18, lagos: 53.50 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Educational Management",
    merit: 58.53,
    catchment: { osun: 52.30, oyo: 55.75, ondo: 54.10, ogun: 53.45, ekiti: 55.75, lagos: 52.50 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Educational Technology",
    merit: 51.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Library and Information Science",
    merit: 54.85,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Social Studies and Civic Education",
    merit: 54.03,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Integrated Science",
    merit: 51.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Language and Communication Arts",
    merit: 56.48,
    catchment: { osun: 52.93, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Early Childhood and Primary Education",
    merit: 56.01,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Physical and Health Education",
    merit: 51.73,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Human Kinetics Education",
    merit: 53.63,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Health Education",
    merit: 53.50,
    catchment: { osun: 51.75, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Mathematics",
    merit: 59.23,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Biology",
    merit: 54.13,
    catchment: { osun: 52.75, oyo: 52.90, ondo: 51.00, ogun: 51.58, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Chemistry",
    merit: 58.15,
    catchment: { osun: 53.88, oyo: 51.00, ondo: 54.53, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Physics",
    merit: 55.10,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Agricultural Science",
    merit: 55.18,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Computer Education",
    merit: 53.33,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  },
  {
    faculty: "Faculty of Education",
    programme: "Education Home Economics",
    merit: 51.00,
    catchment: { all: 51.00, osun: 51.00, oyo: 51.00, ondo: 51.00, ogun: 51.00, ekiti: 51.00, lagos: 51.00 },
    elds: 50.00
  }
];

// Backward-compatible interface
export interface OAUScienceCutoffProgramme {
  sn: number;
  programme: string;
  merit: number;
  catchment: {
    osun: number;
    oyo: number;
    ondo: number;
    ogun: number;
    ekiti: number;
    lagos: number;
  };
  elds: number;
  dean: string;
  faculty: string;
}

export const OAU_SCIENCE_CUTOFFS_2026_2027: OAUScienceCutoffProgramme[] = OAU_CUTOFFS_2026_2027
  .filter(p => p.faculty === "Faculty of Science")
  .map((p, index) => ({
    sn: index + 1,
    programme: p.programme,
    merit: p.merit,
    catchment: {
      osun: (p.catchment as any).osun ?? p.merit,
      oyo: (p.catchment as any).oyo ?? p.merit,
      ondo: (p.catchment as any).ondo ?? p.merit,
      ogun: (p.catchment as any).ogun ?? p.merit,
      ekiti: (p.catchment as any).ekiti ?? p.merit,
      lagos: (p.catchment as any).lagos ?? p.merit
    },
    elds: typeof p.elds === 'number' ? p.elds : 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  }));

export function getOAUScienceCutoffForCandidate(
  courseName: string,
  stateOfOrigin?: string
): {
  programme: OAUScienceCutoffProgramme;
  applicableCutoff: number;
  quotaType: 'merit' | 'catchment' | 'elds';
  quotaLabel: string;
} | null {
  const res = getOAUCutoffForCandidate2026(courseName, stateOfOrigin || "");
  if (!res || res.programme.faculty !== "Faculty of Science") return null;

  return {
    programme: {
      sn: 1,
      programme: res.programme.programme,
      merit: res.programme.merit,
      catchment: res.programme.catchment as any,
      elds: typeof res.programme.elds === 'number' ? res.programme.elds : 50,
      dean: "Professor O. A. Adesina",
      faculty: "Faculty of Science"
    },
    applicableCutoff: res.cutoff,
    quotaType: res.quotaType,
    quotaLabel: res.quotaLabel
  };
}

/**
 * Returns list of distinct faculty names in OAU for 2026/2027
 */
export function getOAUFaculties2026(): string[] {
  return Array.from(new Set(OAU_CUTOFFS_2026_2027.map(p => p.faculty)));
}

/**
 * Clean course strings for comparison
 */
function cleanProgrammeName(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/^b\.(?:sc|a|eng|ed|mls)\.?\s*/i, '')
    .replace(/\(ed\)\s*/i, '')
    .replace(/\band\b/g, '')
    .replace(/&/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Comprehensive candidate cutoff lookup for OAU 2026/2027 across all faculties and quotas
 */
export function getOAUCutoffForCandidate2026(
  programmeName: string,
  stateOfOrigin: string
): {
  programme: OAUCutoffProgramme2026;
  cutoff: number;
  quotaType: 'merit' | 'catchment' | 'elds';
  quotaLabel: string;
  isScienceCircular: boolean;
} | null {
  if (!programmeName) return null;

  const pClean = cleanProgrammeName(programmeName);
  // 1. Exact match first
  let prog = OAU_CUTOFFS_2026_2027.find(p => cleanProgrammeName(p.programme) === pClean);

  // 2. Substring match fallback
  if (!prog) {
    prog = OAU_CUTOFFS_2026_2027.find(p => {
      const itemClean = cleanProgrammeName(p.programme);
      return itemClean.includes(pClean) || pClean.includes(itemClean);
    });
  }

  // 3. Fuzzy match fallback
  if (!prog) {
    prog = OAU_CUTOFFS_2026_2027.find(p => isCourseFuzzyMatch(p.programme, programmeName));
  }

  if (!prog) {
    return null;
  }

  const s = (stateOfOrigin || '').toLowerCase().trim();
  const isCatchment = OAU_CATCHMENT_STATES.includes(s);
  const isELDS = ELDS_STATES.includes(s);
  const isScienceCircular = prog.faculty === "Faculty of Science";

  // Catchment Evaluation
  if (isCatchment) {
    const cMap = prog.catchment as any;
    const stateVal = cMap[s] ?? cMap.all;
    if (typeof stateVal === 'number') {
      return {
        programme: prog,
        cutoff: stateVal,
        quotaType: 'catchment',
        quotaLabel: `OAU Catchment (${stateOfOrigin.charAt(0).toUpperCase() + stateOfOrigin.slice(1)})`,
        isScienceCircular
      };
    }
  }

  // ELDS Evaluation
  if (isELDS) {
    if (typeof prog.elds === 'number') {
      return {
        programme: prog,
        cutoff: prog.elds,
        quotaType: 'elds',
        quotaLabel: `ELDS Quota (${stateOfOrigin.charAt(0).toUpperCase() + stateOfOrigin.slice(1)})`,
        isScienceCircular
      };
    } else if (typeof prog.elds === 'object') {
      const eldsMap = prog.elds as Record<string, number>;
      const cleanStateKey = s.replace(/[^a-z]/g, '');
      const specific = eldsMap[s] ?? eldsMap[cleanStateKey] ?? eldsMap.default;
      if (typeof specific === 'number') {
        return {
          programme: prog,
          cutoff: specific,
          quotaType: 'elds',
          quotaLabel: `ELDS Quota (${stateOfOrigin.charAt(0).toUpperCase() + stateOfOrigin.slice(1)})`,
          isScienceCircular
        };
      }
    }
  }

  // General Merit Evaluation
  return {
    programme: prog,
    cutoff: prog.merit,
    quotaType: 'merit',
    quotaLabel: 'General Merit',
    isScienceCircular
  };
}
