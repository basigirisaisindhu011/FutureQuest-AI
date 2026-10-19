# FutureQuest AI

A React and Spring Boot project where children explore career-inspired activities and parents review recorded interests and developing skills. Suggestions are invitations to explore, not permanent career assignments or standardized assessments.

## Current application

- 24 activities across nine browsing worlds, covering technology, engineering, science, creativity, communication, helping, business and nature.
- Independent child registration using nickname, avatar, age band and PIN; separate parent accounts with verified Player Code/PIN linking.
- Easy, Moderate, Medium and Hard are freely selectable. Difficulty changes are implemented per engine; the reports document remaining content-quality limits.
- Executable robot routes, generated age-aware puzzles, spelling and speaking, story/design choices, environmental missions, city planning, classroom business/science models and audible rhythm creation.
- Persistent game history, XP, timeline, idempotent completion retries, structured experiment/choice evidence, and linked-parent dashboards.
- Separate interest and scored-task summaries. Preference games attribute domains to selected activities. Open-ended creativity normally has no correctness score.
- Original SVG worlds and Questy illustrations, responsive interfaces, keyboard-friendly controls and optional speech input with typed fallback.

The runtime analysis is transparent Java rules and keyword chat. Python CLI rules and a synthetic training prototype are separate experiments; no scientifically validated or integrated ML prediction is claimed. Some creative games remain choice-based and need richer artifacts; see the QA reports.

## Run locally

Requirements: Java 17+, Maven 3.8+, and Node 20.19+ or 22.12+ (tested with Node 24).

```powershell
cd backend
mvn test
mvn spring-boot:run
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Frontend: http://127.0.0.1:5173 . Backend: http://127.0.0.1:8080/api . No separate Python server or database process is required.

When started from `backend`, default development storage is file-backed H2 under `backend/data/`. Set `DB_URL` for another database and `DB_PASSWORD` for a password-protected database. Older local databases created with a password require the corresponding environment value. JUnit uses isolated in-memory H2. QA runners create disposable accounts and must never target production data.

No runtime signing key is committed. Set `JWT_SECRET` for a managed key; otherwise local development creates an ignored `backend/data/jwt.key` that persists across restarts. `JWT_KEY_FILE` overrides its location. Keep the local key/database outside Git. The H2 web console is disabled by default; enable `ENABLE_H2_CONSOLE` only for local debugging. Deployment requires separately reviewed origins, secrets, storage volumes, backups and privacy controls.

## Verification

Start both services for browser/API tests. From the project root:

```powershell
mvn -f backend/pom.xml test
npm --prefix frontend run lint
npm --prefix frontend run build
node --test frontend/tests/challenges.test.mjs
npm --prefix frontend test
node frontend/tests/full-game-qa.mjs
node frontend/tests/game-quality-probes.mjs
node frontend/tests/evidence-qa.mjs
node frontend/tests/edge-case-qa.mjs
python tools/test_analyzer.py
```

The full-game runner discovers visible catalog cards, plays all difficulties and two additional Easy replays, and verifies each completion through linked-parent readback. Test credentials are generated at runtime. Raw captures/databases/logs remain local under ignored QA artifact directories; reviewed Markdown reports and the sanitized results summary are versioned. Build output, dependencies and environment files are not source deliverables.

Reports: [latest verified improvements](qa-reports/VERIFIED_IMPROVEMENTS.md), [previous detailed findings](qa-reports/CONTINUED_TEST_REPORT.md), and [initial project audit](docs/audit/STAGE1_RECOVERY_AUDIT.md). Historical failures are retained and distinguished from actual retests.

## Repository

[basigirisaisindhu011/FutureQuest-AI](https://github.com/basigirisaisindhu011/FutureQuest-AI)
