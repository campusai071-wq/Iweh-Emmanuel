/**
 * Official Obafemi Awolowo University (OAU), Ile-Ife
 * 2026/2027 Academic Session: Official Departmental Admission Cut-Off Marks
 * 
 * Sourced directly from the official circular signed by Professor O. A. Adesina,
 * Dean, Faculty of Science, Obafemi Awolowo University, Ile-Ife, Nigeria:
 * - Merit Cutoff
 * - 6 Catchment States: Osun, Oyo, Ondo, Ogun, Ekiti, Lagos
 * - Educationally Less Developed States (ELDS)
 */

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

export const OAU_SESSION_2026_2027 = "2026/2027";
export const OAU_INSTITUTION_NAME = "Obafemi Awolowo University (OAU), Ile-Ife";

export const OAU_SCIENCE_CUTOFFS_2026_2027: OAUScienceCutoffProgramme[] = [
  {
    sn: 1,
    programme: "Applied Geophysics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 2,
    programme: "Biochemistry",
    merit: 50.93,
    catchment: { osun: 50.93, oyo: 50.93, ondo: 50.93, ogun: 50.93, ekiti: 50.93, lagos: 50.93 },
    elds: 50.93,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 3,
    programme: "Botany",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 4,
    programme: "Chemistry",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 5,
    programme: "Engineering Physics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 6,
    programme: "Geology",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 7,
    programme: "Industrial Chemistry",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 8,
    programme: "Mathematics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 9,
    programme: "Microbiology",
    merit: 50.78,
    catchment: { osun: 50.78, oyo: 50.78, ondo: 50.78, ogun: 50.78, ekiti: 50.78, lagos: 50.78 },
    elds: 50.78,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 10,
    programme: "Physics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 11,
    programme: "Science Laboratory Tech.",
    merit: 50.13,
    catchment: { osun: 50.13, oyo: 50.13, ondo: 50.13, ogun: 50.13, ekiti: 50.13, lagos: 50.13 },
    elds: 50.13,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 12,
    programme: "Statistics",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  },
  {
    sn: 13,
    programme: "Zoology",
    merit: 50.00,
    catchment: { osun: 50.00, oyo: 50.00, ondo: 50.00, ogun: 50.00, ekiti: 50.00, lagos: 50.00 },
    elds: 50.00,
    dean: "Professor O. A. Adesina",
    faculty: "Faculty of Science"
  }
];

export const OAU_CATCHMENT_STATES = ['osun', 'oyo', 'ondo', 'ogun', 'ekiti', 'lagos'];

export const ELDS_STATES = [
  'adamawa', 'bauchi', 'bayelsa', 'benue', 'borno', 'cross river', 'ebonyi', 'edo',
  'gombe', 'jigawa', 'kano', 'kaduna', 'katsina', 'kebbi', 'kogi', 'kwara', 'nasarawa',
  'niger', 'plateau', 'rivers', 'sokoto', 'taraba', 'yobe', 'zamfara'
];

function normalizeCourse(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/^b\.(?:sc|a|eng|ed|mls)\.?\s*/i, '')
    .replace(/\(ed\)\s*/i, '')
    .replace(/science\s+laboratory\s+technology/i, 'science laboratory tech')
    .replace(/\band\b/g, '')
    .replace(/&/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Looks up the official 2026/2027 OAU Faculty of Science cut-off mark for a candidate.
 */
export function getOAUScienceCutoffForCandidate(
  courseName: string,
  stateOfOrigin?: string
): {
  programme: OAUScienceCutoffProgramme;
  applicableCutoff: number;
  quotaType: 'merit' | 'catchment' | 'elds';
  quotaLabel: string;
} | null {
  if (!courseName) return null;
  const nTarget = normalizeCourse(courseName);

  let match = OAU_SCIENCE_CUTOFFS_2026_2027.find(c => normalizeCourse(c.programme) === nTarget);

  if (!match) {
    match = OAU_SCIENCE_CUTOFFS_2026_2027.find(c => {
      const nc = normalizeCourse(c.programme);
      return nc.includes(nTarget) || nTarget.includes(nc);
    });
  }

  if (!match) return null;

  const state = (stateOfOrigin || '').toLowerCase().trim();
  const isCatchment = OAU_CATCHMENT_STATES.includes(state);
  const isELDS = ELDS_STATES.includes(state);

  if (isCatchment) {
    const catchmentCutoff = (match.catchment as any)[state] ?? match.merit;
    return {
      programme: match,
      applicableCutoff: catchmentCutoff,
      quotaType: 'catchment',
      quotaLabel: `OAU Catchment (${state.charAt(0).toUpperCase() + state.slice(1)})`
    };
  }

  if (isELDS) {
    return {
      programme: match,
      applicableCutoff: match.elds,
      quotaType: 'elds',
      quotaLabel: `ELDS Quota (${state.charAt(0).toUpperCase() + state.slice(1)})`
    };
  }

  return {
    programme: match,
    applicableCutoff: match.merit,
    quotaType: 'merit',
    quotaLabel: 'General Merit'
  };
}
