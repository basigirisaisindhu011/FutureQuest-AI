> Historical QA snapshot. The latest fixes and actual retests are in [Verified improvements](VERIFIED_IMPROVEMENTS.md) and the [sanitized results](verified-results.json): 12 Maven tests, 138 main browser checks, 144 complete sessions and all 13 targeted regressions passed. Earlier failures below are retained as history.

# Initial browser and HTTP results

Executed against local development services in Microsoft Edge / Playwright on 19 October 2026. Dedicated synthetic accounts only. This baseline is retained separately from post-fix evidence. Browser execution is not inferred from a successful build.

## Existing browser suite

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| Public site sections, world filtering, all 24 previews and keyboard dialog | Recorded assertion | Assertions completed | PASS |
| Public desktop accessibility | Recorded assertion | Assertions completed | PASS |
| Public responsive 320px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Public responsive 375px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Public responsive 430px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Public responsive 768px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Public responsive 1024px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Public responsive 1440px and mobile navigation | Recorded assertion | Assertions completed | PASS |
| Child four-step UI registration and real player code | Recorded assertion | Assertions completed | PASS |
| Child dashboard tabs, map navigation and empty states | Recorded assertion | Assertions completed | PASS |
| Child dashboard accessibility | Recorded assertion | Assertions completed | PASS |
| Hard-first core game playthrough, confirmed rewards, timeline and analysis | Recorded assertion | Assertions completed | PASS |
| Child logout and PIN login through UI | Recorded assertion | Assertions completed | PASS |
| Career library navigation, detail and return | Recorded assertion | Assertions completed | PASS |
| Questy actual API response and honest network failure | Recorded assertion | Assertions completed | PASS |
| Career discovery engine full Science Lab playthrough | Recorded assertion | Assertions completed | PASS |
| Creative engine save, feedback and no duplicate completion | Recorded assertion | Assertions completed | PASS |
| Interest engine full Curiosity Trail playthrough | Recorded assertion | Assertions completed | PASS |
| Failed save stays honest: Dream Designer | Recorded assertion | Assertions completed | PASS |
| Failed save stays honest: Science Lab | Recorded assertion | Assertions completed | PASS |
| Failed save stays honest: Photo Mission | Recorded assertion | Assertions completed | PASS |
| Failed save stays honest: Curiosity Trail | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 320px | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 375px | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 430px | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 768px | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 1024px | Recorded assertion | Assertions completed | PASS |
| Child dashboard responsive 1440px | Recorded assertion | Assertions completed | PASS |
| Game collection mobile accessibility and 24 actual engines | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: code_robot/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: code_robot/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: code_robot/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: code_robot/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: puzzle_lab/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: puzzle_lab/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: puzzle_lab/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: puzzle_lab/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: spell_quest/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: spell_quest/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: spell_quest/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: spell_quest/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: speaking_games/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: speaking_games/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: speaking_games/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: speaking_games/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: story_builder/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: story_builder/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: story_builder/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: story_builder/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: dream_designer/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: dream_designer/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: dream_designer/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: dream_designer/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: eco_rescue/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: eco_rescue/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: eco_rescue/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: eco_rescue/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: mini_entrepreneur/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: mini_entrepreneur/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: mini_entrepreneur/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: mini_entrepreneur/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: career_role_challenge/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: career_role_challenge/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: career_role_challenge/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: career_role_challenge/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: build_the_city/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: build_the_city/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: build_the_city/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: build_the_city/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: science_lab/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: science_lab/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: science_lab/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: science_lab/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: data_detective/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: data_detective/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: data_detective/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: data_detective/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: design_an_app/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: design_an_app/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: design_an_app/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: design_an_app/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: invent_something/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: invent_something/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: invent_something/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: invent_something/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: team_leader/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: team_leader/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: team_leader/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: team_leader/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: money_manager/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: money_manager/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: money_manager/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: money_manager/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interest_battle/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interest_battle/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interest_battle/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interest_battle/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: curiosity_trail/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: curiosity_trail/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: curiosity_trail/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: curiosity_trail/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: photo_mission/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: photo_mission/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: photo_mission/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: photo_mission/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: fashion_studio/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: fashion_studio/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: fashion_studio/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: fashion_studio/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: directors_cut/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: directors_cut/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: directors_cut/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: directors_cut/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: music_maker/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: music_maker/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: music_maker/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: music_maker/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: junior_chef/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: junior_chef/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: junior_chef/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: junior_chef/Hard | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interior_designer/Easy | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interior_designer/Moderate | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interior_designer/Medium | Recorded assertion | Assertions completed | PASS |
| Game entry mobile: interior_designer/Hard | Recorded assertion | Assertions completed | PASS |
| Parent UI registration, empty state and real child linking | Recorded assertion | Assertions completed | PASS |
| Parent evidence, real chart and desktop accessibility | Recorded assertion | Assertions completed | PASS |
| Parent responsive 320px | Recorded assertion | Assertions completed | PASS |
| Parent responsive 375px | Recorded assertion | Assertions completed | PASS |
| Parent responsive 430px | Recorded assertion | Assertions completed | PASS |
| Parent responsive 768px | Recorded assertion | Assertions completed | PASS |
| Parent responsive 1024px | Recorded assertion | Assertions completed | PASS |
| Parent responsive 1440px | Recorded assertion | Assertions completed | PASS |
| Parent forbidden-child API remains denied | Recorded assertion | Assertions completed | PASS |
| Parent dashboard API failure shows recoverable error | Recorded assertion | Assertions completed | PASS |
| Mobile preview intent survives four-step registration | Recorded assertion | Assertions completed | PASS |
| Reduced-motion preference disables mascot animation | Recorded assertion | Assertions completed | PASS |
| No uncaught browser exceptions in executed paths | Recorded assertion | Assertions completed | PASS |

## Full game UI playthrough matrix

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| code_robot/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 43, 40 XP, score null | PASS |
| code_robot/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 44, 40 XP, score null | PASS |
| code_robot/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 45, 40 XP, score null | PASS |
| code_robot/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 46, 40 XP, score null | PASS |
| code_robot/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 47, 40 XP, score null | PASS |
| code_robot/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 48, 40 XP, score null | PASS |
| puzzle_lab/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 49, 120 XP, score 100 | PASS |
| puzzle_lab/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 50, 120 XP, score 100 | PASS |
| puzzle_lab/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 51, 120 XP, score 100 | PASS |
| puzzle_lab/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 52, 120 XP, score 100 | PASS |
| puzzle_lab/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 53, 40 XP, score 40 | PASS |
| puzzle_lab/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 54, 120 XP, score 100 | PASS |
| spell_quest/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 55, 40 XP, score null | PASS |
| spell_quest/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 56, 40 XP, score null | PASS |
| spell_quest/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 57, 40 XP, score null | PASS |
| spell_quest/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 58, 40 XP, score null | PASS |
| spell_quest/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 59, 40 XP, score null | PASS |
| spell_quest/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 60, 40 XP, score null | PASS |
| speaking_games/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 61, 40 XP, score null | PASS |
| speaking_games/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 62, 40 XP, score null | PASS |
| speaking_games/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 63, 40 XP, score null | PASS |
| speaking_games/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 64, 40 XP, score null | PASS |
| speaking_games/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 65, 40 XP, score null | PASS |
| speaking_games/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 66, 40 XP, score null | PASS |
| story_builder/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 67, 40 XP, score null | PASS |
| story_builder/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 68, 40 XP, score null | PASS |
| story_builder/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 69, 40 XP, score null | PASS |
| story_builder/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 70, 40 XP, score null | PASS |
| story_builder/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 71, 40 XP, score null | PASS |
| story_builder/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 72, 40 XP, score null | PASS |
| dream_designer/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 73, 40 XP, score null | PASS |
| dream_designer/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 74, 40 XP, score null | PASS |
| dream_designer/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 75, 40 XP, score null | PASS |
| dream_designer/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 76, 40 XP, score null | PASS |
| dream_designer/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 77, 40 XP, score null | PASS |
| dream_designer/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 78, 40 XP, score null | PASS |
| eco_rescue/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 79, 40 XP, score null | PASS |
| eco_rescue/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 80, 40 XP, score null | PASS |
| eco_rescue/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 81, 40 XP, score null | PASS |
| eco_rescue/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 82, 40 XP, score null | PASS |
| eco_rescue/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 83, 40 XP, score null | PASS |
| eco_rescue/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 84, 40 XP, score null | PASS |
| mini_entrepreneur/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 85, 40 XP, score null | PASS |
| mini_entrepreneur/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 86, 40 XP, score null | PASS |
| mini_entrepreneur/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 87, 40 XP, score null | PASS |
| mini_entrepreneur/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 88, 40 XP, score null | PASS |
| mini_entrepreneur/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 89, 40 XP, score null | PASS |
| mini_entrepreneur/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 90, 40 XP, score null | PASS |
| career_role_challenge/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 91, 40 XP, score null | PASS |
| career_role_challenge/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 92, 40 XP, score null | PASS |
| career_role_challenge/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 93, 40 XP, score null | PASS |
| career_role_challenge/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 94, 40 XP, score null | PASS |
| career_role_challenge/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 95, 40 XP, score null | PASS |
| career_role_challenge/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 96, 40 XP, score null | PASS |
| build_the_city/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 175, 40 XP, score null | PASS |
| build_the_city/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 176, 40 XP, score null | PASS |
| build_the_city/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 177, 40 XP, score null | PASS |
| build_the_city/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 178, 40 XP, score null | PASS |
| build_the_city/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 179, 40 XP, score null | PASS |
| build_the_city/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 180, 40 XP, score null | PASS |
| science_lab/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 97, 40 XP, score null | PASS |
| science_lab/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 98, 40 XP, score null | PASS |
| science_lab/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 99, 40 XP, score null | PASS |
| science_lab/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 100, 40 XP, score null | PASS |
| science_lab/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 101, 40 XP, score null | PASS |
| science_lab/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 102, 40 XP, score null | PASS |
| data_detective/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 103, 40 XP, score 25 | PASS |
| data_detective/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 104, 40 XP, score 25 | PASS |
| data_detective/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 105, 40 XP, score 25 | PASS |
| data_detective/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 106, 40 XP, score 25 | PASS |
| data_detective/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 107, 40 XP, score 25 | PASS |
| data_detective/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 108, 40 XP, score 25 | PASS |
| design_an_app/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 109, 40 XP, score null | PASS |
| design_an_app/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 110, 40 XP, score null | PASS |
| design_an_app/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 111, 40 XP, score null | PASS |
| design_an_app/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 112, 40 XP, score null | PASS |
| design_an_app/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 113, 40 XP, score null | PASS |
| design_an_app/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 114, 40 XP, score null | PASS |
| invent_something/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 115, 40 XP, score null | PASS |
| invent_something/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 116, 40 XP, score null | PASS |
| invent_something/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 117, 40 XP, score null | PASS |
| invent_something/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 118, 40 XP, score null | PASS |
| invent_something/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 119, 40 XP, score null | PASS |
| invent_something/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 120, 40 XP, score null | PASS |
| team_leader/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 121, 40 XP, score null | PASS |
| team_leader/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 122, 40 XP, score null | PASS |
| team_leader/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 123, 40 XP, score null | PASS |
| team_leader/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 124, 40 XP, score null | PASS |
| team_leader/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 125, 40 XP, score null | PASS |
| team_leader/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 126, 40 XP, score null | PASS |
| money_manager/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 127, 40 XP, score null | PASS |
| money_manager/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 128, 40 XP, score null | PASS |
| money_manager/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 129, 40 XP, score null | PASS |
| money_manager/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 130, 40 XP, score null | PASS |
| money_manager/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 131, 40 XP, score null | PASS |
| money_manager/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 132, 40 XP, score null | PASS |
| interest_battle/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 133, 40 XP, score null | PASS |
| interest_battle/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 134, 40 XP, score null | PASS |
| interest_battle/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 135, 40 XP, score null | PASS |
| interest_battle/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 136, 40 XP, score null | PASS |
| interest_battle/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 137, 40 XP, score null | PASS |
| interest_battle/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 138, 40 XP, score null | PASS |
| curiosity_trail/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 139, 40 XP, score null | PASS |
| curiosity_trail/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 140, 40 XP, score null | PASS |
| curiosity_trail/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 141, 40 XP, score null | PASS |
| curiosity_trail/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 142, 40 XP, score null | PASS |
| curiosity_trail/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 143, 40 XP, score null | PASS |
| curiosity_trail/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 144, 40 XP, score null | PASS |
| photo_mission/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 145, 40 XP, score null | PASS |
| photo_mission/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 146, 40 XP, score null | PASS |
| photo_mission/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 147, 40 XP, score null | PASS |
| photo_mission/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 148, 40 XP, score null | PASS |
| photo_mission/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 149, 40 XP, score null | PASS |
| photo_mission/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 150, 40 XP, score null | PASS |
| fashion_studio/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 151, 40 XP, score null | PASS |
| fashion_studio/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 152, 40 XP, score null | PASS |
| fashion_studio/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 153, 40 XP, score null | PASS |
| fashion_studio/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 154, 40 XP, score null | PASS |
| fashion_studio/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 155, 40 XP, score null | PASS |
| fashion_studio/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 156, 40 XP, score null | PASS |
| directors_cut/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 157, 40 XP, score null | PASS |
| directors_cut/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 158, 40 XP, score null | PASS |
| directors_cut/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 159, 40 XP, score null | PASS |
| directors_cut/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 160, 40 XP, score null | PASS |
| directors_cut/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 161, 40 XP, score null | PASS |
| directors_cut/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 162, 40 XP, score null | PASS |
| music_maker/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 163, 40 XP, score null | PASS |
| music_maker/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 164, 40 XP, score null | PASS |
| music_maker/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 165, 40 XP, score null | PASS |
| music_maker/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 166, 40 XP, score null | PASS |
| music_maker/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 167, 40 XP, score null | PASS |
| music_maker/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 168, 40 XP, score null | PASS |
| junior_chef/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 169, 40 XP, score null | PASS |
| junior_chef/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 170, 40 XP, score null | PASS |
| junior_chef/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 171, 40 XP, score null | PASS |
| junior_chef/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 172, 40 XP, score null | PASS |
| junior_chef/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 173, 40 XP, score null | PASS |
| junior_chef/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 174, 40 XP, score null | PASS |
| interior_designer/Easy | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 181, 40 XP, score null | PASS |
| interior_designer/Moderate | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 182, 40 XP, score null | PASS |
| interior_designer/Medium | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 183, 40 XP, score null | PASS |
| interior_designer/Hard | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 184, 40 XP, score null | PASS |
| interior_designer/Easy/replay-1 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 185, 40 XP, score null | PASS |
| interior_designer/Easy/replay-2 | Complete by UI, confirmed saved record and matching reward/score, parent readback | record 186, 40 XP, score null | PASS |

## Additional browser boundary scenarios

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| Browser refresh retains child session | Dashboard remains signed in | Dashboard restored | PASS |
| Wrong PIN and invalid code through UI | Error displayed; no child login | Wrong PIN and invalid code rejected | PASS |
| Slow API dashboard recovery | Loading then data without exception | Loaded after 800ms delay | PASS |
| Expired token dashboard | Recoverable error, no fabricated data | Visible error with sign-in recovery | PASS |
| Microphone unavailable fallback | Typing remains usable | Typed answer advances after unavailable microphone | PASS |
| Denied microphone recognition fallback | Permission error leaves editable response | Permission-denied callback releases recording state | PASS |
| Game Exit returns to difficulty selection | Exit usable without saving unfinished activity | Returned to four unlocked choices | PASS |
| Multiple browser tabs logout | Other tab stops showing authenticated data on focus | expect(locator).toHaveCount(expected) failed  Locator:  getByRole('heading', { name: /Welcome back, Explorer/ }) Expected: 0 Received: 1 Timeout:  1500ms  Call log:   - Expect "toHaveCount" getByRole('heading', { name: /Welcome back, Explorer/ }) with timeout 1500ms   - waiting for getByRole('heading', { name: /Welcome back, Explorer/ })     15 × locator resolved to 1 element        - unexpected value "1"  | FAIL |
| Network unavailable dashboard | Honest error and retry recovers | Failure and retry executed | PASS |

## Controlled histories and HTTP boundaries

These profiles use real HTTP submissions; they are **not browser-played synthetic histories**. Separately, the full-game matrix plays through the actual UI and reads each result back using the parent API.

| Feature / scenario | Expected | Actual | Status |
| --- | --- | --- | --- |
| creative: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | expect(received).not.toContain(expected) // indexOf  Expected value: not "Strong Evidence" Received array:     ["Not Enough Evidence Yet", "Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet"] | FAIL |
| creative: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | expect(received).toEqual(expected) // deep equality  - Expected  - 1 + Received  + 5  - Array [] + Array [ +   "⭐ Vocabulary & Language Accuracy", +   "⭐ Logical Thinking", +   "⭐ Observation & Curiosity", + ] | FAIL |
| creative: highest difficulty | HARD remains highest after EASY | expect(received).toContain(expected) // indexOf  Expected substring: "Highest Tried: HARD" Received string:    "Preferred Level: EASY / Highest Tried: EASY" | FAIL |
| technology: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | expect(received).not.toContain(expected) // indexOf  Expected value: not "Strong Evidence" Received array:     ["Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet"] | FAIL |
| technology: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | expect(received).toEqual(expected) // deep equality  - Expected  - 1 + Received  + 5  - Array [] + Array [ +   "⭐ Vocabulary & Language Accuracy", +   "⭐ Logical Thinking", +   "⭐ Observation & Curiosity", + ] | FAIL |
| technology: highest difficulty | HARD remains highest after EASY | expect(received).toContain(expected) // indexOf  Expected substring: "Highest Tried: HARD" Received string:    "Preferred Level: EASY / Highest Tried: EASY" | FAIL |
| science: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | expect(received).not.toContain(expected) // indexOf  Expected value: not "Strong Evidence" Received array:     ["Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet"] | FAIL |
| science: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | expect(received).toEqual(expected) // deep equality  - Expected  - 1 + Received  + 5  - Array [] + Array [ +   "⭐ Vocabulary & Language Accuracy", +   "⭐ Logical Thinking", +   "⭐ Observation & Curiosity", + ] | FAIL |
| science: highest difficulty | HARD remains highest after EASY | expect(received).toContain(expected) // indexOf  Expected substring: "Highest Tried: HARD" Received string:    "Preferred Level: EASY / Highest Tried: EASY" | FAIL |
| business: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | expect(received).not.toContain(expected) // indexOf  Expected value: not "Strong Evidence" Received array:     ["Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet"] | FAIL |
| business: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | expect(received).toEqual(expected) // deep equality  - Expected  - 1 + Received  + 5  - Array [] + Array [ +   "⭐ Vocabulary & Language Accuracy", +   "⭐ Logical Thinking", +   "⭐ Observation & Curiosity", + ] | FAIL |
| business: highest difficulty | HARD remains highest after EASY | expect(received).toContain(expected) // indexOf  Expected substring: "Highest Tried: HARD" Received string:    "Preferred Level: EASY / Highest Tried: EASY" | FAIL |
| balanced: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | expect(received).not.toContain(expected) // indexOf  Expected value: not "Strong Evidence" Received array:     ["Strong Evidence", "Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Strong Evidence", "Strong Evidence", "Not Enough Evidence Yet", "Not Enough Evidence Yet", "Not Enough Evidence Yet"] | FAIL |
| balanced: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | expect(received).toEqual(expected) // deep equality  - Expected  - 1 + Received  + 5  - Array [] + Array [ +   "⭐ Vocabulary & Language Accuracy", +   "⭐ Logical Thinking", +   "⭐ Observation & Curiosity", + ] | FAIL |
| balanced: highest difficulty | HARD remains highest after EASY | expect(received).toContain(expected) // indexOf  Expected substring: "Highest Tried: HARD" Received string:    "Preferred Level: EASY / Highest Tried: EASY" | FAIL |
| limited: limited evidence confidence | Three same-day repeats must not be strong longitudinal evidence | {'Business & Leadership': 'Not Enough Evidence Yet', 'Creativity & Design': 'Not Enough Evidence Yet', 'Communication & Language': 'Not Enough Evidence Yet', 'Engineering & Making': 'Not Enough Evidence Yet', 'Science & Research': 'Not Enough Evidence Yet', 'Technology & Logic': 'Not Enough Evidence Yet', 'Communication & Media': 'Not Enough Evidence Yet', 'Nature & Environment': 'Not Enough Evidence Yet', 'Social & Helping': 'Not Enough Evidence Yet'} | PASS |
| limited: no fabricated strengths | Unmeasured vocabulary/logic strengths absent | [] | PASS |
| Unknown parent cannot read child | 403 | 403 | PASS |
| Code alone cannot grant unrelated parent access | Link denied without child verification | expect(received).toBeFalsy()  Received: true | FAIL |
| Invalid PIN cannot link child | Link denied for wrong PIN | expect(received).toBeFalsy()  Received: true | FAIL |
| Public lookup does not disclose player codes | No playerCode in public search | expect(received).toBe(expected) // Object.is equality  Expected: false Received: true | FAIL |
| Feedback cannot reward nonexistent activity | 400 or 404 | expect(received).toContain(expected) // indexOf  Expected value: 200 Received array: [400, 404] | FAIL |
| Duplicate completion is idempotent | Same record ID and only one reward | expect(received).toBe(expected) // Object.is equality  Expected: 33 Received: 34 | FAIL |
| Invalid child login PIN | 401 | 401 | PASS |
| Invalid child player code | 401 | 401 | PASS |

Artifacts: [baseline](artifacts/baseline/browser-results.json), [game sessions](artifacts/full-games/results.json), [edge cases](artifacts/edge-baseline/results.json), [controlled histories](artifacts/evidence-baseline.json). Full-game prompts, payloads, record IDs, scores and rewards are saved in the game artifact.

Screenshots: [first live browser](screenshots/first-browser.png), [baseline states](artifacts/baseline/screenshots/), [all game engines](artifacts/full-games/), [boundary failures](artifacts/edge-baseline/). Console exceptions and failed network requests are captured in JSON; intentionally aborted requests are distinguished by scenario.

Microphone recognition was exercised using unavailable/permission-denied browser callbacks and typed fallback where recorded. Real microphone recognition, actual voice/accent handling and physical mobile hardware are **BLOCKED** by the headless environment. No camera-dependent engine exists. Trained AI-server outage is **NOT IMPLEMENTED** because the live app has no such service.

Early development runs of the new harness hit a too-short completion wait, a post-completion click race, and external-resource load waits. These harness errors are not application bugs; final matrix rows replace those provisional attempts.
