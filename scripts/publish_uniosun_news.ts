// scripts/publish_uniosun_news.ts
import { db } from '../src/services/firebaseConfig';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { UNIOSUN_CUTOFFS_2026_2027 } from '../src/data/uniosunCutoffs2026_2027';

const articleId = 'uniosun-20262027-cut-off-marks-official-general-merit-catchment-list';
const slug = 'uniosun-20262027-cut-off-marks-official-general-merit-catchment-list';
const title = '🚨 UNIOSUN 2026/2027 Cut-Off Marks Released: Official General Merit & Catchment List for All 107 Programmes';

// Build Markdown table for all 107 programmes
let tableRows = UNIOSUN_CUTOFFS_2026_2027.map(p => 
  `| ${p.sn} | **${p.programme}** | ${p.faculty} | ${p.generalCutoff.toFixed(1)} | ${p.catchmentCutoff.toFixed(1)} |`
).join('\n');

const fullContent = `# Osun State University (UNIOSUN), Osogbo
## DIRECTORATE OF ACADEMIC AFFAIRS — ADMISSIONS OFFICE
### GENERAL MERIT AND INDIGENE/CATCHMENT CUT-OFF MARKS FOR ALL PROGRAMMES FOR THE 2026/2027 ADMISSION EXERCISE

> **🏛️ OFFICIAL ADMISSIONS RELEASE:** Approved by the Vice-Chancellor and officially signed by **A.A. Adewuyi (Deputy Registrar)** on **October 7, 2026**.

The management and Admissions Committee of **Osun State University (UNIOSUN)** have officially published the approved **General Merit** and **Indigene/Catchment Cut-Off Marks** for all 107 accredited undergraduate degree programmes for the **2026/2027 academic session**.

---

### 🌟 Key Highlights & High-Demand Programmes
* **B.Sc. Nursing:** General Merit: **77.4%** | Osun Catchment: **74.4%**
* **LLB (Bachelor of Law):** General Merit: **77.1%** | Osun Catchment: **73.0%**
* **B.Sc. Radiography & Radiation Science:** General Merit: **74.5%** | Osun Catchment: **70.9%**
* **B.MLS (Medical Laboratory Science):** General Merit: **73.8%** | Osun Catchment: **70.0%**
* **Common & Islamic Law:** General Merit: **71.3%** | Osun Catchment: **66.5%**
* **B.Sc. Accounting:** General Merit: **69.0%** | Osun Catchment: **61.0%**
* **B.Sc. Mass Communication:** General Merit: **68.7%** | Osun Catchment: **63.4%**
* **B.Sc. International Relations & Diplomacy:** General Merit: **68.0%** | Osun Catchment: **59.8%**
* **B.Sc. Public Relations:** General Merit: **67.6%** | Osun Catchment: **60.8%**
* **B.Eng. Mechatronics Engineering:** General Merit: **66.8%** | Osun Catchment: **58.9%**
* **B.Sc. Criminology & Security Studies:** General Merit: **66.7%** | Osun Catchment: **59.4%**
* **B.Sc. Software Engineering:** General Merit: **66.1%** | Osun Catchment: **59.8%**
* **B.Sc. Computer Science:** General Merit: **65.6%** | Osun Catchment: **59.2%**
* **B.Sc. Pharmacology:** General Merit: **65.7%** | Osun Catchment: **57.6%**
* **B.Eng. Civil Engineering:** General Merit: **64.0%** | Osun Catchment: **57.7%**

---

### 📋 Full Programme-by-Programme Cut-Off Breakdown (All 107 Courses)

| S/N | Programme / Course | Faculty | General Merit Cut-Off (%) | Osun Indigene / Catchment (%) |
| :---: | :--- | :--- | :---: | :---: |
${tableRows}

---

### 📌 Crucial Notes for UNIOSUN 2026/2027 Candidates

1. **General Merit vs. Osun Catchment Quota:**
   - **General Merit Cut-Off:** Applies to all Nigerian applicants regardless of state of origin.
   - **Catchment / Indigene Cut-Off:** Concessionary cut-off marks strictly reserved for candidates who are verified indigenes of **Osun State**.
2. **Admission Status on JAMB CAPS:**
   - Candidates who meet or exceed their respective departmental cut-off score should regularly check the **Central Admissions Processing System (JAMB CAPS)** at \`https://caps.jamb.gov.ng/\`.
   - Ensure your O'Level WAEC/NECO/NABTEB results have been successfully uploaded to your JAMB profile at an accredited CBT Centre.
3. **Change of Course Window:**
   - Candidates who missed the cut-off for competitive courses (e.g. Nursing, Law, MLS, Pharmacy) are advised to consider available alternative programmes where their aggregate scores meet the threshold.

---

### 🔗 Useful Links for Candidates
* **Official UNIOSUN Portal:** [admissions.uniosun.edu.ng](https://admissions.uniosun.edu.ng/)
* **CampusAI Cutoff & Aggregate Engine:** [campusai.com.ng/calculator](https://campusai.com.ng/calculator)
* **UNIOSUN Aggregate Calculator:** [campusai.com.ng/uniosun-aggregate-calculator](https://campusai.com.ng/uniosun-aggregate-calculator)`;

export const UNIOSUN_NEWS_DOC = {
  id: articleId,
  slug,
  title,
  category: 'State',
  tags: ['UNIOSUN', 'Cut-Off Marks', 'Post-UTME', 'Admission 2026', 'Osun State University'],
  universities: ['Osun State University (UNIOSUN)'],
  date: 'October 07, 2026',
  publishDate: 'October 07, 2026',
  createdAt: new Date('2026-10-07T08:30:00Z'),
  updatedAt: new Date('2026-10-07T08:30:00Z'),
  image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
  excerpt: 'Osun State University (UNIOSUN) Directorate of Academic Affairs Admissions Office has released the official General Merit and Indigene/Catchment cut-off marks for all 107 programmes for the 2026/2027 admission exercise, signed by Deputy Registrar A.A. Adewuyi on October 7, 2026.',
  fullContent,
  isLive: true,
  isImportant: true,
  isBreaking: true,
  author: 'CampusAI Admissions Desk'
};

async function main() {
  console.log('[UNIOSUN News] Writing article to Firestore news collection...');
  const newsDocRef = doc(db, 'news', articleId);
  await setDoc(newsDocRef, {
    ...UNIOSUN_NEWS_DOC,
    createdAt: Timestamp.fromDate(new Date('2026-10-07T08:30:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2026-10-07T08:30:00Z'))
  }, { merge: true });
  console.log('[UNIOSUN News] Successfully published to Firestore with ID:', articleId);
}

main().catch(err => {
  console.error('[UNIOSUN News Error]:', err);
  process.exit(1);
});
