// scripts/publish_oau_cutoffs_news.ts
import { db } from '../src/services/firebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { generateSitemapsFiles } from './generate_sitemaps';

export const articleId = '20262027-obafemi-awolowo-university-oau-admission-cut-off-marks';
export const slug = '20262027-obafemi-awolowo-university-oau-admission-cut-off-marks';
export const title = 'OAU 2026/2027 Departmental Cut-Off Marks: Complete List for All Courses, Merit, Catchment and ELDS';

export const fullContent = `# OAU 2026/2027 Departmental Cut-Off Marks: Complete List for All Courses, Merit, Catchment and ELDS

**Published:** October 9, 2026 | **Source:** CampusAI News

## 📌 Overview

Obafemi Awolowo University (OAU), Ile-Ife, has published departmental admission cut-off points for the 2026/2027 academic session across its faculties and programmes.

The cut-off marks cover Accounting, Business Administration, Computer Engineering, Cybersecurity, Software Engineering, Law, Medicine and Surgery, Nursing Science, Dentistry, Pharmacy, Architecture, Mechanical Engineering, Mass Communication, Economics, Biochemistry and several other courses.

The figures are grouped under **Merit, Catchment Area and Educationally Less Developed States (ELDS)** categories, where applicable.

Candidates seeking admission into OAU for the 2026/2027 session should check the cut-off point for their chosen programme and the category relevant to them.

## 📊 OAU 2026/2027 Cut-Off Marks by Faculty

### 1. Faculty of Administration

The following are the cut-off marks for programmes in the Faculty of Administration.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Accounting | 66.78 | 64.00 | 63.20 | 58.45 | 63.20 | 59.63 | 55.70 | See below |
| Business Administration | 57.70 | 55.93 | 55.10 | 54.18 | 53.48 | 52.30 | 57.13 | See below |
| International Relations | 50.73 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | — |
| Local Government and Development Studies | 51.58 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | — |
| Public Administration | 52.10 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | — |

#### ELDS Cut-Off Marks for Accounting

| State | Cut-Off Mark |
|---|---:|
| Benue | 52.23 |
| Cross River | 54.68 |
| Ebonyi | 53.98 |
| Kogi | 61.05 |
| Kwara | 60.60 |

#### ELDS Cut-Off Marks for Business Administration

| State | Cut-Off Mark |
|---|---:|
| Bayelsa | 55.75 |
| Benue | 51.40 |
| Kogi | 53.83 |
| Kwara | 52.98 |
| Rivers | 55.18 |

### 2. Faculty of Computing Science and Engineering

Candidates applying for computing-related programmes should check the departmental cut-off marks below.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos |
|---|---:|---:|---:|---:|---:|---:|---:|
| Computer Engineering | 67.40 | 62.33 | 59.25 | 57.32 | 61.28 | 58.00 | 53.90 |
| Computer with Economics | 60.03 | 56.70 | 52.48 | 59.75 | 52.35 | 54.35 | 54.00 |
| Computer with Mathematics | 68.20 | 65.30 | 60.85 | 59.05 | 62.05 | 54.80 | 54.28 |
| Cybersecurity | 62.03 | 58.50 | 59.00 | 53.05 | 58.35 | 55.73 | 52.48 |
| Information and Communication Technology | 56.25 | 53.18 | 53.85 | 52.38 | 53.33 | 55.00 | 55.00 |
| Information Systems | 52.58 | 52.00 | 52.00 | 52.00 | 52.00 | 52.00 | 52.00 |
| Software Engineering | 68.08 | 65.28 | 61.00 | 55.65 | 62.23 | 56.13 | 52.45 |

#### ELDS Cut-Off Marks for Computing Science and Engineering

The following ELDS figures are listed by state for the programmes indicated.

**Computer Engineering**

| State | Cut-Off Mark |
|---|---:|
| Ebonyi | 63.78 |
| Bayelsa | 63.80 |
| Benue | 59.83 |
| Kogi | 65.55 |
| Kwara | 59.33 |

**Computer with Economics**

| State | Cut-Off Mark |
|---|---:|
| Ebonyi | 54.95 |
| Kogi | 59.93 |

**Computer with Mathematics**

| State | Cut-Off Mark |
|---|---:|
| Ebonyi | 60.08 |
| Bayelsa | 64.95 |
| Benue | 58.63 |
| Kogi | 62.38 |
| Cross River | 57.88 |
| Kwara | 67.90 |
| Kaduna | 55.18 |

**Cybersecurity**

| State | Cut-Off Mark |
|---|---:|
| Benue | 54.58 |
| Kogi | 57.48 |
| Rivers | 57.78 |
| Kwara | 53.73 |

**Software Engineering**

| State | Cut-Off Mark |
|---|---:|
| Ebonyi | 65.08 |
| Kogi | 61.30 |
| Kwara | 60.93 |

### 3. Faculty of Technology

The Faculty of Technology offers programmes in aerospace, agricultural and environmental engineering, chemical engineering, civil engineering, electrical and electronic engineering, food science and technology, materials science and engineering, and mechanical engineering.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Aerospace Engineering | 72.03 | 66.95 | 67.88 | 69.95 | 70.18 | 62.98 | 57.00 | 58.05 |
| Agricultural and Environmental Engineering | 51.45 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Chemical Engineering | 51.43 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Civil Engineering | 65.25 | 62.90 | 61.05 | 52.95 | 60.875 | 59.625 | 54.20 | 51.63 |
| Electrical and Electronic Engineering | 68.38 | 63.93 | 65.08 | 59.33 | 62.50 | 52.20 | 54.05 | 52.55 |
| Food Science and Technology | 50.50 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Materials Science and Engineering | 51.38 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Mechanical Engineering | 69.73 | 66.85 | 66.28 | 59.03 | 61.50 | 57.53 | 55.43 | 52.80 |

### 4. Faculty of Social Sciences

The cut-off marks for programmes in the Faculty of Social Sciences are listed below.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Demography and Social Statistics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Economics | 63.43 | 59.68 | 59.05 | 53.33 | 58.48 | 56.10 | 57.43 | 53.00 |
| Entrepreneurship | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Geography | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Political Science | 59.90 | 56.53 | 56.88 | 52.45 | 56.53 | 52.50 | 52.50 | 51.70 |
| Psychology | 51.33 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Sociology and Anthropology | 50.78 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Mass Communication | 62.38 | 58.85 | 59.25 | 53.73 | 56.40 | 51.55 | 50.33 | 53.09 |
| Film Production | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Broadcast Journalism | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 59.00 |
| Information Science and Media Studies | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 59.00 |

### 5. Faculty of Agriculture

The following cut-off marks apply to the listed Agriculture programmes.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Agricultural Economics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Agricultural Extension | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Animal Sciences | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Consumer Sciences | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Crop Production | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Forestry | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Soil Science | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

### 6. Faculty of Pharmacy

The Merit and Catchment Area cut-off marks for Pharmacy are as follows.

| Category | Area | Cut-Off Mark |
|---|---|---:|
| Merit | — | 76.23 |
| Catchment | Osun | 74.75 |
| Catchment | Oyo | 72.73 |
| Catchment | Ondo | 73.43 |
| Catchment | Ogun | 73.13 |
| Catchment | Ekiti | 71.35 |
| Catchment | Lagos | 62.03 |

#### Pharmacy ELDS Cut-Off Marks

| State | Cut-Off Mark |
|---|---:|
| Benue | 63.38 |
| Cross River | 61.08 |
| Ebonyi | 66.45 |
| Kaduna | 74.00 |
| Kogi | 69.98 |
| Kwara | 73.25 |
| Rivers | 67.13 |

### 7. Faculty of Arts

Candidates applying for programmes in the Faculty of Arts should check the following figures.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Drama | 56.83 | 56.80 | 53.95 | 51.98 | 52.55 | 50.25 | 51.33 | 50.60 |
| English Language | 59.88 | 57.30 | 56.28 | 53.33 | 52.25 | 54.63 | 53.23 | 51.83 |
| French | 50.45 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| German | 51.38 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Portuguese | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| History | 51.13 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Linguistics | 58.28 | 55.35 | 55.60 | 51.50 | 51.88 | 51.55 | 54.60 | 50.80 |
| Yoruba | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Music | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Philosophy | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.90 |
| Literature in English | 52.05 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Religious Studies | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

### 8. Faculty of Environmental Design and Management

The cut-off marks for the Faculty of Environmental Design and Management are presented below.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Architecture | 69.18 | 67.18 | 66.80 | 59.03 | 65.28 | 64.20 | 63.25 | 58.45 |
| Building | 51.70 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Estate Management | 52.13 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Fine and Applied Arts | 50.50 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Quantity Surveying | 52.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Surveying and Geoinformatics | 51.30 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Urban and Regional Planning | 52.78 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

### 9. College of Health Sciences

The College of Health Sciences has published cut-off marks for Medicine and Surgery, Nursing Science, Dentistry, Medical Rehabilitation, Occupational Therapy, and Human Nutrition and Dietetics.

#### Merit and Catchment Area Cut-Off Marks

| Programme | Category | Area | Cut-Off Mark |
|---|---|---|---:|
| Medicine and Surgery | Merit | — | 87.85 |
| Medicine and Surgery | Catchment | Osun | 86.55 |
| Medicine and Surgery | Catchment | Ondo | 86.55 |
| Medicine and Surgery | Catchment | Ekiti | 86.93 |
| Medicine and Surgery | Catchment | Oyo | 84.43 |
| Medicine and Surgery | Catchment | Ogun | 86.45 |
| Medicine and Surgery | Catchment | Lagos | 81.95 |
| Dentistry | Merit | — | 80.73 |
| Dentistry | Catchment | Osun | 80.45 |
| Dentistry | Catchment | Ondo | 79.48 |
| Dentistry | Catchment | Ekiti | 80.13 |
| Dentistry | Catchment | Oyo | 77.48 |
| Dentistry | Catchment | Ogun | 79.48 |
| Dentistry | Catchment | Lagos | 76.53 |
| Nursing Science | Merit | — | 79.55 |
| Nursing Science | Catchment | Osun | 78.43 |
| Nursing Science | Catchment | Ondo | 77.63 |
| Nursing Science | Catchment | Ekiti | 76.525 |
| Nursing Science | Catchment | Oyo | 77.78 |
| Nursing Science | Catchment | Ogun | 75.80 |
| Nursing Science | Catchment | Lagos | 72.20 |
| Medical Rehabilitation | Merit | — | 74.70 |
| Medical Rehabilitation | Catchment | Osun | 74.33 |
| Medical Rehabilitation | Catchment | Ondo | 73.70 |
| Medical Rehabilitation | Catchment | Ekiti | 71.38 |
| Medical Rehabilitation | Catchment | Oyo | 73.60 |
| Medical Rehabilitation | Catchment | Ogun | 72.93 |
| Medical Rehabilitation | Catchment | Lagos | 62.50 |
| Occupational Therapy | Merit | — | 72.90 |
| Occupational Therapy | Catchment | Osun | 72.63 |
| Occupational Therapy | Catchment | Ondo | 72.63 |
| Occupational Therapy | Catchment | Ekiti | 69.975 |
| Occupational Therapy | Catchment | Oyo | 72.38 |
| Occupational Therapy | Catchment | Ogun | 72.63 |
| Occupational Therapy | Catchment | Lagos | 60.13 |
| Human Nutrition and Dietetics | Merit | — | 69.50 |
| Human Nutrition and Dietetics | Catchment | Osun | 68.45 |
| Human Nutrition and Dietetics | Catchment | Ondo | 62.50 |
| Human Nutrition and Dietetics | Catchment | Ekiti | 62.23 |
| Human Nutrition and Dietetics | Catchment | Oyo | 66.80 |
| Human Nutrition and Dietetics | Catchment | Ogun | 65.80 |
| Human Nutrition and Dietetics | Catchment | Lagos | 55.30 |

### 10. Faculty of Law

The cut-off marks for Law for the 2026/2027 academic session are listed below.

#### Merit and Catchment Area

| Category | Area | Cut-Off Mark |
|---|---|---:|
| Merit | — | 77.65 |
| Catchment | Osun | 76.875 |
| Catchment | Oyo | 76.53 |
| Catchment | Ondo | 75.05 |
| Catchment | Ogun | 75.78 |
| Catchment | Ekiti | 75.53 |
| Catchment | Lagos | 69.68 |

#### Law ELDS Cut-Off Marks

| State | Cut-Off Mark |
|---|---:|
| Bayelsa | 68.40 |
| Benue | 75.88 |
| Ebonyi | 75.90 |
| Gombe | 63.13 |
| Kaduna | 57.05 |
| Kebbi | 53.43 |
| Kogi | 76.10 |
| Kwara | 76.83 |
| Niger | 58.15 |
| Plateau | 73.83 |
| Rivers | 71.85 |
| Taraba | 67.03 |

### 11. Faculty of Science

The following cut-off marks apply to the listed programmes in the Faculty of Science.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Applied Geophysics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Biochemistry | 50.93 | 50.93 | 50.93 | 50.93 | 50.93 | 50.93 | 50.93 | 50.93 |
| Botany | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Chemistry | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Engineering Physics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Geology | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Industrial Chemistry | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Mathematics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Microbiology | 50.78 | 50.78 | 50.78 | 50.78 | 50.78 | 50.78 | 50.78 | 50.78 |
| Physics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Science Laboratory Technology | 50.13 | 50.13 | 50.13 | 50.13 | 50.13 | 50.13 | 50.13 | 50.13 |
| Statistics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Zoology | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

### 12. Faculty of Education

The following cut-off marks apply to the listed programmes in the Faculty of Education.

| Programme | Merit | Osun | Oyo | Ondo | Ogun | Ekiti | Lagos | ELDS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Education Economics | 54.38 | 51.20 | 52.00 | 52.00 | 52.00 | 53.63 | 51.00 | 50.00 |
| Education Geography | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education History | 58.60 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Religious Studies | 55.43 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education English | 57.58 | 50.70 | 53.73 | 53.78 | 51.05 | 52.33 | 53.73 | 50.00 |
| Education French | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Yoruba | 51.90 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Political Science | 53.18 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Fine Arts | 55.30 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Music | 52.65 | 50.25 | 50.50 | 50.50 | 50.50 | 50.50 | 50.50 | 50.00 |
| Adult Education | 60.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Guidance and Counselling | 55.43 | 50.20 | 53.40 | 53.50 | 55.13 | 54.18 | 53.50 | 50.00 |
| Educational Management | 58.53 | 52.30 | 55.75 | 54.10 | 53.45 | 55.75 | 52.50 | 50.00 |
| Educational Technology | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Library and Information Science | 54.85 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Social Studies and Civic Education | 54.03 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Integrated Science | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Language and Communication Arts | 56.48 | 52.93 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Early Childhood and Primary Education | 56.01 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Physical and Health Education | 51.73 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Human Kinetics Education | 53.63 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Health Education | 53.50 | 51.75 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Mathematics | 59.23 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Biology | 54.13 | 52.75 | 52.90 | 51.00 | 51.58 | 51.00 | 51.00 | 50.00 |
| Education Chemistry | 58.15 | 53.88 | 51.00 | 54.53 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Physics | 55.10 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Agricultural Science | 55.18 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Computer Education | 53.33 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |
| Education Home Economics | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 51.00 | 50.00 |

## 🏆 Courses with High Merit Cut-Off Marks at OAU

Based on the listed 2026/2027 figures, the following programmes have particularly high Merit cut-off points.

| Programme | Merit Cut-Off Mark |
|---|---:|
| Medicine and Surgery | 87.85 |
| Dentistry | 80.73 |
| Nursing Science | 79.55 |
| Law | 77.65 |
| Pharmacy | 76.23 |
| Medical Rehabilitation | 74.70 |
| Occupational Therapy | 72.90 |
| Aerospace Engineering | 72.03 |
| Mechanical Engineering | 69.73 |
| Architecture | 69.18 |
| Computer with Mathematics | 68.20 |
| Software Engineering | 68.08 |
| Electrical and Electronic Engineering | 68.38 |
| Computer Engineering | 67.40 |
| Accounting | 66.78 |
| Civil Engineering | 65.25 |
| Economics | 63.43 |
| Mass Communication | 62.38 |
| Cybersecurity | 62.03 |
| Computer with Economics | 60.03 |
| Political Science | 59.90 |
| Business Administration | 57.70 |

## 🎯 What OAU Aspirants Should Know

Candidates seeking admission for the 2026/2027 academic session should take the following steps:

1. **Identify your programme:** Find your chosen course in the relevant faculty table.
2. **Check your category:** Compare your aggregate with the Merit, Catchment Area or applicable ELDS cut-off point.
3. **Confirm your state category:** Catchment and ELDS figures differ by programme and state.
4. **Monitor your admission status:** Check JAMB CAPS and the university's admission portal for updates.
5. **Keep your records ready:** Ensure your JAMB details and O'Level results are accurate and available when required.

Meeting a departmental cut-off point does not automatically guarantee admission. Candidates must also meet the applicable admission requirements and complete the required procedures.

## ❓ Frequently Asked Questions

### What is the OAU cut-off mark for 2026/2027?

OAU has different departmental cut-off points for different programmes. Candidates should check the figure for their chosen course and admission category.

### What is the OAU cut-off mark for Medicine and Surgery?

The Merit cut-off point for Medicine and Surgery is 87.85. The listed Catchment Area cut-off points range from 81.95 for Lagos to 86.93 for Ekiti.

### What is the OAU cut-off mark for Nursing Science?

The Merit cut-off point for Nursing Science is 79.55. The listed Catchment Area figures vary by state.

### What is the OAU cut-off mark for Law?

The Merit cut-off point for Law is 77.65. The Catchment Area cut-off points differ by state, while the listed ELDS figures also vary by state.

### What is the OAU cut-off mark for Computer Engineering?

The Merit cut-off point for Computer Engineering is 67.40. The Catchment Area figures vary by state.

### Does meeting the cut-off point guarantee admission?

No. Meeting the departmental cut-off point does not automatically guarantee admission. Candidates must satisfy the other applicable requirements and follow the university's admission process.

## 🛠️ Useful CampusAI Tools

Candidates can use the following CampusAI resources during their admission preparation:

- **[Aggregate Calculator](https://campusai.com.ng/calculator):** Calculate your admission aggregate where the required formula is available.
- **[OAU Aggregate Calculator](https://campusai.com.ng/oau-aggregate-calculator):** Calculate your specific 50:40:10 aggregate score.
- **[University Directory](https://campusai.com.ng/universities):** Explore Nigerian universities and admission information.
- **[Admission Checklist](https://campusai.com.ng/admission-checklist):** Review important admission preparation steps.
- **[JAMB CAPS Resource](https://campusai.com.ng/jamb-caps):** Access information about the Central Admissions Processing System.

## 💬 Join the CampusAI Discussion Hub

Admission information is more useful when students share questions, experiences and updates.

💬 **Comment below:** Which OAU course did you apply for, and what is your aggregate score?

👍 **Like this article** if you found it useful.

📲 **Share this article** with other OAU aspirants, students, parents and friends who may need these cut-off marks.

🎓 Join the discussion and help other candidates stay informed.

## 🔗 Follow CampusAI for Daily Admission Updates

🌐 **Website:** https://campusai.com.ng

📘 **Facebook:** https://www.facebook.com/profile.php?id=61572405902527

🐦 **X:** https://x.com/campus84670

📲 **WhatsApp Channel:** https://whatsapp.com/channel/0029VbD6bCD1NCraoIlpD218

🎵 **TikTok:** https://www.tiktok.com/@campusai.ng

▶️ **YouTube:** https://www.youtube.com/@CampusAI-h5o

## 📝 Editor's Note

Candidates should carefully check the cut-off point applicable to their selected programme and admission category. Continue monitoring OAU admission updates and JAMB CAPS for information about the 2026/2027 admission exercise.

**CampusAI — Your Admission Journey, Smarter.**`;

export const OAU_ARTICLE_DOC = {
  id: articleId,
  slug,
  title,
  category: 'Federal',
  tags: ['OAU', 'Obafemi Awolowo University', 'Cut-Off Marks', 'OAU Cut Off 2026', 'Post-UTME', 'Admission 2026/2027', 'Great Ife'],
  universities: ['Obafemi Awolowo University (OAU)'],
  date: 'October 09, 2026',
  publishDate: 'October 09, 2026',
  createdAt: new Date('2026-10-09T08:00:00Z'),
  updatedAt: new Date('2026-10-09T08:00:00Z'),
  image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
  images: ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'],
  excerpt: 'Obafemi Awolowo University (OAU), Ile-Ife, has published departmental admission cut-off points for the 2026/2027 academic session across all faculties and programmes.',
  fullContent,
  isLive: true,
  isImportant: true,
  isBreaking: true,
  isTicker: true,
  author: 'CampusAI News'
};

async function main() {
  console.log('[OAU Master News] Publishing updated article to Firestore news collection...');
  const newsDocRef = doc(db, 'news', articleId);
  await setDoc(newsDocRef, {
    ...OAU_ARTICLE_DOC,
    createdAt: Timestamp.fromDate(new Date('2026-10-09T08:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2026-10-09T08:00:00Z'))
  }, { merge: true });
  console.log('[OAU Master News] Successfully published to Firestore with ID:', articleId);

  console.log('[OAU Master News] Regenerating sitemaps...');
  await generateSitemapsFiles();
  console.log('[OAU Master News] Done!');
  process.exit(0);
}

if (process.argv[1] && process.argv[1].endsWith('publish_oau_cutoffs_news.ts')) {
  main().catch(err => {
    console.error('[OAU Master News Error]:', err);
    process.exit(1);
  });
}
