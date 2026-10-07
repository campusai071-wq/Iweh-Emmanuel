// scripts/publish_oau_science_news.ts
import { db } from '../src/services/firebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { OAU_SCIENCE_CUTOFFS_2026_2027 } from '../src/data/oauCutoffs2026_2027';
import { generateSitemapsFiles } from './generate_sitemaps';

const articleId = 'oau-releases-2026-2027-cut-off-marks-faculty-of-science';
const slug = 'oau-releases-2026-2027-cut-off-marks-faculty-of-science';
const title = '🚨 OAU Releases 2026/2027 Cut-Off Marks for Faculty of Science: Official Merit, Catchment & ELDS Breakdown';

const tableRows = OAU_SCIENCE_CUTOFFS_2026_2027.map(p =>
  `| ${p.sn} | **${p.programme}** | ${p.merit.toFixed(2)}% | ${p.catchment.osun.toFixed(2)}% | ${p.catchment.oyo.toFixed(2)}% | ${p.catchment.ondo.toFixed(2)}% | ${p.catchment.ogun.toFixed(2)}% | ${p.catchment.ekiti.toFixed(2)}% | ${p.catchment.lagos.toFixed(2)}% | ${p.elds.toFixed(2)}% |`
).join('\n');

const fullContent = `# Obafemi Awolowo University (OAU), Ile-Ife, Nigeria
## FACULTY OF SCIENCE — DEAN'S OFFICE
### CUT-OFF MARKS FOR 2026/2027 ADMISSIONS EXERCISE

> **🏛️ OFFICIAL CIRCULAR:** Stamped and approved by **Professor O. A. Adesina**, Dean, Faculty of Science, Obafemi Awolowo University, Ile-Ife.

The Dean of the Faculty of Science at **Obafemi Awolowo University (OAU), Ile-Ife**, **Professor O. A. Adesina**, has officially released the approved departmental admission cut-off marks across all thirteen (13) degree programmes in the Faculty of Science for the **2026/2027 academic session**.

This official release provides the exact thresholds for **General Merit**, the six (6) Southwest **Catchment States** (Osun, Oyo, Ondo, Ogun, Ekiti, and Lagos), as well as **Educationally Less Developed States (ELDS)**.

---

### 🌟 Key Highlights & Analysis
* **Biochemistry:** Sets the highest threshold in the Faculty of Science with **50.93%** required across Merit, Catchment, and ELDS.
* **Microbiology:** Emerges as the second most competitive department with a cut-off mark of **50.78%**.
* **Science Laboratory Technology (SLT):** Pegged at **50.13%** across all quota categories.
* **Pure Sciences & Mathematics:** **Applied Geophysics, Botany, Chemistry, Engineering Physics, Geology, Industrial Chemistry, Mathematics, Physics, Statistics, and Zoology** all pegged at the standard baseline of **50.00%**.

---

### 📋 Full Programme-by-Programme Cut-Off Table (Faculty of Science)

| S/N | Course / Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${tableRows}

---

### 🧮 How OAU Calculates Aggregate Screening Scores (50:40:10 Model)

Obafemi Awolowo University determines undergraduate admission ranking through a three-component formula:

1. **JAMB UTME Score (50% Weight):**
   $$\\text{JAMB Contribution} = \\frac{\\text{UTME Score}}{400} \\times 50$$
2. **OAU Post-UTME Screening (40% Weight):**
   $$\\text{Post-UTME Contribution} = \\frac{\\text{Post-UTME Score}}{40} \\times 40$$
3. **O'Level Grade Points (10% Weight):**
   Calculated from your 5 required subjects where:
   - A1 = 10 points
   - B2 = 9 points
   - B3 = 8 points
   - C4 = 7 points
   - C5 = 6 points
   - C6 = 5 points
   $$\\text{O'Level Contribution} = \\frac{\\sum \\text{Points of 5 Subjects}}{50} \\times 10$$

Your final aggregate is the sum of all three scores on a 100% scale.

---

### 📌 Instructions for 2026/2027 OAU Aspirants

1. **Verify Your Composite Score:**
   Compare your calculated aggregate with the official departmental cut-off for your chosen course in the table above.
2. **Monitor Central Admissions Processing System (JAMB CAPS):**
   - Head over to \`https://caps.jamb.gov.ng/\` and log in with your registered email and password.
   - Verify that your O'Level WAEC/NECO/NABTEB results are displayed as uploaded.
   - Watch out for **Transfer Approval** or **Admission Offer** alerts.
3. **Change of Programme Considerations:**
   Candidates who fall slightly below the 50.93% mark for Biochemistry or 50.78% for Microbiology can explore Botany, Zoology, Chemistry, Industrial Chemistry, or Physics, which are benchmarked at 50.00%.

---

### 🔗 Related Tools & Resources
* **Official OAU Portal:** [oauife.edu.ng](https://www.oauife.edu.ng/)
* **OAU Aggregate Calculator & Cutoff Checker:** [campusai.com.ng/oau-aggregate-calculator](https://campusai.com.ng/oau-aggregate-calculator)
* **CampusAI Cutoff Engine:** [campusai.com.ng/calculator](https://campusai.com.ng/calculator)
* **JAMB CAPS Guide:** [campusai.com.ng/jamb-caps](https://campusai.com.ng/jamb-caps)`;

export const OAU_SCIENCE_NEWS_DOC = {
  id: articleId,
  slug,
  title,
  category: 'Federal',
  tags: ['OAU', 'Obafemi Awolowo University', 'Faculty of Science', 'Cut-Off Marks', 'Post-UTME', 'Admission 2026/2027'],
  universities: ['Obafemi Awolowo University (OAU)'],
  date: 'October 07, 2026',
  publishDate: 'October 07, 2026',
  createdAt: new Date('2026-10-07T08:45:00Z'),
  updatedAt: new Date('2026-10-07T08:45:00Z'),
  image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000',
  excerpt: 'Obafemi Awolowo University (OAU), Ile-Ife Faculty of Science has officially released the approved departmental cut-off marks for all 13 programmes for the 2026/2027 admissions exercise, signed by Dean Professor O. A. Adesina.',
  fullContent,
  isLive: true,
  isImportant: true,
  isBreaking: true,
  author: 'CampusAI Admissions Desk'
};

async function main() {
  console.log('[OAU Science News] Writing article to Firestore news collection...');
  const newsDocRef = doc(db, 'news', articleId);
  await setDoc(newsDocRef, {
    ...OAU_SCIENCE_NEWS_DOC,
    createdAt: Timestamp.fromDate(new Date('2026-10-07T08:45:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2026-10-07T08:45:00Z'))
  }, { merge: true });
  console.log('[OAU Science News] Successfully published to Firestore with ID:', articleId);

  console.log('[OAU Science News] Regenerating sitemaps...');
  await generateSitemapsFiles();
  console.log('[OAU Science News] Sitemaps updated!');
  process.exit(0);
}

main().catch(err => {
  console.error('[OAU Science News Error]:', err);
  process.exit(1);
});
