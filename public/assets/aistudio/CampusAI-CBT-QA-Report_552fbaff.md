# CampusAI CBT Simulator: QA Report

**Main verdict: FAIL — the seven-day plan did not reliably reflect the answers in this tested attempt.** The examination could be completed and saved, but a faulty question produced a false weakness, and later AI correction left the live score, saved score, and diagnosis inconsistent.

Tested through the normal [CBT Simulator](https://www.campusai.com.ng/cbt-simulator), after the user personally signed in. Evidence relates to saved attempt **#12**, displayed as **Oct 26, 09:48 PM**: a timed JAMB-style quick drill with **40 questions**, ten each in English Language, Mathematics, Physics, and Chemistry. Question references below use the result page’s global numbering, Q1–Q40.

## 1. Executive summary

CampusAI initially reported **39/40, rounded to 98%**, with English at 9/10 and the other three subjects at 10/10. Its only marked error, Q4, was not a demonstrated student mistake: options A and D both said **“privilege.”** I selected A; CampusAI initially required D. The correct spelling and “privilege of meeting” construction are independently supported by [Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/learner-english/privilege).

The seven-day plan nevertheless diagnosed an **idiom/collocation lapse** and prescribed 50 idiom/phrasal-verb questions. Q4 was a spelling item, while the actual idiom question, Q5, was answered correctly. Opening Q4’s ordinary step-by-step explanation then acknowledged both spellings as correct, changed the live key to A, and raised the live score to **40/40**. The diagnosis still said 98% and retained its false English weakness. Reloaded saved history still showed **39/40 and 390/400**.

The plan used the actual score and completion time, so it was not wholly disconnected from the attempt. But its central remedial recommendation was unsupported. This test does **not** establish that plans are identical across students or attempts.

## 2. What was successfully tested

A genuine examination was configured, started, answered independently, and submitted normally. All 40 question stems, options, selected answers, and visible initial keys were recorded. Calculations were independently checked rather than accepted from CampusAI. The interface confirmed **40/40 responses across four subjects** before submission.

Testing covered initial scoring and rounding, all four subject breakdowns, the generated diagnosis and seven-day plan, one step-by-step explanation, the visible longitudinal topic panel, existing history before and after submission, persistence after a normal reload, and Study Hub subject navigation.

No direct database, source-code, account-setting, delete, reset, question-report, or bulk-audit operation was performed. Normal submission created the requested new attempt. One requested explanation view unexpectedly changed live grading; this automatic behaviour is disclosed below rather than described as a read-only action.

## 3. What could not be tested, and why

**Further explanations:** Only Q4’s explanation was generated. Because opening it automatically adjusted a key and live score, further generation was stopped to respect the prohibition on altering records. A separate correct-response explanation sample, broad explanation reliability, and shared-key persistence are **NOT TESTED**.

**Genuine weakness remediation:** No reliable knowledge error was established in this attempt. The sole initial error was a defective duplicate-option item. No intentionally wrong answers were manufactured. Prioritisation across several genuine weak topics therefore remains **NOT TESTED**.

**Historical topic calculations and trends:** The visible history exposed scores and subject breakdowns, not the original earlier answer records or the trend formula. Pre-attempt longitudinal topic counts were not recorded. Numerical topic accuracy, trend labels, and immediate topic-profile updates cannot be independently validated.

**Full-length representativeness and repeatability:** This was the available 10-per-subject quick drill using a 120-minute timer, not a 180-question full-length mock. No second contrasting attempt, cross-account comparison, or human-student endurance study was performed.

Before login, the full simulator required an account. The offered guest-trial button did not expose questions during the observed attempt. Its cause remains unverified; the user then authenticated normally.

## 4. Independent score versus CampusAI’s reported score

### Initial marking arithmetic

| Subject | Attempted | Correct against initial displayed key | Incorrect against that key | Accuracy | Scaled score in history |
|---|---:|---:|---:|---:|---:|
| English Language, Q1–Q10 | 10 | 9 | 1 | 90% | 90/100 |
| Mathematics, Q11–Q20 | 10 | 10 | 0 | 100% | 100/100 |
| Physics, Q21–Q30 | 10 | 10 | 0 | 100% | 100/100 |
| Chemistry, Q31–Q40 | 10 | 10 | 0 | 100% | 100/100 |
| **Total** | **40** | **39** | **1** | **97.5%** | **390/400** |

**PASS for arithmetic against the initial key.** Displaying 98% is ordinary rounding of 97.5%, not an error. The reported six-second average pace is a reasonable rounding of 220 seconds ÷ 40 = 5.5 seconds. Subject scaling also reconciles.

**FAIL for marking validity:** Q4’s selected A is identical to keyed D. Accepting the equivalent correct spelling gives **40/40 under the intended keys**, not 39/40. This is not an unexplained weighting or missing-response issue.

That does not make this a clean, independently validated 40-item assessment. Q9 has no fully grammatical completion; Q13 lacks a quadrant and permits two answers; Q20 lacks the grouping needed for its intended algebraic answer. Excluding those three and duplicate-option Q4 leaves a **36/36 clean-item subset**, under the ordinary syllabus interpretations documented in the ledger. No confirmed learner knowledge error remains.

After Q4’s AI working, the **live report showed 40/40, 100%**; the **saved record remained 39/40, 390/400**. These are different scoring states, not rounding differences.

## 5. Accuracy of step-by-step explanations

**PARTIAL PASS for the one explanation inspected; the wider feature is NOT TESTED.** Q4’s explanation correctly said: “Option A ('privilege') and Option D ('privilege') are both correctly spelled.” It explained the target spelling rather than simply repeating a letter. It did not establish any student misconception, because the selected spelling was already correct.

However, the interface presented an automatic **“Syllabus Key Adjusted”** notice, changed D to A, and marked the answer “Correct (AI Verified).” Swapping one single key for another does not repair an item with two identical valid options. The item needs multiple-answer acceptance or withdrawal. The explanation’s etymological discussion was not separately verified; its spelling conclusion was.

Most importantly, this correction was not reconciled with the saved attempt or the already-generated plan. Whether the shared upstream question record changed persistently was not inspected and must not be assumed.

## 6. Accuracy of subject and topic diagnoses

The initial subject counts were arithmetically correct, but **the claimed English weakness was not evidence-led**. Q4 concerned spelling, not an idiom or collocation. Relevant English successes included Q3, reciprocal “each other”; Q5, “thin end of the wedge”; Q7, “belligerent”; Q8, “very annoyed”; and Q10, the vowel sound in “odour.” These do not support the asserted lapse.

Small descriptive topic samples can be reported, but not treated as mastery estimates:

| Independently classified topic | Evidence | Observed performance | Limitation |
|---|---|---|---|
| Idioms | Q5 | 1/1 correct | One item cannot establish broad mastery or weakness. |
| Intensifier/collocation | Q8 | 1/1 correct | No demonstrated lapse. |
| Gas laws | Q21, Q28 | 2/2 under intended assumptions | Too few items for a robust diagnosis. |
| Vapour pressure/equilibrium | Q29, Q30 | 2/2 | Descriptive only. |
| Electrolysis | Q32, Q36 | 2/2 assuming Cu²⁺ | Small sample; oxidation state should be explicit. |

The history panel’s labels **“General,” “Official Past Questions,”** and full question-instruction sentences are not useful syllabus-topic diagnoses. They do not tell a student whether to study trigonometry, gas laws, spelling, or another specific skill. Their numerical aggregates were not independently checked.

## 7. Detailed audit of the seven-day study plan

**Overall: FAIL for matching remediation to actual mistakes; PARTIAL PASS for broad score/pace adaptation.** A standard seven-day structure is not itself a defect. The issue is the unsupported content placed inside it.

| CampusAI’s recommendation | Evidence from the examination | Is it justified? | Explanation | Suggested correction |
|---|---|---|---|---|
| Prioritise English Lexis and Structure because of an idiom/collocation lapse. | Only initial error Q4 was a correctly selected spelling with duplicate options. Q5 and Q8 were correct. | **FAIL** | Neither the existence nor the type of the claimed weakness follows from the answers. | Quarantine Q4; state that no valid weakness was established. |
| Read newspaper editorials for 30 minutes daily. | No reading-comprehension or idiom deficit was demonstrated. | **PARTIAL PASS** | Reasonable enrichment, but not personalised remediation supported by this attempt. | Label optional; prescribe targeted work only after a valid diagnostic sample. |
| Days 1–2: recommended text and 50 idiom/phrasal-verb questions. | Q5’s idiom was correct; no phrasal-verb mistake was established. | **FAIL** | Two days are allocated to an unsupported gap. The named text/resource is not identified precisely. | Use a short valid diagnostic first; name the resource, exact skill, target accuracy, and review rule. |
| Days 3–4: hardest 5% of Physics/Chemistry questions, solved manually. | Q21–Q40 were all correct, including bridge, lens, electrolysis, and gas-volume calculations. | **PARTIAL PASS** | Challenge practice can help, but this is not established corrective work. “Hardest 5%” has no actionable selection method. | Offer optional extension with named questions, a count, duration, and learning objective. |
| Days 5–7: full 180-question timed mock for endurance. | Only 40 questions were taken, in 3m40s. | **PARTIAL PASS** | A full mock is a sensible next diagnostic, not evidence of an existing endurance weakness. It is unclear whether to take one mock or several. | Specify one mock, timing, a separate review period, and measurable accuracy/pace goals. |
| Use spare time to double-check Mathematics and Physics. | Both subjects were 10/10; measured pace was very fast. | **PARTIAL PASS** | Sensible general exam advice; speed alone does not prove shallow reasoning or careless calculation. | Separate precautionary advice from a diagnosed misconception. |
| Use practice and Study Hub resources. | A generic Hub exists, but the plan provided no question-specific resource route. Selecting English retained Mathematics questions. | **FAIL for the tested resource route** | The student could not reliably obtain the named English practice from the tested subject switch. | Fix subject/content synchronisation and deep-link validated topic sets. |

**Answers to the brief’s A–J checks:** A–C and G fail because the weak-topic diagnosis and activity choice do not follow the answers. D–E are only partially supported: there is a loose allocation across days, but no reason to spend two days remediating an unproven English gap, and limited time budgets elsewhere. F fails to qualify the single invalid error as insufficient evidence. H–I partially pass: 50 questions, 30 minutes, and a full mock are concrete, but “hardest 5%,” text selection, daily scheduling, target accuracy, and reassessment rules remain unclear. J fails on the tested Study Hub route; other resource paths were not exhaustively tested.

The “elite”/top-tier Medicine or Engineering readiness claims go beyond a short drill. “Excellent on this set” is supported; broad admission readiness and depth of reasoning are not established.

## 8. Historical tracking assessment

**PASS:** The new attempt appeared as #12 with its original time, subject counts, and 390/400 score. Eleven previous displayed records remained unchanged. The highest score increased from 260 to 390; the mean scaled score increased from 115 to 138 after rounding. These reconcile with the twelve visible records.

**FAIL:** The saved latest record did not follow the explanation-corrected live score. After a normal reload and completed history retrieval, #12 still showed English 9/10 and 39/40 overall while the earlier live result had shown 40/40.

**PARTIAL PASS on summary labelling:** “Average Accuracy 35%” matches the unweighted mean of attempt accuracies, 34.58%. Pooling all visible question counts instead gives 195/740 = 26.35%. This is an apparent definition/label issue, not a demonstrated arithmetic error: the interface should distinguish “mean attempt accuracy” from its label “Overall question precision.”

**NOT TESTED:** The “Declining” label for General English, 62 questions/73%; “Improving” for an instruction-labelled group, four questions/75%; and weak-topic percentages could not be reconstructed from raw earlier answers. Current perfect performance does not by itself disprove a historical trend. A three-question/0% weak group was shown without a specific small-sample caveat beyond the panel’s general “sample-size protection” claim; its threshold and trend methodology remain unknown.

## 9. Confirmed defects, with supporting evidence

| ID | Severity | Demonstrated defect | Evidence |
|---|---|---|---|
| D1 | **High** | Identical correct option rejected. | Q4: selected A “privilege”; initial key D “privilege”; initial status Incorrect. |
| D2 | **High** | Live score, diagnosis, and saved history diverge after explanation-driven correction. | Live 40/40; retained diagnosis 98%/minor English error; reloaded history 39/40,390/400. |
| D3 | **High** | Unsupported personalised diagnosis and English remediation. | Q4 spelling misdiagnosed as idiom/collocation; Q5/Q8 correct; days1–2 prescribe idioms/phrasal verbs. |
| D4 | **High** | Study Hub subject label and content disagree. | English selected and “English Language Past Questions” heading; same Mathematics bank, including inequality/trapezium items, remained on later recheck. |
| D5 | **Medium** | Malformed or ambiguous assessment content. | Q9 incomplete grammatical construction; Q13 both signs of cosine possible; Q20 displays “7 − q/4” instead of “(7−q)/4.” |
| D6 | **Medium** | Topic labels are not actionable syllabus skills. | “General,” “Official Past Questions,” and complete instruction sentences in the mastery/weakness panel. |

The explanation-view correction is a confirmed automatic **live-state effect**. A persistent change to any shared question database is not established. No destructive action or data loss was observed.

## 10. Potential issues requiring further testing

On a safe test environment, compare plans for several genuine performance patterns, including sparse topics, unanswered questions, differing subject strengths, and invalid items. Check whether corrections invalidate/rebuild diagnoses and synchronise history atomically.

Test correct and incorrect step-by-step explanations across subjects without permitting production key changes. Check alternative valid answers and whether AI can introduce wrong keys. Reconstruct historical topic and trend statistics from retained original responses and documented aggregation rules.

The JAMB attempt included Q27 labelled **POST_UTME 2011** in review. Verify the exam-bank filtering policy before calling this a content-selection defect. Reproduce the guest-trial access failure and Study Hub behaviour on fresh sessions and other subjects. Check approximation assumptions in Q15, equal-width histogram assumptions in Q19, ideal-gas wording in Q21, and copper valency in Q32/Q36.

## 11. Recommended improvements, ranked by severity

**Critical:** None demonstrated in this bounded test.

**High — fix first:** (1) Validate item uniqueness, accepted-answer sets, and key integrity before scoring or diagnosis; quarantine Q4 and repair affected results transparently. (2) Make explanation viewing non-mutating, or clearly separate it from authorised regrading; reconcile live score, saved score, and diagnosis when a correction is approved. (3) Require each weak-topic claim and remedial activity to cite valid missed questions; regenerate stale plans and abstain when evidence is insufficient. (4) Fix Study Hub subject/content synchronisation and clear stale banks during transitions.

**Medium:** Repair Q9/Q13/Q20; introduce validated syllabus-topic IDs; expose per-topic counts and confidence; document historical averages and trend rules; distinguish optional maintenance/challenge work from remediation. Specify daily durations, exact resources, question sets, success thresholds, and a reassessment step. Qualify score-band, reasoning-depth, and admission-readiness claims.

**Low:** Clarify average-accuracy wording and grouped-day instructions. Reproduce and explain the guest-trial failure and the mixed source label. Improve prompts that put instruction text under “Reading Passage / Excerpt.”

## 12. Overall assessment of the CBT Simulator

**Exam execution and initial arithmetic: PASS.** **Explanation quality: PARTIAL PASS for one inspected item only.** **Evidence-based diagnosis/seven-day plan and score reconciliation: FAIL.** **Numerical historical topic/trend accuracy and cross-attempt plan differentiation: NOT TESTED.**

CampusAI demonstrated some real adaptation to score and pace, but this run does not support trusting its claimed weak-topic diagnosis. A student who answered the valid items correctly was directed toward an unproven English deficit, and the system failed to reconcile its own correction. The appropriate next step is an assessment-integrity and state-consistency fix, followed by controlled retesting—not stronger claims of personalisation.

### Supporting evidence

The accompanying question ledger contains every question, options, selected response, initial CampusAI key, independent answer/rationale, and explanation availability. The evidence transcript preserves the exact plan, Q4 working, and history observations. Screenshots preserve the submitted 39/40 result, the later live 40/40 result, and the English/Mathematics Study Hub mismatch.
