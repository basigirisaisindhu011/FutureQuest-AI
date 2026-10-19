> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Initial bug report

For the latest state, see [continued testing](CONTINUED_TEST_REPORT.md): 13 additional targeted checks reproduce reset/navigation, spelling counters, domain attribution, missing telemetry and game-quality failures. Backend Surefire verification now passes 11 tests; these runtime acceptance failures are not covered by those unit tests. The baseline table below is retained as historical evidence.

Initial evidence: [browser results](browser-test-results.md), [controlled HTTP failures](artifacts/evidence-baseline.json), [game playthrough observations](artifacts/full-games/results.json), [browser boundary failures](artifacts/edge-baseline/results.json). These observations precede application fixes. See fix-summary.md and regression-results.md for retests.

| ID / severity | Reproduction and actual result | Expected / suspected root cause |
| --- | --- | --- |
| QA-01 Critical | Register a fresh parent; obtain an unrelated child's code from public players endpoint; POST link-child with only that code. Baseline accepts link. Wrong PIN is ignored too | Require child verification before establishing access; controller forwards only code |
| QA-02 High | Repeat identical completion POST with same sessionId. Baseline creates two records/rewards | One completion per child/session; sessionId not modeled/checked |
| QA-03 High | POST feedback for activity 999999; baseline saves and awards XP | Reject nonexistent/foreign activity; no ownership/existence validation |
| QA-04 High | Complete three same-day activities, including creative-only play. Child API returns vocabulary/logic/observation strengths; parent says Strong Evidence | Abstain from unmeasured skills and longitudinal confidence; fixed strengths and count-only thresholds |
| QA-05 Medium | Complete HARD then EASY twice. Parent reports EASY as highest | Calculate maximum difficulty and actual frequency; each iterated record overwrites label |
| QA-06 High | Replay scored task. Baseline skill average begins at 50 and halves each update; repeated records alter score without changed performance | Arithmetic mean of comparable results, null for missing skill; order-dependent fold |
| QA-07 Medium | Click Play again on completion. Browser reload opens dashboard instead of the same game/difficulty | Restart current engine; handlers use window.location.reload |
| QA-08 Medium | Open second authenticated tab, logout first tab, focus second. Child dashboard remains visible | Clear role view when shared credentials change; App has no storage listener |
| QA-09 High | Backend default is in-memory H2; restart cannot retain gameplay | Durable local storage and executed restart verification; memory JDBC URL |
| QA-10 Medium | Repeat Easy sessions and compare all four levels; many prompts/options stay identical | Varied age-appropriate challenges and meaningful difficulty; fixed data/choice flows |
| QA-11 Medium | Mini Entrepreneur choices change; sent revenue/customers/profit remain fixed. Science choice steps produce no actual observation | Calculated simulations; constants and generic choices |
| QA-12 Medium | Creative layout/prediction/preference fields present in browser payload but absent from stored session | Versioned evidence retention and analysis integration; handler only copies selected fields |

QA-10–12 are game-quality/evidence design work, not permission for a large rewrite. Detailed game recommendations remain in game-quality-audit.md. Parent privacy verification reduces code-only account takeover but is not a verified legal-guardian identity system. Physical-device audio, all age bands and production security are not certified by this report.
