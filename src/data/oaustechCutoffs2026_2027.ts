/**
 * Olusegun Agagu University of Science and Technology (OAUSTECH), Okitipupa
 * 2026/2027 School of Basic Medical, Health and Allied Sciences Post-UTME Results & Admission Cutoff Marks
 * Source: https://www.oaustech.edu.ng/index.php/item/546-2026-2027-admissions-release-of-oaustech-post-utme-results-for-basic-health-and-allied-sciences.html
 */

export interface OaustechCutoffProgramme {
  sn: number;
  programme: string;
  meritScore: number;
  faculty: string;
  minUtme: number;
}

export const OAUSTECH_SESSION = "2026/2027";
export const OAUSTECH_INSTITUTION_NAME = "Olusegun Agagu University of Science and Technology (OAUSTECH)";
export const OAUSTECH_OFFICIAL_URL = "https://www.oaustech.edu.ng/index.php/item/546-2026-2027-admissions-release-of-oaustech-post-utme-results-for-basic-health-and-allied-sciences.html";
export const OAUSTECH_PORTAL_URL = "https://portal.oaustech.edu.ng/apply/";

export const OAUSTECH_CUTOFFS_2026_2027: OaustechCutoffProgramme[] = [
  {
    sn: 1,
    programme: "Nursing Science",
    meritScore: 69.00,
    faculty: "Basic Medical & Health Sciences",
    minUtme: 200
  },
  {
    sn: 2,
    programme: "Medical Laboratory Science",
    meritScore: 50.00,
    faculty: "Allied Health Sciences",
    minUtme: 200
  },
  {
    sn: 3,
    programme: "Public Health",
    meritScore: 49.00,
    faculty: "Basic Medical & Health Sciences",
    minUtme: 180
  },
  {
    sn: 4,
    programme: "Public Health Science",
    meritScore: 49.00,
    faculty: "Basic Medical & Health Sciences",
    minUtme: 180
  }
];

export const getOaustechCutoffByCourse = (courseName: string): OaustechCutoffProgramme | null => {
  const query = courseName.toLowerCase().trim();
  const match = OAUSTECH_CUTOFFS_2026_2027.find(item => {
    const cleanProg = item.programme.toLowerCase();
    return cleanProg.includes(query) || query.includes(cleanProg);
  });
  return match || null;
};
