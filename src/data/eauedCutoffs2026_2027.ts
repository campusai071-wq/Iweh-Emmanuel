/**
 * Emmanuel Alayande University of Education, Oyo (EAUED)
 * 2026/2027 Second Batch Admission Cut-Off Points
 */

export interface EauedCutoffProgramme {
  sNo: number;
  programme: string;
  utmeAggregate: number;
  meritCutoff: number;
  catchmentCutoff: number;
}

export const EAUED_SESSION = "2026/2027";
export const EAUED_INSTITUTION_NAME = "Emmanuel Alayande University of Education, Oyo (EAUED)";

export const EAUED_CUTOFFS_2026_2027: EauedCutoffProgramme[] = [
  { sNo: 1, programme: "B. Ed. Adult and Continuing Education", utmeAggregate: 150, meritCutoff: 33.00, catchmentCutoff: 31.25 },
  { sNo: 2, programme: "B. Ed. Early Childhood Education", utmeAggregate: 150, meritCutoff: 43.78, catchmentCutoff: 31.25 },
  { sNo: 3, programme: "B. Ed. Educational Management", utmeAggregate: 150, meritCutoff: 37.95, catchmentCutoff: 31.25 },
  { sNo: 4, programme: "B. Ed. Educational Technology", utmeAggregate: 150, meritCutoff: 40.23, catchmentCutoff: 31.25 },
  { sNo: 5, programme: "B. Ed. Primary Education", utmeAggregate: 150, meritCutoff: 38.83, catchmentCutoff: 31.25 },
  { sNo: 6, programme: "B. Ed. Special Education", utmeAggregate: 150, meritCutoff: 39.00, catchmentCutoff: 31.25 },
  { sNo: 7, programme: "B. Tech. (Ed.) Automobile Technology Education", utmeAggregate: 150, meritCutoff: 42.30, catchmentCutoff: 31.25 },
  { sNo: 8, programme: "B. Tech. (Ed.) Building Technology Education", utmeAggregate: 150, meritCutoff: 41.25, catchmentCutoff: 31.25 },
  { sNo: 9, programme: "B. Tech. (Ed.) Electrical and Electronic Technology Education", utmeAggregate: 150, meritCutoff: 40.48, catchmentCutoff: 39.13 },
  { sNo: 10, programme: "B. Tech. (Ed.) Metal Work Technology Education", utmeAggregate: 150, meritCutoff: 35.70, catchmentCutoff: 31.25 },
  { sNo: 11, programme: "B. Tech. (Ed.) Woodwork Technology Education", utmeAggregate: 150, meritCutoff: 34.00, catchmentCutoff: 31.25 },
  { sNo: 12, programme: "B.A. (Ed.) Arabic Education", utmeAggregate: 150, meritCutoff: 48.70, catchmentCutoff: 31.25 },
  { sNo: 13, programme: "B.A. (Ed.) Christian Religious Studies", utmeAggregate: 150, meritCutoff: 44.58, catchmentCutoff: 31.25 },
  { sNo: 14, programme: "B.A. (Ed.) Fine and Applied Arts", utmeAggregate: 150, meritCutoff: 42.18, catchmentCutoff: 31.25 },
  { sNo: 15, programme: "B.A. (Ed.) French", utmeAggregate: 150, meritCutoff: 45.65, catchmentCutoff: 31.25 },
  { sNo: 16, programme: "B.A. (Ed.) Islamic Studies", utmeAggregate: 150, meritCutoff: 45.70, catchmentCutoff: 39.45 },
  { sNo: 17, programme: "B.A. (Ed.) Music", utmeAggregate: 150, meritCutoff: 46.58, catchmentCutoff: 31.25 },
  { sNo: 18, programme: "B.A. (Ed.) Yoruba", utmeAggregate: 150, meritCutoff: 38.48, catchmentCutoff: 31.25 },
  { sNo: 19, programme: "B.LIS. Library and Information Science", utmeAggregate: 150, meritCutoff: 41.10, catchmentCutoff: 39.03 },
  { sNo: 20, programme: "B.Sc. (Ed.) Chemistry Education", utmeAggregate: 150, meritCutoff: 37.58, catchmentCutoff: 31.25 },
  { sNo: 21, programme: "B.Sc. (Ed.) Economics Education", utmeAggregate: 150, meritCutoff: 47.40, catchmentCutoff: 31.25 },
  { sNo: 22, programme: "B.Sc. (Ed.) Environmental Education", utmeAggregate: 150, meritCutoff: 38.83, catchmentCutoff: 35.78 },
  { sNo: 23, programme: "B.Sc. (Ed.) Geography Education", utmeAggregate: 150, meritCutoff: 46.75, catchmentCutoff: 31.25 },
  { sNo: 24, programme: "B.Sc. (Ed.) Home Economics Education", utmeAggregate: 150, meritCutoff: 36.75, catchmentCutoff: 31.25 },
  { sNo: 25, programme: "B.Sc. (Ed.) Human Kinetics/Physical Education", utmeAggregate: 150, meritCutoff: 37.25, catchmentCutoff: 31.25 },
  { sNo: 26, programme: "B.Sc. (Ed.) Integrated Science", utmeAggregate: 150, meritCutoff: 34.25, catchmentCutoff: 31.25 },
  { sNo: 27, programme: "B.Sc. (Ed.) Mathematics Education", utmeAggregate: 150, meritCutoff: 46.70, catchmentCutoff: 31.25 },
  { sNo: 28, programme: "B.Sc. (Ed.) Physics Education", utmeAggregate: 150, meritCutoff: 40.48, catchmentCutoff: 31.25 },
  { sNo: 29, programme: "B.Sc. Accounting", utmeAggregate: 170, meritCutoff: 51.35, catchmentCutoff: 36.00 },
  { sNo: 30, programme: "B.Sc. Biology", utmeAggregate: 160, meritCutoff: 44.33, catchmentCutoff: 35.88 },
  { sNo: 31, programme: "B.Sc. Chemistry", utmeAggregate: 160, meritCutoff: 43.58, catchmentCutoff: 33.00 },
  { sNo: 32, programme: "B.Sc. Economics", utmeAggregate: 160, meritCutoff: 42.00, catchmentCutoff: 33.00 }
];

export const getEauedCutoffByCourse = (courseName: string): EauedCutoffProgramme | null => {
  if (!courseName) return null;
  const query = courseName.toLowerCase().trim();
  const match = EAUED_CUTOFFS_2026_2027.find(item => {
    const cleanProg = item.programme.toLowerCase();
    return cleanProg.includes(query) || query.includes(cleanProg);
  });
  return match || null;
};
