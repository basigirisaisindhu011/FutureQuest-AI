> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Game quality audit

Latest evidence: [the continued report](CONTINUED_TEST_REPORT.md) adds 13 reproduced acceptance failures with screenshots, payload/state capture and reproduction steps, including new reset, navigation and stored-counter failures. The per-game observations below describe the earlier run and remain available for comparison.

All judgments below combine actual completed browser sessions with source confirmation. Completion/save PASS does not mean a game is engaging, age-appropriate or educationally validated. No child usability study was performed, so “boring” is not a measured enjoyment result. Exact prompt differences alone do not establish meaningful difficulty; some games change the first sentence while retaining the same choices.

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| Code the Robot | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Keep executable grid; generate varied solver-checked routes and clear collision feedback. | Design review; observed behavior |
| Puzzle Laboratory | 6 saved sessions; exact Easy sequence repeats: False; identical four-level prompt sequences: False | Replace repeated templates with validated puzzle families; remove answer-position cues. | Design review; observed behavior |
| Spell Quest | 6 saved sessions; exact Easy sequence repeats: False; identical four-level prompt sequences: False | Retain audio/type mechanic; fix selection stride, total attempts/hints and per-age vocabulary. | Design review; observed behavior |
| Speak & Shine | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Retain optional speech/type; expand prompts and do not claim automatic relevance assessment. | Design review; observed behavior |
| Story Builder | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Add editable scenes, dialogue and alternative endings; vary scene selection. | Design review; observed behavior |
| Dream Designer | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Merge into a rendered interior design canvas after approval. | Design review; observed behavior |
| Eco Rescue | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Sorting, resource allocation and visible environmental consequences. | Design review; observed behavior |
| Mini Entrepreneur | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Calculate pricing, inventory, demand, costs and profit from decisions. | Design review; observed behavior |
| Career Role Challenge | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Combine with optional discovery choices; launch real sample activities. | Design review; observed behavior |
| Build the City | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Editable placements with road connectivity, services and binding budget. | Design review; observed behavior |
| Science Lab | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Run controlled-variable experiments and display calculated observations. | Design review; observed behavior |
| Data Detective | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Explicit chart questions, unambiguous answer criteria and varied datasets. | Design review; observed behavior |
| Design an App | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Render screens, connect navigation and let a user test the design. | Design review; observed behavior |
| Invent Something | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Retain original idea/prototype and compare revisions; word count is not originality. | Design review; observed behavior |
| Team Leader Challenge | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Assign people/tasks and show consequences of listening, delegation and trade-offs. | Design review; observed behavior |
| Money Manager | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Make repair and price events actually change allocations and remaining budget. | Design review; observed behavior |
| Interest Battle | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Use neutral varied pairings; preserve selected-domain evidence; avoid skill scoring. | Design review; observed behavior |
| Curiosity Trail | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: True | Navigate to the selected game; do not count self-reported exploration as gameplay. | Design review; observed behavior |
| Photo Mission | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Interactive frame/subject/light controls with visible image changes. | Design review; observed behavior |
| Fashion Studio | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Rendered outfit with color/pattern/accessory editing and mission constraints. | Design review; observed behavior |
| Director's Cut | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Editable storyboard order with camera and sound preview. | Design review; observed behavior |
| Music Maker | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Audible editable sequencer; rests are valid music, not lower accuracy. | Design review; observed behavior |
| Junior Chef | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Actual ingredient/step/budget simulation or omit from primary collection after approval. | Design review; observed behavior |
| Interior Designer | 6 saved sessions; exact Easy sequence repeats: True; identical four-level prompt sequences: False | Move/remove furniture, enforce access and cost constraints; merge Dream Designer. | Design review; observed behavior |

## Replay control failures before fixes

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| code_robot/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| puzzle_lab/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| spell_quest/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| speaking_games/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| story_builder/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| dream_designer/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| eco_rescue/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| mini_entrepreneur/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| career_role_challenge/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| science_lab/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| data_detective/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| design_an_app/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| invent_something/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| team_leader/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| money_manager/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| photo_mission/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| fashion_studio/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| directors_cut/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| music_maker/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| junior_chef/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| build_the_city/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |
| interior_designer/replay-control | Restart same game and difficulty | Reload returned to dashboard; game and difficulty lost | FAIL |

The core and career/lifestyle groups reuse choice-button layouts extensively. Photo, Fashion, Director and Chef share ChoiceFlow. City and Interior share placement mechanics with no enforced connectivity/cost. Science/App/Team/Role share short option stages. Dream Designer and Eco/Business are also fixed choice flows. Distinct names and SVG previews do not establish distinct play mechanics.

Only Puzzle Laboratory and Data Detective normally submit measured accuracy. Other engines save participation without a skill score; that is preferable to arbitrary creative correctness. Mini Entrepreneur submits fixed financial constants, Music Maker has no audible playback, and many rich evidence fields are discarded. The full age × difficulty × game matrix remains NOT RUN; source review confirms most engines ignore age.

No game was removed or redesigned. Recommendations are deferred product work. Full source/content inventory: [Stage 1 audit](../docs/audit/STAGE1_RECOVERY_AUDIT.md).
