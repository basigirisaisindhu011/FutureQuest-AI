# FutureQuest AI testing plan

Baseline: 17 October 2026, Asia/Calcutta. This is an execution plan, not a claim that the listed cases passed. Only the command results and 40 named smoke checks in INSPECTION_REPORT.md/local-smoke-results.json have been executed. Every browser case below is NOT RUN. Known failures stay open until a fix and rerun demonstrate the expected behavior.

## Setup, evidence and execution order

1. Start backend and frontend using INSPECTION_REPORT.md. Use a fresh local H2 process for each isolated regression round; stopping it discards accounts and records. Do not run against a shared or production database. Preserve the current dirty working tree.
2. Record OS, browser/version, Node/Java/Python versions, commit plus dirty diff, API base URL, start time, backend startup log and test-data IDs. Never attach PINs, password hashes, passwords or bearer tokens to shared evidence.
3. Use browser profiles for child A/child B/parent A/parent B. Create unique nicknames, player codes, parent usernames/emails. Cover age groups 8-10, 11-13, 14-16, 17+; also blank/invalid age values. Initial child sessions require no linked parent. Give only parent A access to child A; parent B starts unlinked.
4. P0: startup, authentication, unauthorized access, role assignment, game save, persistence truth and parent isolation. P1: all games/difficulties, analysis correctness, API failure handling, dashboard and question-bank coverage. P2: accessibility, responsiveness, performance and supporting features.
5. For each execution record case ID, input, expected result, actual result, PASS/FAIL/BLOCKED/NOT RUN, date, screenshot/video where useful, browser console, HTTP method/status and redacted response, and linked defect. A HTTP 200 alone is not enough: inspect schema and saved state. A displayed success alone is not enough: inspect API and subsequent reads.
6. Repeat critical workflows in Chrome and Edge desktop. Check Firefox and Safari/iOS for graceful speech limitations; Android Chrome and narrow desktop viewport for layout. Test on localhost/secure browser context for microphone features.

Repeatable checks:

```powershell
# From project root; application must already be running
python tools/local_smoke.py
# Backend compilation and existing tests
Set-Location backend
mvn.cmd test
# Frontend bundle and lint (lint currently blocked by missing tooling)
Set-Location ..\frontend
npm.cmd run build
npm.cmd run lint
```

The smoke run deliberately returns failure for current defects and creates accounts/sessions, including a negative completion probe and an ADMIN registration probe. Restart H2 to clear disposable records. It does not execute browser playthroughs. Capture command exit status immediately; a later successful shell command can mask an earlier nonzero exit.

## Registration and login

| ID | Steps/data | Expected result | Priority |
| --- | --- | --- | --- |
| AUTH-01 | Landing -> create child, choose nickname/avatar/each age, enter four-digit PIN | 201, unique player code, child dashboard and authenticated profile, no parent gate | P0 |
| AUTH-02 | Blank/whitespace nickname, missing avatar/age, PIN blank/3/5 digits/letters; very long nickname | Field/API validation; no partial account/profile or silent defaults; limits documented | P0 |
| AUTH-03 | Register two children with same nickname | Distinct identities/codes; neither overwrites or signs into the other | P0 |
| AUTH-04 | Login using player code, lowercase/whitespace code, wrong PIN, unknown code; duplicate nickname login | Correct account only, invalid credentials denied, ambiguous nickname cannot pick an unintended account | P0 |
| AUTH-05 | Parent signup, duplicate username/email, malformed email, short password, blank role | Valid registration works; invalid submissions get useful validation, no duplicate identities | P0 |
| AUTH-06 | Submit ADMIN, ROLE_ADMIN, unknown and CHILD roles via public signup | Privileged roles rejected; unsupported generic child flow does not create unusable account | P0, ADMIN currently fails |
| AUTH-07 | Parent login with username/email, wrong password, unknown account | Correct role dashboard, unauthorized requests denied without exposing which account exists | P0 |
| AUTH-08 | Refresh signed-in page; logout; browser Back; manipulate stored user role/token | UI/session recovery is consistent; backend authorization remains authoritative | P0 |
| AUTH-09 | Expired, corrupted, missing JWT; token for removed user; restart H2 with old localStorage | Clear recovery/login path; no infinite loading or false authenticated state | P1 |
| AUTH-10 | Concurrent registration and repeated submit clicks | Unique codes/accounts; controls prevent unintended duplicates; collisions handled | P1 |

## Games and difficulty coverage

Execute the shared checklist for every catalog row at EASY, MODERATE, MEDIUM and HARD. Repeat age-sensitive content at all four supported ages. Use catalog source as the inventory; do not assume README games are reachable. All browser cells are NOT RUN. API robot question checks do not change this status.

For each game/difficulty:

1. Open from its world/category, verify correct title and freely selectable difficulty with no previous completion. Verify category/world navigation can reach it and Back/Exit return correctly.
2. Capture task count, instructions, content, controls, progress and expected difficulty variation. Test correct, incorrect, empty, boundary and rapid repeated actions. No dead ends or impossible tasks.
3. Finish once, inspect POST payload/response, re-read child profile, timeline, analysis and parent activity. Match game ID/category/domains/difficulty, null versus real score, duration, attempts/hints/choices, stars and XP.
4. Exit before completion: no completed reward. Replay: distinct record, intended XP/replay counts, best stars preserved, no accidental duplicate POST. Refresh mid-game and after results; verify defined recovery.
5. Disable network or return 401/403/500 during save. No success/XP claim until confirmed persistence; retry must not double-award. Reconnect and verify real saved state.
6. Confirm replay content/history is isolated per child, handles malformed/unavailable localStorage, and does not merely repeat/skips tasks unexpectedly.

| Game ID / engine | Specific checks | EASY | MODERATE | MEDIUM | HARD |
| --- | --- | --- | --- | --- | --- |
| code_robot | Grid bounds, obstacles, reachable star, valid/invalid routes, animation, reset/exit during timers | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| puzzle_lab | Pattern/number/mirror/odd-one-out answer keys, final accuracy, nonrepeating sequence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| spell_quest | TTS, hint, case/space handling, wrong/repeated submissions, attempt/hint totals across words | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| speaking_games | Allow/deny mic, no speech, unsupported browser, transcript editing/retry, no synthetic evidence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| story_builder | Sequence, empty/whitespace input, long/unicode text, completeness and word counts across prompts | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| dream_designer | All choices saved, no correctness label, difficulty variation and creative preferences | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| eco_rescue | All mission branches and answer keys, accuracy/decision telemetry, no misleading difficulty label | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| mini_entrepreneur | Price/ingredient/marketing choices affect or accurately describe outcome; verify fixed current financial values | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| career_role_challenge | All role choices, final enjoyed challenge, preference reflected in stored evidence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| build_the_city | Item/cell placement, occupied cell, grid size, resource constraints, layout saved | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| science_lab | Material/prediction/experiment/retry/observation choices, observable result and retained telemetry | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| data_detective | Read actual chart values, correct/incorrect answer keys, accuracy and difficulty variation | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| design_an_app | Screen/feature/flow choices, revision path, saved logical flow | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| invent_something | Required idea, long/unicode idea, iteration choice, null skill score, evidence retention | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| team_leader | Delegation/empathy/conflict/planning branches, recorded decisions rather than fabricated mastery | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| money_manager | Budget must total 1000, slider boundaries, unexpected cost adaptation and persisted allocation | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| photo_mission | Framing/subject/light decisions, previews, creative evidence, failed-save truth | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| fashion_studio | All design controls and combinations, changes reflected in preview and persisted evidence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| directors_cut | Scene selection/order, transitions and story decisions, replay and completion | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| music_maker | Rhythm/sequence controls, repeated input, audio limitations, composition evidence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| junior_chef | Recipe/ingredient/sequence decisions and feedback, score versus preference separation | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| interior_designer | Layout/style/budget controls, valid combinations and saved design evidence | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| interest_battle | Each preference pair and choice, domain attribution, no automatic skill=100, failed save | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| curiosity_trail | Each path/branch, follow-up and enjoyment, actual domains saved, failed save | NOT RUN | NOT RUN | NOT RUN | NOT RUN |

Difficulty acceptance: every level opens immediately; hardest-first works; task count, vocabulary/grid/reasoning burden and content genuinely match the selected level where promised. Compare EASY versus HARD screenshots/payloads for every engine. Record identical mechanics as a finding, not an automatic pass. Compare frontend counts with `/games/{id}/levels` targetCount and question-bank availability. Check preferred difficulty as most frequently chosen and highest tried as maximum difficulty, using HARD -> EASY -> MODERATE -> EASY as an oracle; agree product definitions before fixing calculations.

## API integration and persistence

| ID | Execute | Acceptance |
| --- | --- | --- |
| API-01 | Frontend Network tab for signup/login/dashboard/game/chat/library/parent actions | Correct base URL, verbs, bearer header and response schema; no hidden fallback masking failure |
| API-02 | Missing/expired JWT and wrong-role requests across child/parent/admin endpoints | Access denied without leaking records; consistent recoverable UI |
| API-03 | Every live game x four levels x four ages question endpoint; invalid/unknown IDs | Explicit data or honest not-available response; verify count/content/age and answer-key exposure policy |
| API-04 | Completion null/unknown game, invalid level, negative/>100 score/accuracy, wrong types, missing fields, huge arrays/text/durations | 400 with validation, no record/XP side effects; current invalid-value probe fails |
| API-05 | Score boundaries 59/60/89/90, open-ended without score, accuracy only | Current formula: 1/2/3 stars => 40/80/120 XP; no invented skill score for open-ended activity |
| API-06 | Replay and rapid/concurrent/double-click completion; forced database/API interruption | Defined replay/idempotency behavior; record/progress/profile totals remain consistent, no partial writes |
| API-07 | Distinct child tokens, localStorage tampering, supplied foreign IDs | Data always scoped to authenticated child; no cross-child history or rewards |
| API-08 | Compare game payload fields to subsequent parent activity data | Each promised analysis signal preserved with type/meaning; lost fields recorded as defects |
| API-09 | CORS preflight + real browser calls from local URLs; intentionally wrong VITE_API_URL | Authentication succeeds at intended origin; useful failure for misconfiguration; explicit origin policy before release |
| API-10 | Stop/restart backend, retain browser token, examine previous records | H2 data loss documented; stale session recovers; do not promise durable storage |
| API-11 | Malformed JSON, missing route, unsupported method, network timeout/500 | Proper status and useful UI error; no success or permanent loading |

## AI analysis and analyzer

| ID | Execute/oracle | Acceptance |
| --- | --- | --- |
| AI-01 | Empty child profile; child and parent analysis, RecommendationService | No unsupported interests/strengths/skill claims; insufficient evidence clearly expressed |
| AI-02 | One open-ended activity; three unscored activities; three low-score activities | Separate interest/participation from demonstrated skill; no fixed vocabulary/logic mastery labels |
| AI-03 | Known scored dataset per domain, mixed/repeated sessions, tied domains | Independently calculate category counts/rankings/score weighting and compare outputs; deterministic ties |
| AI-04 | Multi-domain records, blank careerDomains with valid category, unknown domain, taxonomy variants | Correct domain mapping, fallback, no lost core-game evidence or duplicate weighting |
| AI-05 | Same activity replayed 1/2/3+ times, low versus high scores and chosen levels | Confidence matches distinct evidence; replay frequency does not fabricate skill or stability |
| AI-06 | Vary session order, HARD then EASY, historical dates around 30-day boundary | Preferred/highest and recent changes reflect definitions; results not arbitrary iteration order |
| AI-07 | Save detailed transcript/story/experiment/budget/interest choices; inspect stored records | Analysis uses real available evidence only; omissions/fixed telemetry identified |
| AI-08 | CLI valid JSON, empty object, thresholds 59/60, mixed interest text and all seven domains | Output is valid JSON with understood rule coverage and no unsupported certainty |
| AI-09 | CLI missing/malformed file, null/non-string interests, wrong score types | Explicit detectable failure, no invented generic predictions; missing-file case currently fails |
| AI-10 | Inspect saved model metadata in isolated environment; run trainer only with separate output copy | Do not overwrite original model; establish dependencies, feature/domain compatibility and reproducibility |
| AI-11 | Train/test evaluation with fixed seed, held-out independent labeled cases and per-domain metrics | Report measured accuracy/confusion matrix and limits; synthetic training fit is not real validation |
| AI-12 | Backend instrumentation/network/process observation during recommendation request | Establish actual Java rule path; do not label standalone CLI result as integrated inference |
| AI-13 | Chat greeting/topic/recommendation, empty/null/long message, unknown topic, context from saved games | Proper validation and truthful context; verify `response` field and actual backend request |
| AI-14 | Chat backend unavailable, unsupported browser speech | Honest fallback status; no invented scores/transcripts/personalized conclusions |

Model execution/evaluation is pending. Current inference is rule-based and disconnected from model.joblib; adding integration is outside this inspection phase.

## Parent dashboard and ownership

| ID | Steps | Expected result |
| --- | --- | --- |
| PAR-01 | New parent, no children; valid/invalid/blank/lowercase/spaced player code | Honest empty state; valid link works; invalid link useful error |
| PAR-02 | Repeat link, two children, two parents, switch selected child quickly | No duplicate rows, stale child detail or cross-child data; defined multi-parent behavior |
| PAR-03 | Unlinked parent requests child activity/insights directly; alter ID; child calls parent API | Denied over actual HTTP; existing tests cover some service/controller cases |
| PAR-04 | Open dashboard with zero, one, mixed, many and open-ended-only records | Counts, categories, charts/labels, null-score states and confidence match saved evidence |
| PAR-05 | Complete child activity while parent dashboard remains open, reload/reselect | Fresh records and XP shown consistently; loading/error states explicit |
| PAR-06 | Verify play counts, scores, replay totals, preferred/highest level, career clusters and recent changes against a hand-calculated dataset | Evidence-backed results; preserve insufficient-data states |
| PAR-07 | Mobile/keyboard, long nicknames, long activity lists, API 401/403/500 | Readable layout, accessible controls, no infinite loading or mixed child panels |
| PAR-08 | Public player search and code-only linking from unrelated account | Record actual exposure and evaluate intended linking consent/ownership policy before changing it |

## Supporting features, UI and quality

- QUIZ-01 (currently blocked): establish reachable UI route, answer each RIASEC prompt, navigate/retry, verify scoring/ties, submit actual payload and read it back. Current component is unmounted and POST handler absent; do not report a saved quiz from frontend results alone.
- LIB-01: career list, detail, missing career, roadmap and resource APIs, external links, empty/loading/error states. Resource completion currently local component state; check that reload behavior is represented honestly.
- FEED-01: valid/invalid ratings/comment sizes, duplicate feedback and XP bonus, level recalculation and parent visibility. Confirm feedback does not allow unintended unlimited rewards.
- NOTIFY-01: own list and read status, nonexistent IDs, another user's notification ID; enforce recipient ownership. Test unread count/UI where reachable.
- ADMIN-01: valid admin read-only users/analytics/feedback views; unauthorized roles denied. Inspect serialization for password hashes. Exercise create/update/delete only with disposable local fixtures, verifying orphan relationships and failures.
- UI-01: landing, child and parent forms/dashboards/game picker/results/chat/library at 320/375/768/1440px, long text, zoom 200%, no horizontal clipping, keyboard focus/Enter/Space, semantic labels and contrast.
- UI-02: slow network, offline transitions, token expiry and canceled requests, double click, Back/refresh, multiple tabs, browser storage disabled/full/corrupt. No misleading success or permanent spinners.
- UI-03: speech permission grant/deny, missing device, recognition error/end, TTS queue overlap, leaving game mid-recording/animation; no synthetic transcript counted as user evidence.
- PERF-01: record startup times, bundle size and dashboard/API latency with empty and large seeded histories. Set thresholds with project owner before calling performance passed. Check repeated game navigation for timers/listeners/memory retention.
- CONFIG-01: missing Java/Maven/node dependencies, occupied ports, API URL mismatch, missing analyzer input. Verify setup documentation and clear diagnostic messages. Lint currently blocked until dependencies/config are deliberately repaired.

## Exit criteria and next corrective work

Local startup is established by both services responding, not full product acceptance. Release acceptance requires: P0 cases executed and passing; all live game/difficulty cells executed with evidence; no fabricated persistence/AI skill claims; validated child/parent/admin isolation and public roles; documented input validation; P1 regressions complete; known failures fixed and rerun; residual P2 risks explicitly recorded. Keep untouched/unexecuted cases NOT RUN or BLOCKED.

Suggested incremental fixes after this inspection: restrict public privileged roles; validate completion/chat input; make failed saves truthful; reconcile stored telemetry and analysis claims; decide whether to restore or retire the currently unreachable quiz flow; make analyzer errors explicit; restore lint tooling. Each fix should include a focused failing reproduction, smallest code change, rerun of the reproduction and relevant existing checks. Do not bundle a redesign or new AI integration into startup work.
