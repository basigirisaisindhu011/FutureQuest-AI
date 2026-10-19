# Error-fix verification

The known failing checks from the inspection and browser retest have been corrected. Both local services were restarted with the new code and remain available at http://127.0.0.1:5173/ and http://localhost:8080/api. Restarting the backend cleared its disposable in-memory records.

## Changes

- Narrow homepage navigation uses a constrained grid so its actions remain inside a 320px viewport while fonts load or are unavailable. Browser layout assertions wait for two animation frames after resizing; they still fail on actual overflow. No overflow-hiding CSS was introduced.
- Public registration accepts parent accounts only; requesting ADMIN, ROLE_ADMIN, CHILD or unknown roles is rejected.
- Chat requests now apply the existing message validation and return 400 for missing, blank or null messages.
- Game completion validates known game IDs, the four difficulty choices, numeric score/accuracy ranges, nonnegative integer counters and text metadata before making any writes. Completion writes are transactional. Valid requests and all four difficulties remain supported.
- The existing quiz submission contract now persists records, validates a 0–10 score, and provides a child-scoped readback endpoint. The smoke fixture was corrected to supply the existing required responses field; validation was not weakened to accommodate an invalid fixture. The unmounted quiz component no longer claims an unawarded XP bonus. This does not add a new quiz navigation feature.
- Analyzer CLI failures now return a nonzero exit status and a JSON error on stderr, with no invented predictions on stdout. Input schema and score ranges are validated. Valid empty evidence produces an empty prediction list.
- Restored ESLint tooling/config and resolved reported lint errors. The config checks runtime correctness and JSX references; unused-import cleanup is explicitly outside its scope.
- Applied compatible package patches, removed the unused react-router-dom dependency after verifying no source imports, and updated Vite to 8.3.4 with compatible React plugin 5.2.0. The current Node 24 runtime satisfies the updated declared engine requirement: Node 20.19+ or 22.12+.

## Executed results

| Check | Result |
| --- | --- |
| Browser regression, real headless Microsoft Edge | 138 passed, 0 failed |
| Focused normal/blocked-font resize measurements | 24 passed |
| API/analyzer HTTP and CLI smoke checks | 40 passed, 0 failed |
| Maven backend tests | 9 passed, 0 failures/errors/skips |
| Python analyzer test methods | 3 passed, including invalid-input subcases |
| ESLint | Passed, 0 errors/warnings |
| Vite production build | Passed |
| npm dependency audit | 0 vulnerabilities reported |
| Automated accessibility scans | 0 violations in the 10 scanned primary states |
| Uncaught browser exceptions | 0 in the executed suite |

The backend count includes the four existing tests and five new HTTP regression tests for signup roles, chat validation, completion rejection without reward side effects, valid difficulty/score boundaries, and child-isolated quiz persistence.

Evidence: [browser results](browser-results.json), [accessibility results](accessibility-results.json), [mobile resize/font checks](mobile-fix-results.json), [API smoke results](../local-smoke-results.json), [dependency audit](dependency-audit.json), [machine-readable fix summary](error-fix-results.json). The latest browser suite supersedes the previous 137/138 retest outcome.

Run the checks from the project root:

```powershell
python tools/local_smoke.py
python tools/test_analyzer.py
mvn.cmd -f backend/pom.xml test
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend test
node frontend/tests/mobile-fix-qa.mjs
npm.cmd --prefix frontend audit
```

Browser/API checks expect both services to be running and use disposable local accounts. These results establish that the known reproductions and executed suites pass; they do not establish that every possible defect is absent. The 96 game/difficulty checks are entry/render checks, alongside representative complete playthroughs. Full gameplay for every age/difficulty, physical devices, manual screen readers, production deployment and durable storage remain unverified. Previously noted production-hardening and analysis-quality work is not represented as completed by these fixes.
