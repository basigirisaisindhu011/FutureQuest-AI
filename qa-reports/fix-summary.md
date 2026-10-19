> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Fix summary and remaining limits

**Latest continuation:** the user's fresh Surefire reports now verify **11 passing tests, zero failures/errors/skips**. The earlier blocked JUnit status below describes the previous agent run. Fresh browser reruns passed 138 main checks, 144 full game sessions and 13 boundary checks, while **13 targeted game/data acceptance checks failed**. See the [complete continued report](CONTINUED_TEST_REPORT.md) and [Maven review](artifacts/continuation-maven/review.json); the application is not certified as entirely correct.

Executed locally on 19 October 2026, Asia/Calcutta. No production data, remote repository, deployment or destructive admin workflow was used. All 24 activities remain in the catalog. Existing uncommitted work was preserved; builds refreshed generated outputs.

## Focused corrections

| Bug | Correction | Verification |
| --- | --- | --- |
| Code-only linking / ignored PIN | Verify child PIN when linking; parent form collects it and clears it after success. Public search omits playerCode, profileId and age band | HTTP wrong/missing-PIN rejection and unrelated-child denial; UI invalid code/PIN, valid linking, multiple profiles and parent relogin |
| Duplicate completion rewards | All four frontend session hooks create per-attempt UUIDs. Backend locks child row, reuses same child/session record, rejects reuse across games/difficulties and adds a unique constraint | Sequential and three-concurrent-retry HTTP probes; full UI matrix with saved-record/count/reward readback |
| Invalid/foreign feedback and duplicate XP | Validate game/quiz ownership and career existence; lock child feedback, reuse same-user/activity feedback and recalculate level | HTTP nonexistent/foreign activity rejection and repeated-feedback reward checks; browser game/career feedback; added Java assertions remain blocked |
| Unsupported strengths/confidence | Remove fixed child strengths; use actual session counts instead of inflated replay percentages; arithmetic mean for scored records and null without scores; same-day repeats cannot become Strong Evidence | Six API profiles plus six browser-played profiles; equal scores remain 40; no-history abstention |
| Incorrect highest/preferred difficulty | Calculate frequency with explicit ties and actual maximum difficulty | HARD remains highest after EASY in controlled profiles |
| Unsupported trends / blank-domain fallback | Replace unsupported change claims with longer-history explanation; recommendation fallback handles blank domains and counts each record once | Parent UI/API snapshots; recommendation service remains unintegrated, with no live-ML claim |
| Replay loses game | Remount current engine with a new attempt key, retaining game/difficulty | Every exposed Play again control restarted its engine; two Easy replays completed/saved per game |
| Other tab retains child view after logout | Synchronize App account/role view on storage credential changes | Multi-tab browser logout passed |
| Restart loses records | File-backed default development H2, configurable with DB_URL; QA uses a separate disposable file; JUnit classes explicitly use memory H2 | Actual process restart retained child login, parent link, saved game ID, 40 XP and browser parent overview |
| User password serialization | Add JsonIgnore to User.password | Source correction compiled; full admin serialization workflow NOT RUN. Child PIN hash already had JsonIgnore before this task |

New runners are in `frontend/tests/`: `full-game-qa.mjs`, `evidence-qa.mjs`, `edge-case-qa.mjs`, `profile-browser-qa.mjs`, `persistence-qa.mjs`, `library-qa.mjs` and `touch-qa.mjs`. The existing main suite supports a separate output folder and verified PIN linking. `tools/write_qa_reports.py` renders execution artifacts. Two regression methods were added to KnownFailureRegressionTests.

## Final executed checks

| Check | Status | Result / evidence |
| --- | --- | --- |
| Main Edge regression | PASS | 138/138, including 96 launch/render cases; [raw result](artifacts/regression/browser-results.json) |
| Every-game full sessions | PASS | 144/144: 24 visible games × four difficulties plus two Easy replays; [raw result](artifacts/full-games-regression/results.json) |
| UI completion to parent persistence | PASS | Each session matched saved record ID, game, difficulty, score and XP; final parent dashboard rendered |
| Browser boundary cases | PASS | 13/13: invalid login, parent login/linking, slow/failed API, invalid session, speech fallback, exit and tabs; [raw result](artifacts/edge-regression/results.json) |
| Browser-played profiles | PASS | 6/6: creative, technology, science, business, balanced, limited; [raw result](artifacts/browser-profiles/results.json) |
| Controlled HTTP/evidence probes | PASS | 30/30, distinct from UI gameplay; [raw result](artifacts/evidence-regression.json) |
| Mobile touch emulation | PASS | Four complete saved sessions with actual tap events at 375px; [raw result](artifacts/touch/results.json) |
| Career library | PASS | All eight details, roadmap/resources tabs and completion toggle pairs; actual feedback save and XP; [raw result](artifacts/library/results.json) |
| Database restart | PASS | Retained record/link/login/XP after actual backend stop/restart; [raw result](artifacts/persistence-results.json), [screenshot](artifacts/persistence-after-restart.png) |
| Python validation | PASS | Three methods; [log](artifacts/python-tests.log). CLI contract tests, not scientific validity |
| Configured ESLint | PASS | [log](artifacts/lint.log); existing config disables unused-variable checks |
| Frontend production build | PASS | [log](artifacts/build.log); not used as a functional-test substitute |
| Java JUnit suite | **BLOCKED** | Cached-JAR resolution denied during test compilation; no fresh JUnit pass. [Actual log](artifacts/java-tests.log) |

The automatic approval service failed three attempts to authorize the Maven test command because its selected model was at capacity. It did not execute the command or determine it unsafe. The action needed access to compile/run tests using `C:\Users\well\.m2\repository`; user guidance/access was requested. Main application classes compiled before the test-compiler failure. The updated backend then started without test compilation, and actual HTTP/browser regressions ran against it. This does **not** replace the JUnit run or prove the newly added Java methods pass.

Baseline failures remain in [initial results](browser-test-results.md). Development of the new harness exposed a too-short completion wait, post-save click race and ambiguous palette/grid selectors. These harness defects were corrected and affected sessions rerun. The final initial matrix combines an original run with a 12-case grid supplement; the post-fix 144-case matrix is one complete run. Historical browser reports were preserved in their existing folders.

## Unresolved failures and coverage limits

- Repetitive content, shallow difficulty differences, generic option flows, missing age adaptation in most engines, hardcoded business outcomes, non-simulated experiments and discarded rich telemetry remain **design/content failures**. See [game-quality-audit.md](game-quality-audit.md). Successful saves do not establish engagement or educational validity.
- Rules remain descriptive. Session counts are not normalized interest assessments; arithmetic means can mix unlike tasks; enjoyment is stored but not integrated. No trained Python model is integrated/validated. Scored puzzle/chart banks still need reviewed answer criteria.
- Completion is not server verification that a challenge was solved. Current UI retries are idempotent; legacy requests omitting sessionId remain accepted for compatibility and do not get deduplication. Server-issued challenges remain future integrity work.
- PIN confirmation is not verified guardian identity. Rate limiting, secrets/CORS, public nickname search, H2 console exposure, notification ownership and production security review remain outside a completed security certification.
- Physical microphones/cameras, recognition quality, phones/tablets and manual screen readers are **BLOCKED** by the headless environment. Unavailable recognition and injected permission-denied callbacks were exercised; synthetic callbacks are not real voice recognition.
- Full age × difficulty × game playthroughs, admin CRUD, notification workflows, load beyond duplicate-completion probes, external learning-site availability and production deployment are **NOT RUN**. Google Fonts requests were denied by the environment; fallback layouts rendered. Console/network artifacts preserve these errors.
- Profile settings, a separate measured My Strengths page, durable resource completion, dedicated URL error pages and saved partial-game resume are **NOT IMPLEMENTED**. About/How It Works are homepage sections.

All eight requested reports are in this folder. No push/deployment occurred. Frontend/backend remain running locally. The backend uses the dedicated QA database through DB_URL; start without that override to use the default local database. Test credentials/database files are ignored by Git.
