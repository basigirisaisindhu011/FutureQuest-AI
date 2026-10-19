> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Browser test plan

Use Microsoft Edge driven by Playwright against frontend `127.0.0.1:5173` and backend `127.0.0.1:8080`. Use new `QA`/test accounts in the local development database only. The backend performs analysis itself; Python is a standalone CLI, not a required service.

1. Open the actual homepage; capture the first browser screenshot before declaring startup successful.
2. Run the existing browser suite as baseline, with a separate output folder. It covers UI child/parent registration, authentication, representative completions, parent linking/isolation, previews/worlds, error recovery, desktop/tablet/mobile and axe states. Its 96 game-entry checks are not playthroughs.
3. Discover game names from `.catalog-game-card h2` in the child browser. Cross-reference catalog metadata for identity; fail on unmapped/duplicate visible cards.
4. For every discovered game, enter from the child dashboard/catalog and complete Easy, Moderate, Medium and Hard. Then replay Easy twice. Drive real UI controls. Solve the robot grid with BFS; capture actual TTS word calls for spelling; use the supported typed alternative for speech. Do not directly submit completion requests in place of playing these sessions.
5. For every completion, capture actual browser POST/response, assert success screen/reward, then read parent activity using a separately authenticated linked parent. Match record ID, game, difficulty, score and XP; verify count increments by one. Capture initial gameplay screenshots and final parent dashboard.
6. Compare content observed across difficulties/replays. Report mechanical/content failures independently from successful saves. “Boring” is a design judgment inferred from interaction, not measured child enjoyment.
7. Execute additional browser tests for wrong PIN/code, refresh, unavailable/denied microphone, slow API, invalid session, offline/retry, exit and multiple tabs. Keep test-harness failures distinct from application defects.
8. Construct six controlled histories through actual HTTP for creative, technology, science, business, balanced and limited-activity profiles. Label these API fixtures clearly. Test unsupported confidence, fabricated strengths, highest difficulty, unrelated-parent access, linking verification, public code exposure, feedback integrity and duplicate completion.
9. Write initial results before application fixes. Apply focused corrections, add meaningful regression assertions, restart changed services and rerun browser/API scenarios. Preserve original failures.
10. Run appropriate Java/Python/lint/build checks and a local database restart verification separately. Record actual limits, including full age matrix, physical devices, screen readers, production and unsupported features.

Statuses: PASS = executed assertion met; FAIL = executed expectation unmet; BLOCKED = attempted execution prevented by environment/dependency; NOT RUN = not executed. NOT IMPLEMENTED is an inventory fact, not a test pass.

Commands from project root:

```powershell
mvn.cmd -f backend/pom.xml '-Dmaven.repo.local=C:\Users\well\.m2\repository' spring-boot:run
npm.cmd --prefix frontend run dev -- --host 127.0.0.1
$env:QA_OUTPUT = "$PWD\qa-reports\artifacts\baseline"
node frontend/tests/redesign-regression.mjs
node frontend/tests/full-game-qa.mjs
node frontend/tests/edge-case-qa.mjs
node frontend/tests/evidence-qa.mjs
python tools/write_qa_reports.py
```

The runners create dedicated fixtures and artifacts. They must target a disposable/local development database, never production.
