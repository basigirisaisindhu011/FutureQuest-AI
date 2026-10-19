> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Feature inventory

Inventory date: 19 October 2026. Current local working tree, including earlier uncommitted changes. Browser-discovered games are saved in [discovered.json](artifacts/full-games/discovered.json). Source-level background is in the [Stage 1 audit](../docs/audit/STAGE1_RECOVERY_AUDIT.md).

| Feature | Implemented surface | Test evidence / limitation |
| --- | --- | --- |
| Homepage, About, How it works, parents, FAQs | One public page with sections, navigation and preview dialogs | Main Edge suite; About is a section, not a standalone route |
| Child setup | Four steps: nickname, avatar, age group, PIN; generated code | UI registration, logout/login and refresh tests |
| Parent accounts | Register, login, logout; link child; switch linked profiles | Main suite and additional boundary tests |
| Child dashboard | Home, worlds/map, rewards, interests, journey, library | Main suite exercises tabs and navigation |
| My Strengths | Informational prose within interests | NOT IMPLEMENTED as a separate measured-skill page |
| Profile settings | No reachable profile editing page | NOT IMPLEMENTED |
| Continue | Opens catalog; no resumable partial session | NOT IMPLEMENTED as saved in-progress resume |
| Worlds and filters | Nine worlds; overlapping memberships intentional | Main browser suite; not eight mutually exclusive score categories |
| Games | 24 catalog cards, discovered from rendered child catalog | 144-session target: 24 × four levels plus two Easy replays |
| Difficulty | Four unlocked buttons per game | Each level completed in full-game matrix where PASS |
| Age groups | 8–10, 11–13, 14–16, 17+ selectable | Main playthrough matrix uses 11–13; full age × game matrix NOT RUN |
| Scoring/save | Completion API, stars, XP, game record, timeline, level progress | Actual UI completion payload and parent readback matched per session |
| Parent evidence | Saved games, counts, charts, scored records, rule-based summaries | UI, API readback and six controlled profiles |
| Recommendations / AI | Java summaries and keyword chat; standalone Python CLI | No live trained model or Python HTTP service |
| Enjoyment | Optional feedback on creative/preference results | UI feedback save in main suite; baseline summaries ignore feedback |
| Career library | Career cards, roadmap, resources and feedback | Main suite covers navigation; complete all resources NOT RUN |
| Resource completion | Component-local toggles | No durable resource-completion workflow |
| Quiz | Unmounted frontend component, backend submit/read APIs | NOT IMPLEMENTED as accessible child page |
| Notifications/admin | Authenticated APIs, role-protected admin dashboard | Source inventoried; full admin CRUD/notification UI NOT RUN; no destructive admin operations |
| Error handling | Dashboard retry, save failure, chat failure | Network-abort and invalid-session browser cases |
| Hardware | Optional speech recognition, TTS | Synthetic unavailable/denied recognition and typed fallback; physical capture BLOCKED |
| Database | H2/JPA, initially memory-only default | HTTP save/readback proves database writes in running process; restart verification is separate |
| Hosting | Vite dev server, Docker backend, Vercel rewrite | Local only; no deployment or push |

No activity was removed, hidden, renamed or substantially redesigned during this functional QA task.
