> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# FutureQuest AI: continued testing report

19 October 2026, Asia/Calcutta. Scope: current local working tree and dedicated QA accounts/database. This report supersedes the earlier **blocked JUnit status** using the user's fresh test artifacts. Application code was not changed in this continuation; new test runners and reporting were added. No game was removed, no UI redesign was performed, and nothing was pushed/deployed.

## Overall result

The tested account/navigation/save workflows work, and every visible game can be completed at every difficulty. **The application does not pass game-quality and analysis acceptance:** targeted tests reproduce functional, data and content defects. These failures are not hidden by the successful smoke suite.

| Evidence | Result | What this establishes |
| --- | --- | --- |
| User-run Java Surefire | 11 tests; PASS; 0 failures/errors/skips | All 4 ConsentAndFeedbackTests and 7 KnownFailureRegressionTests succeeded |
| Fresh main Edge suite | 138 PASS, 0 FAIL | Registration/login/linking, representative play, navigation, responsive/accessibility/error states; includes 96 launch/render checks |
| Fresh full-game Edge matrix | 144 PASS, 0 FAIL | 24 games × Easy/Moderate/Medium/Hard and two additional Easy replays; actual UI completions and saved record/score/XP parent readback |
| Fresh browser boundaries | 13 PASS, 0 FAIL | Invalid inputs, invalid token, slow/offline recovery, tabs, speech fallback, parent linking/profile switching/login |
| Targeted gameplay/evidence probes | 0 PASS, 13 FAIL | Concrete acceptance failures listed below; expected-failure probes are not counted as passes |

## Backend Maven review

The copied [Surefire reports and review manifest](artifacts/continuation-maven/review.json) contain 11 passing test cases. All current `@Test` methods in the two source classes are represented, report timestamps are newer than those sources, and SHA-256 hashes are recorded. The counts match both XML and text summaries. **Backend test-suite verification: PASS. No backend JUnit failures were found.**

An overall Maven terminal exit code or `BUILD SUCCESS` line was not supplied, so this report does not invent one. It verifies the actual Surefire test stage. The old cached-JAR compilation failure remains historical in `artifacts/java-tests.log`; it is not the result of the supplied manual test run.

Services from the preceding session were already running. A duplicate startup attempt found the QA H2 file locked by the existing process; that separate `spring-boot:run` attempt exited unsuccessfully. It is not a failed Maven test. A duplicate frontend selected port 5174 and was stopped. Browser testing reused the existing development services at 5173/8080, with successful real API traffic. No database lock was forcibly removed.

Passing 11 focused Java tests does not validate every backend behavior. Browser-driven record readback now demonstrates an untested backend data problem: selected domain attribution and rich experiment telemetry remain incorrect/incomplete.

## Features working in executed workflows

- Child registration through nickname/avatar/age/PIN, Player Code creation, logout/login, incorrect PIN/code rejection and refresh of a signed-in session.
- Parent registration/login, correct child PIN linking, invalid-code/PIN rejection, switching between two linked profiles and denying an unlinked parent access.
- All 24 catalog cards, nine world filters, four unlocked difficulties, game entry and complete saved sessions at every difficulty.
- Confirmed completion rewards, score/null-score storage and linked-parent record readback for every one of the 144 sessions. Participation completion does not imply measured skill.
- Child dashboard tabs, discovery map/world browsing, rewards, interests, timeline and career-library navigation covered by the main browser suite.
- Questy API response and honest network-failure message, failed-save UI, dashboard retry, invalid-session recovery and cross-tab logout handling.
- Desktop/tablet/mobile viewport checks and the suite's ten automatic accessibility states. No uncaught browser exceptions in the main suite. This is not a manual accessibility certification.
- The earlier actual restart, career resource toggle/feedback and mobile touch results remain separately recorded in the previous fix summary; they are not falsely described as new runs here.

## Confirmed broken behavior and unmet quality requirements

These are newly executed browser probes, each with reproduction steps, actual payload/state and screenshot in [the raw quality artifact](artifacts/continuation-quality/results.json). The full completion matrix still passes because it exercises the normal completion path rather than these semantic expectations.

| ID | Severity / type | Expected | Actual | Status / screenshot |
| --- | --- | --- | --- | --- |
| CQ-01 Robot reset cancels an executing route | Medium / functional | Reset stops scheduled moves and keeps the current challenge at the starting cell | Reset after queuing a valid route changed progress from 1/5 to 2/5; target cell was 2. | FAIL · [capture](artifacts/continuation-quality/failure-1.png) |
| CQ-02 Spelling session aggregates earlier attempts and hints | High / stored skill evidence | Five correct words plus one failed attempt stores 6 attempts and 1 hint | Five correct words with one earlier wrong answer and one hint saved attempts=1, hintsUsed=0; expected 6 and 1. | FAIL · [capture](artifacts/continuation-quality/failure-2.png) |
| CQ-03 Puzzle difficulty changes actual task complexity | Medium / difficulty | Hard starts with a more complex task, not identical Easy prompt/options | Easy and Hard opening shape prompt and all three choices match exactly. | FAIL · [capture](artifacts/continuation-quality/failure-3.png) |
| CQ-04 Eco Rescue difficulty changes content | Medium / difficulty | Hard uses different constraints/scenarios from Easy | All four Easy/Hard environmental questions and their choices match exactly. | FAIL · [capture](artifacts/continuation-quality/failure-4.png) |
| CQ-05 Dream Designer difficulty changes content | Medium / difficulty | Hard adds actual design constraints | All four Easy/Hard design steps and choices match exactly. | FAIL · [capture](artifacts/continuation-quality/failure-5.png) |
| CQ-06 Business results depend on decisions | High / simulation fidelity | Different price/ingredient/poster choices produce different financial outcomes | Price 20 versus 60 and different ingredients/poster still send revenue=700, profit=200, customers=20. | FAIL · [capture](artifacts/continuation-quality/failure-6.png) |
| CQ-07 Science Hard controls match the experiment | Medium / mismatched content | A shadow experiment offers light/object controls, not surface-travel materials | Hard prompt: investigate light/shadows. Controls: Wood, Metal, Fabric. | FAIL · [capture](artifacts/continuation-quality/failure-7.png) |
| CQ-08 City completion validates the neighborhood plan | Medium / mission validation | Repeated houses alone do not satisfy a connected-neighborhood mission | Three House placements, no roads or services, yield Adventure complete and 40 XP. | FAIL · [capture](artifacts/continuation-quality/failure-8.png) |
| CQ-09 Music Maker produces audible playback | Medium / missing core mechanic | Instrument/rhythm controls start an audio context or playable audio | Drums plus Kick/Clap/Kick starts zero AudioContexts and has zero audio elements; source has no sound engine. | FAIL · [capture](artifacts/continuation-quality/failure-9.png) |
| CQ-10 Result button Choose another game opens the catalog | Medium / navigation | The action leads to the game catalog, not the same game difficulty picker | Choose another game opens Dream Designer with four difficulty cards and zero catalog cards. | FAIL · [capture](artifacts/continuation-quality/failure-10.png) |
| CQ-11 Science telemetry survives completion storage | High / missing evidence | Saved session retains the experiment prediction and observation for explainable analysis | Actual POST has predictions and observations; parent-read saved record has neither field. | FAIL · [capture](artifacts/continuation-quality/failure-11.png) |
| CQ-12 Interest Battle credits selected domains rather than every offered domain | High / incorrect interest attribution | Technology receives no selection evidence when the child always selects the non-technology alternative | All choices avoid TECHNOLOGY_LOGIC; parent playCounts still reports Technology & Logic=1. | FAIL · [capture](artifacts/continuation-quality/failure-12.png) |
| CQ-13 Puzzle age bands change task content | Medium / age content | Age 8–10 and 17+ receive meaningfully different age-appropriate task content | Ages 8–10, 11–13, 14–16 and 17+ have identical opening Puzzle Easy prompt/options. | FAIL · [capture](artifacts/continuation-quality/failure-13.png) |

Reset reproduction queues the route to the actual visible star, rather than assuming a fixed route length. The first exploratory probe used an overshooting route and was corrected before the final run; it is not retained as a false pass. Spelling evidence includes both the real POST and persisted parent-read counters. Music's missing sound is confirmed by the live instrumentation and engine source, not inferred from physical speaker availability.

## Every visible game

Each game below passed six full UI sessions: all four levels, plus two Easy replays. The assessment column records failures or limitations separately. Visual/artifact judgments are source-backed design review; no child enjoyment study was performed, so “boring” is not claimed as a measured result.

| Game | Normal complete/save | Broken behavior, repetition or quality | Difficulty / age reality | Improvement needed |
| --- | --- | --- | --- | --- |
| Code the Robot | 6/6 PASS | Functional FAIL: Reset during execution advances a cancelled challenge. Easy layouts repeat. | Grid size and obstacle count change across difficulties. Age changes goal parity only. | Cancel pending timers on reset/exit; solver-check varied layouts; score task outcomes separately from participation. |
| Puzzle Laboratory | 6/6 PASS | Quality FAIL: fresh Easy and Hard show identical prompt/options; all four age groups show the same opening puzzle. | Same generated bank at all levels; five/six rounds changes length. | Create validated puzzle families with explicit constraints; fix selection stride and predictable answer positions. |
| Spell Quest | 6/6 PASS | Data FAIL: six attempts and one hint recorded as one attempt and zero hints. Word banks vary. | Four 20-word banks; age offsets word selection rather than validating age content. | Aggregate attempts/hints for the whole session and retain per-word outcomes. |
| Speak & Shine | 6/6 PASS | Completes through real supported typed fallback. Exact Easy prompts repeat on replay. | Three prompts per difficulty; reasoning prompts change, ages share them. | Expand prompts and support clear recording errors; do not infer accent ability or automatic relevance. |
| Story Builder | 6/6 PASS | Completes and saves; exact Easy sequences repeat. Only first three of five scene sequences are used. | Scene length changes by level, although headings alone do not show this; hard uses a word-count completeness flag. | Allow scene editing, dialogue and alternative endings; rotate unseen scenes and preserve the artifact. |
| Dream Designer | 6/6 PASS | Quality FAIL: the same four choices occur on Easy and Hard and replay. | No implemented constraint progression; same color/space/pattern/light steps. | Use an editable visible design artifact; consider merging with Interior Designer after approval. |
| Eco Rescue | 6/6 PASS | Quality FAIL: the same four questions/options occur on Easy and Hard and replay. | Difficulty does not alter missions. | Sorting and resource consequences, with varied environmental scenarios. |
| Mini Entrepreneur | 6/6 PASS | Simulation FAIL: different decisions send identical revenue 700, profit 200, customers 20. | Same four planning choices at every difficulty. | Compute inventory, price, demand, costs and profit from decisions, and show trade-offs. |
| Career Role Challenge | 6/6 PASS | Completes/saves; fixed role choices recur. Preferred challenge is not retained as structured evidence. | Same five stages across levels. | Use genuine role samples or merge into optional discovery after approval; preserve selected preferences. |
| Build the City | 6/6 PASS | Quality FAIL: three houses with no roads/services complete the neighborhood mission for 40 XP. | Grid size and placement count change; resource limit never binds. | Editable placements, explicit service/connectivity goals and meaningful budget constraints. |
| Science Lab | 6/6 PASS | Content/data FAIL: Hard asks about shadows but offers Wood/Metal/Fabric; sent predictions/observations are missing from saved record. | Topic label changes; generic option sequence remains. | Match controls to the experiment, calculate observations and retain versioned experiment evidence. |
| Data Detective | 6/6 PASS | Completes/saves accuracy, but four static charts and some vague answer criteria repeat. | Same charts/options across levels; rotated order is not new content. | State measurable questions, validate answer keys and vary data and reasoning complexity. |
| Design an App | 6/6 PASS | Completes/saves; fixed four-stage choice flow, no editable screens. | Main brief changes; options largely do not. | Render linked screens and a usable prototype, with reviewable user-test choices. |
| Invent Something | 6/6 PASS | Completes via text idea and an improvement choice; invention text is not retained in the game record. | Four problem briefs, shared ages; no actual complexity model. | Retain artifacts/revisions; do not label word count as originality. |
| Team Leader Challenge | 6/6 PASS | Completes/saves; repeated option stages, no observable team consequences. | Scenario label changes but choices remain fixed. | Assign people/tasks and reflect consequences of delegation, help and conflict decisions. |
| Money Manager | 6/6 PASS | Slider allocation works, then fixed event choices; events do not modify the budget. | Same 1,000 budget and events across levels. | Apply expenses and require revising an allocation under varied constraints. |
| Interest Battle | 6/6 PASS | Analysis FAIL: selecting no technology activity still gives Technology & Logic one session of evidence. | Four fixed pairs; all difficulty labels use them. | Attribute evidence only to selected activities, keep preferences unscored and vary neutral pairings. |
| Curiosity Trail | 6/6 PASS | Completes/saves after a self-report click, without launching the suggested activity; exact replay repeats. | Same paths at all levels. | Launch the actual selected game; keep self-report distinct from verified completion. |
| Photo Mission | 6/6 PASS | Completes/saves; framing/light are text choices without an editable photo artifact. | Brief changes, fixed four choice lists. | Interactive framing, subject, background and light with visible results. |
| Fashion Studio | 6/6 PASS | Completes/saves; four text choice stages rather than a visible outfit editor. | Theme changes, repeated choice lists. | Render garment/color/pattern/accessory combinations under meaningful theme constraints. |
| Director's Cut | 6/6 PASS | Completes/saves; shared text-choice flow without actual shot ordering. | Initial brief changes, camera/reaction/sound choices repeat. | Editable storyboard and camera/sound preview. |
| Music Maker | 6/6 PASS | Feature FAIL: selecting instrument and beats starts no audio and renders no audio element; labels only. | Three/four/five beats; Medium and Hard share length. | Audible editable sequencer; treat rests as valid music, not errors. |
| Junior Chef | 6/6 PASS | Completes/saves; menu/sequence decisions are choices rather than cooking/ordering simulation. | Brief changes; hard budget/time constraints are not enforced. | Actual ordering/cost/time consequences or omit from headline collection after approval. |
| Interior Designer | 6/6 PASS | Completes/saves placement labels; cannot move/remove pieces; hard budget is not enforced. | Grid and number of placements change. | Editable furniture plan with access/cost constraints; consolidate Dream Designer after approval. |

## Repeated questions and difficulty findings

The precise examples reproduced here are Puzzle Laboratory's identical opening shape question on Easy/Hard and all four age bands, Eco Rescue's four identical questions on Easy/Hard, and Dream Designer's four identical design steps on Easy/Hard. Fresh playthrough artifacts also show recurring Easy prompt sequences across many replays.

Source review explains the repetition: Puzzle Laboratory creates 20 IDs from only eight distinct prompt/options combinations; several generators write seen history without using it to avoid repetition. The spelling/puzzle core selects using both advancing round index and growing history length, causing a stride of two. Spelling has 20 words per level, but an 80-entry inventory is not evidence of 80 independent age-validated challenges. Robot has four base layouts with only two goal variants per level. Speaking has three prompts per level. Story banks have five sequences per level but sessions always start with the first three.

Four difficulties are unlocked and all are completable. That is different from meaningful progression. Genuine structural changes exist in robot grid/obstacles and spelling vocabulary. Other games change scene length, placement count or just an initial brief. Photo/Fashion/Director/Chef share a choice-flow engine; City/Interior share placement mechanics; Science/App/Team/Role share similar option stages. Different names and preview illustrations do not make these distinct interactive simulations.

## Interest, skill and AI assessment

Current parent views are more cautious than the earlier fixed-strength implementation: unknown skill can remain null, repeated equal scores need not inflate the mean, and same-day sessions no longer become Strong Evidence. Those earlier regressions are documented and remain covered by the supplied Java and previous HTTP tests.

However, **the central interest-evidence pipeline is still unreliable for cross-domain games**. A fresh Interest Battle child chose creativity twice, communication once and nature once, with no technology choice. Parent analysis nevertheless credited technology, science and business because all offered `careerDomains` were counted. This needs selected-action attribution, not more generic recommendation text. Science predictions and observations are present in the UI completion payload but discarded from the game record, so a parent explanation cannot cite them. Spelling's stored attempts/hints are wrong. Arithmetic score means are still not an age-normalized skill assessment.

The live application uses Java rules and keyword chat. Python prediction rules and the synthetic RandomForest trainer remain separate from the live flow. No validated ML model, real training-data quality or scientifically established career prediction is claimed. Recommend activities/domains to explore with explicit evidence and uncertainty, never a permanent career.

## Prioritized improvements and acceptance criteria

1. **Repair evidence integrity first:** accumulate spelling outcomes for the whole session; persist versioned structured experiment/preference events; credit only chosen domains. Tests must distinguish high interest from skill, reject confidence from little evidence, and match every explanation to saved records.
2. **Repair game controls:** cancel robot timers on Reset/Exit and keep the current challenge unchanged; make Choose another game open the actual catalog. Add targeted browser regressions using the reproduced steps.
3. **Correct promised simulations:** derive business outcomes from decisions, match science controls/observations to experiments, provide audible rhythm editing, and validate city mission constraints. Do not turn them into more generic MCQs.
4. **Define four actual difficulty specifications per game:** vary constraints and reasoning, not only labels or repetition counts. Keep all levels unlocked. Validate solvability with a solver where applicable and use reviewed task answer keys.
5. **Improve replay and age content:** select genuinely unseen validated challenges, retain cross-session history and use explicit age-appropriate mission variants. Test each intended age band; different content alone does not prove developmental suitability.
6. **Focus the collection and UI on real artifacts:** photo framing, outfit canvas, scene editing, room planning and prototypes. Proposed merges/hiding from the earlier audit remain recommendations; no catalog change was authorized/applied in this continuation.
7. **Then expand verification:** complete age/difficulty coverage, physical-device speech/touch, screen-reader testing, production security and retention, admin/notification workflows and deployed storage/backup recovery.

## Coverage limits and artifacts

The full 144-session matrix uses age 11–13. The additional age probe verifies only Puzzle Laboratory's opening task across four bands; the full age × game × difficulty matrix remains **NOT RUN**. Physical microphones/speakers/cameras, actual mobile hardware and manual screen readers are **BLOCKED** by the execution environment. Unavailable/denied recognition callbacks and typed fallback are tested, not actual voice quality.

Full admin CRUD, notification ownership/lifecycle, load testing beyond previously recorded retry probes, external learning-site availability and production deployment remain **NOT RUN**. Profile settings, a separate measured My Strengths page, URL-based error pages, saved unfinished-game resume and durable resource completion are **NOT IMPLEMENTED**. About and How It Works are homepage sections.

External Google Fonts requests can be denied by the sandbox; these console/network failures are retained in artifacts. The main responsive checks still pass using available fallback rendering. Automated axe success does not establish all accessibility needs.

- [User-run Maven review, hashes and individual cases](artifacts/continuation-maven/review.json)
- [Fresh main browser assertions](artifacts/continuation-browser/browser-results.json) and [screenshots](artifacts/continuation-browser/screenshots/)
- [All 144 complete game sessions and observed content](artifacts/continuation-games/results.json) and [final parent readback](artifacts/continuation-games/parent-final.json)
- [Targeted failures, reproduction steps, actual state/payload and console/network errors](artifacts/continuation-quality/results.json)
- [Fresh boundary browser checks](artifacts/continuation-edge/results.json)
- [Fresh frontend lint log](artifacts/continuation-lint.log) and [build log](artifacts/continuation-build.log)
- [Earlier eight-report QA package](fix-summary.md), retained with its original execution history

Backend unit tests passed; normal browser workflows passed; the recorded game-quality/data failures remain open. This continuation makes no claim that all game behavior or analysis is correct.
