# FutureQuest AI inspection and local run report

> Historical baseline: the previously failing checks have since been fixed. See the [latest error-fix verification](redesign/ERROR_FIX_REPORT.md) for current results.

Inspected and executed on 17 October 2026 (Asia/Calcutta). Scope: current working tree, including existing uncommitted changes. No redesign or new product features were introduced. No startup source fix was necessary: the application started using existing dependencies. Added only inspection/testing documentation and a repeatable smoke script. The frontend build refreshed generated dist files; Maven refreshed generated outputs.

## Architecture and existing behavior

- `frontend`: React 18 + Vite 5, Axios, Lucide icons, CSS. `App.jsx` manages landing, child registration/player-code + PIN login, parent signup/password login, role dashboards, games and career library through local React state. JWT and user data live in localStorage. Axios injects the bearer token; API URL is `VITE_API_URL` or `http://localhost:8080/api`. Browser speech synthesis/recognition supports language activities.
- `Games.jsx` contains the live catalog, category/world browsing, four freely selectable difficulties and core game engines. `CareerDiscoveryGames.jsx`, `CreativeLifestyleGames.jsx`, and `InterestDiscoveryGames.jsx` provide additional engines. Challenges mostly run from frontend data; the backend question bank is a separate API and is not the live Games.jsx content source. Replay history is browser-local and scoped by child ID.
- `backend`: Java 17 target, Spring Boot 3.3.1, Spring Web, Security, validation, JPA/Hibernate, BCrypt, JWT. Controllers expose auth, child profile/progress/questions/completion/analysis/timeline/achievements, parent linking/activity/insights, careers/roadmaps/resources, chat, feedback, notifications and admin APIs. Entities/repositories cover users, child profiles, links, games/level progress, questions, quizzes, recommendations, achievements, mistakes, career data, feedback and notifications. Having an entity/repository does not establish a reachable feature.
- Default database: embedded in-memory H2, seeded by QuestionBankInitializer. No separate database process is needed. Data disappears when the backend process stops. Current pom has H2, not a configured PostgreSQL integration; README database/AI descriptions should not be treated as verified implementation.
- Game completion stores a GameRecord and GameLevelProgress, updates XP and player level, and returns rewards. Analysis aggregates saved game categories; timeline reads the same records. Parent linking uses player code; activity/insight reads enforce linkage. Parent insights compute category/replay/score summaries and evidence labels.
- `RecommendationService` calculates domain recommendations in Java from activity and replays. No Python subprocess, analyzer HTTP service, Spring AI dependency or external LLM integration was found in the active backend path. No public recommendation-generation route was found in the reviewed controllers.
- `ai-analyzer/predict.py` is a standalone CLI running pure-Python rules. It never loads `model.joblib`. `train_model.py` optionally trains a RandomForest on synthetic data using pandas/numpy/scikit-learn/joblib; its six domain labels and feature schema differ from the prediction script's vocabulary/logic/listening/science inputs and domain labels. Training quality and saved-model compatibility were not executed or validated. No requirements manifest exists.
- Chat is keyword-based Java logic with canned replies. The frontend also generates friendly fallback messages on network failure; visible chat text alone does not prove API integration.
- Career library supports API browsing, roadmaps/resources and feedback. Resource completion is component-local state. Parent dashboard reads linked children and their saved records/insights. Admin UI/API support user and career management; these were reviewed, not fully exercised.
- `Quizzes.jsx` contains a RIASEC-style quiz and posts `/child/quizzes`, but App.jsx does not route to this component and ChildController has no submission mapping. Quiz persistence is incomplete.

## Local startup

Installed runtimes observed: Node 24.13.0, Java 21.0.10, Maven 3.9.9, Python 3.11. Existing node_modules and Maven cache were sufficient. No dependency install was required.

Run in two PowerShell terminals:

```powershell
Set-Location 'C:\Users\well\Documents\careerquest-kids\backend'
mvn.cmd spring-boot:run
```

```powershell
Set-Location 'C:\Users\well\Documents\careerquest-kids\frontend'
npm.cmd run dev -- --host 127.0.0.1
```

Frontend: http://127.0.0.1:5173/ . Backend API: http://localhost:8080/api . No third analyzer server is needed by the current app. Stop a foreground service with Ctrl+C. Restarting H2 invalidates existing user records even if browser localStorage still holds a token; log out and create a new disposable account if needed.

Both services were left running at inspection completion. The tool sandbox initially denied access to the workspace and silently began commands at C:\ despite workdir; explicit approved access and Set-Location were required. This was an execution-environment access issue, not an application startup bug.

## Executed verification

| Check | Actual result | Limits |
| --- | --- | --- |
| `npm.cmd run build` | PASS, 1567 modules transformed | Compilation/bundling only; no browser interaction |
| `npm.cmd run lint` | FAIL: eslint executable missing | ESLint is not in package dependencies; no lint config found |
| `mvn.cmd test` | PASS: 4 tests, 0 failures/errors/skips | Existing Spring integration/controller tests; not full browser or HTTP coverage |
| `python tools/local_smoke.py` | 35/40 PASS, 5 FAIL | Real localhost HTTP + Python CLI; creates disposable test data |
| Frontend root HTTP | 200 with Vite entry module | Does not establish React render, layout or accessibility |
| Child signup/login | Valid cases pass; invalid PIN/wrong PIN rejected | UI forms and all validation boundaries still pending |
| Parent signup/login/linkage | Pass; email login, duplicate rejection, wrong password rejection | UI and multi-parent lifecycle pending |
| Role/link access controls | Anonymous, wrong role and unlinked parent requests denied | Does not establish all authorization controls |
| Four difficulty metadata + robot question APIs | All four return data, unlocked | Does not execute any browser game or validate all question content |
| Game save and analysis | Scored + open-ended sessions saved, 120 XP total, timeline/counts correct | Direct API payloads, not played sessions; negative probe later adds another deliberately invalid record |
| Parent activity/insights | Linked child/session/domain counts verified; open-ended score remains null | Graph rendering, long-term trends and formulas pending |
| Chat | 200 and nonempty `response` | Keyword response only |
| Career API | 200, eight entries | Individual roadmaps/resources not HTTP-tested |
| CORS | Local frontend preflight succeeds | Browser authentication and production origin policy pending |
| Python valid-input CLI | Logic/coding input produces Technology & Logic | Rule behavior, not saved model inference |

Raw per-check output is in `docs/local-smoke-results.json`. The smoke script returns nonzero when a check fails. An initial chatbot assertion incorrectly expected `reply`; the actual frontend/backend contract uses `response`. That test harness mistake was corrected and rerun. Final counts above use the corrected run. No credentials or bearer tokens are written to the report. Smoke accounts remain only in the running in-memory database.

## Confirmed defects from execution

1. **High: public ADMIN registration.** Posting role=ADMIN to `/auth/register` returned 200. UserService accepts the requested role. The probe created only a disposable local account; it did not exercise admin deletion/CRUD. Restricting public role assignment is a separate corrective change.
2. **Game input validation.** A completion with level=IMPOSSIBLE and accuracy=999 returned 200 rather than 400. Completion accepts arbitrary maps and client scores. This affects reward and analysis trust.
3. **Quiz route missing.** Authenticated POST `/api/child/quizzes` returned 403. Source inspection confirms no matching handler; error dispatch/security can mask a missing route as 403. This is not evidence that quiz submission is supported but forbidden by design.
4. **Analyzer masks input failure.** A missing JSON input returned exit 0 and three generic domains. It can report plausible analysis without input evidence.
5. **Chat validation/error handling.** An empty object to `/api/ai/chat` returned 403 instead of a clear 400. Source dereferences message without validation; verify server exception and error dispatch during remediation.
6. **Lint tooling incomplete.** npm lint cannot run because ESLint is undeclared/uninstalled.

## Code-review findings requiring targeted reproduction

These are source findings, not executed browser tests:

- CreativeLifestyleGames and InterestDiscoveryGames catch save failures and render success/40 XP. Core and career-discovery engines instead expose saveFailed. Offline tests must verify that failed saves never imply persistence.
- InterestDiscoveryGames sends `score: 100` for preference-only activity. Child analysis adds fixed vocabulary/logic/observation strengths after three games regardless of scored evidence. Both can overstate ability.
- Backend saves only selected payload fields. Rich engine telemetry such as predictions, experiment retries, invention text, transcriptAnalysis and allocations is not stored by submitLevelComplete. Many advertised behavioral signals therefore may not reach parent analysis.
- Parent preferred/highest difficulty is overwritten with each processed session's difficulty, not calculated as a preference distribution or maximum. HARD then EASY can misreport highest tried. Skill averaging starts at 50 and repeatedly halves; replay evidence and interest can inflate quickly.
- RecommendationService falls back to gameCategory only when the split domains array is empty, whereas splitting an empty string yields an empty element. Newly saved records without careerDomains may be omitted. Exercise with real core-game records before fixing.
- Mini Entrepreneur reports fixed 20 customers/700 revenue/200 profit regardless of choices. Speaking fallback inserts a synthetic transcript if SpeechRecognition is unavailable. These need explicit fidelity checks.
- Several games share the same steps at every level; difficulty can change labels without materially changing challenge. HARD frontend core count is six while backend target metadata is seven. The question bank contains fewer than the target number for some combinations.
- Notification mark-as-read looks up by notification ID without checking recipient. Public player lookup exposes player codes and linking requires only that code. Verify cross-account ownership and intended linking policy.
- Admin user endpoint serializes User entities with password getters. H2 console is enabled for other hosts, JWT secret is checked into config, and CORS accepts arbitrary origins with credentials. Review these before any deployment; deployment hardening was outside this local-startup task.
- README advertises a different game inventory/domain taxonomy from the live code and machine-learning integration from the active rule implementation.

## What is still untested

No real browser was driven: registration/login forms, visual dashboard rendering, all game playthroughs, microphone permission/audio recognition/TTS, mobile layouts, keyboard access, offline UI, multiple tabs, expired JWT recovery, full career/feedback/notification/admin flows, restart persistence behavior, concurrent submissions, dataset quality and trained-model accuracy remain unexecuted. See TESTING_PLAN.md for execution steps and acceptance criteria.
