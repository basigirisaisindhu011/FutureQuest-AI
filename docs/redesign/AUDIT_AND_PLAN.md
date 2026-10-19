# FutureQuest UI audit and staged design plan

Date: 17 October 2026. Scope: the existing local React application; no new hosting or backend rewrite. The complete README and every frontend component were inspected. Implementation, not README, defines the live catalog: 24 game engines, four difficulty choices, state-based navigation, child PIN/player-code identity and parent password/linking flows. Quizzes exist as an unmounted component with no save route and will not be advertised. Saved-model inference is not integrated; public copy must describe recorded activity and rule-based summaries.

## Page inventory and current audit

| Page/state | Existing behavior | Visual/experience issue | Planned change |
| --- | --- | --- | --- |
| PublicHome | Hero, about, steps, nine domains, seven previews, parent explanation, FAQ | Small emoji-only world/game cards, no meaningful preview interaction, limited mobile nav, inconsistent CareerQuest/FutureQuest naming | Illustrated adventure atlas, working mobile menu, world selection and real catalog previews, all required information sections |
| student-entry | New player or continue | Generic centered panel | Questy-led expedition departure panel |
| create-player steps 1–4 | Nickname, nine avatars, age, PIN | Unassociated labels, emoji tiles and no persistent step indicator | Visible four-step route, large selection controls, accessible labels, consistent mascot expressions |
| player-code-created | Actual player code shown | Text-only celebration | Original badge illustration + Questy celebration; retain real code |
| child-picker | Remembered local profiles and PIN login | Unclear selected state and code input escape path | Friendly passport panel, explicit choose another player, secure PIN input |
| login/register | Parent/admin password sign-in, parent signup | Detached narrow cards, unassociated input labels | Professional parent gateway, clear navigation, accessible forms |
| child dashboard | Profile, analysis, timeline, rewards, interests, library links | Eight repetitive tabs, large stack of cards, every quick launch opens same generic picker | Adventure command center, illustrated world map, real saved counts and journey, honest empty states |
| games/worlds/levels | 24 activities, all difficulties, category filters | Many plain repeating cards, narrow grid constraints, no illustrated environments | Shared source catalog, world atlas and illustrated activity cards; preserve engines and API payloads |
| game shells/results | Four engine families, saves/rewards/feedback | Inconsistent shells, repeated inline styling, some save failures claim success, small-screen grid overflow | Shared visual treatment, responsive play areas, consistent Questy guidance and confirmed-save celebrations |
| parent dashboard | Child linking, session history, domain insights/clusters | Very long unscannable list; no load/error state; default numerical scores may look like evidence | Calm parent workspace, child overview, real session-count chart, expandable evidence and grounded exploration suggestions |
| career library/detail | Careers, roadmaps/resources, feedback | Nonkeyboard cards, missing list back navigation/error/loading | Harmonize design, accessible cards and retained API flows |
| AIChatbot | Keyword backend + local fallback | Floating panel can obstruct mobile controls; fallback looks personalized | Responsive panel, clear network failure message and accessible controls |
| AdminDashboard | User list | Plain unformatted list | Preserve functionality with shared base styling; no admin feature expansion |
| Quizzes | Unreachable component | Missing backend save route | Keep unadvertised; do not fabricate availability |

## Creative direction: The Curiosity Atlas

A warm paper-white expedition journal meets an illustrated universe. Deep ink indigo anchors navigation, saturated periwinkle marks primary actions, peach/orange rewards, teal science, sky technology, green nature and lilac creativity. Original lightweight SVG floating islands use a common palette, perspective and shapes. Hero combines the existing Questy silhouette with children, islands, planets and tools; world and activity art is explicitly illustration, never a fabricated screenshot.

Reusable parts: Brand, SectionHeading, WorldScene, UniverseIllustration, GameArtwork, Questy expressions, EmptyState, LoadingState, ErrorState and GameCelebration. Catalog/world data shared between marketing and authenticated picker prevents advertised game drift. Typography uses existing Outfit/Inter with system fallbacks. Touch targets >=44px; visible focus; semantic forms/nav; reduced motion; fluid 320–1440px layout.

## Stages and checkpoints

1. Audit/design plan (this document), preserve existing dirty work, capture actual before screenshots. Baseline browser checkpoint: child registration/login, game navigation and freely chosen difficulty, real save/readback, parent login/link/activity. Full API smoke records pre-existing failures separately; those unrelated backend/analyzer defects are not a redesign pass requirement.
2. Design tokens and code-native SVG assets. No new bitmap generation dependency or external image URLs. Preserve the existing mascot design and add expressions.
3. Public website: exact hero intention, about/purpose, four-step illustrated journey, eight career environments plus creative studio, actual games, guide, parent/privacy/AI explanations and eight FAQs. Interactive previews describe real mechanics and route through onboarding.
4. Child: onboarding/forms and dashboard/map, catalog and difficulty UI, consistent shell/results. Modify only directly related UX defects needed for truthful saved results. No new game engines or scoring changes.
5. Parent: clean layout, actual counts, domain evidence with unscored-state safeguards, linked-child selection, loading/errors and grounded suggestions. Preserve endpoints and backend calculations.
6. Build, real browser interactions using installed Edge via Playwright, mobile/tablet/desktop overflow checks, axe accessibility checks, screenshots, post-change API regression. Record actual scope, failures and untested behavior. No claim of complete 24-game playthrough or human screen-reader validation.

Acceptance: baseline user journeys still work; implemented pages are navigable; illustrations are original and responsive; no invented AI data; all four difficulty choices remain; results reflect confirmed API saves; no console exceptions in tested paths; no horizontal overflow in tested viewports; document residual pre-existing backend security/validation and analyzer issues rather than rewriting them here.
