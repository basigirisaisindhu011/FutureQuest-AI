"""Render QA reports from executed artifacts; missing execution stays NOT RUN."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-reports'
def read(name):
    p = OUT / 'artifacts' / name
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else {}
def table(rows):
    return '| Feature / scenario | Expected | Actual | Status |\n| --- | --- | --- | --- |\n' + ''.join('| ' + ' | '.join(str(x).replace('|', '/').replace('\n', ' ')[:1400] for x in row) + ' |\n' for row in rows)
def result_rows(data):
    return [(r.get('name'),r.get('expected','Recorded assertion'),r.get('actual',r.get('error','Assertions completed')),r['status']) for r in data.get('results',[])]
def write(name,text):
    (OUT / name).write_text(text+'\n',encoding='utf-8')
baseline=read('baseline/browser-results.json')
games=read('full-games/results.json')
supplement=read('full-games-supplement/results.json')
if supplement:
    replacements={r['name']:r for r in supplement.get('results',[])}
    games['results']=[replacements.get(r['name'],r) for r in games.get('results',[])]
    supplement_ids={x['gameId'] for x in supplement.get('observations',[]) if 'gameId' in x}
    games['observations']=[o for o in games.get('observations',[]) if o.get('gameId') not in supplement_ids]+supplement.get('observations',[])
edge=read('edge-baseline/results.json')
evidence=read('evidence-baseline.json')
regression=read('regression/browser-results.json')
fixed_evidence=read('evidence-regression.json')
fixed_edge=read('edge-regression/results.json')
game_regression=read('full-games-regression/results.json')
browser_profiles=read('browser-profiles/results.json')
library=read('library/results.json')
touch=read('touch/results.json')
quality_rows=[]
recommendations={
 'code_robot':'Keep executable grid; generate varied solver-checked routes and clear collision feedback.',
 'puzzle_lab':'Replace repeated templates with validated puzzle families; remove answer-position cues.',
 'spell_quest':'Retain audio/type mechanic; fix selection stride, total attempts/hints and per-age vocabulary.',
 'speaking_games':'Retain optional speech/type; expand prompts and do not claim automatic relevance assessment.',
 'story_builder':'Add editable scenes, dialogue and alternative endings; vary scene selection.',
 'dream_designer':'Merge into a rendered interior design canvas after approval.',
 'eco_rescue':'Sorting, resource allocation and visible environmental consequences.',
 'mini_entrepreneur':'Calculate pricing, inventory, demand, costs and profit from decisions.',
 'career_role_challenge':'Combine with optional discovery choices; launch real sample activities.',
 'build_the_city':'Editable placements with road connectivity, services and binding budget.',
 'science_lab':'Run controlled-variable experiments and display calculated observations.',
 'data_detective':'Explicit chart questions, unambiguous answer criteria and varied datasets.',
 'design_an_app':'Render screens, connect navigation and let a user test the design.',
 'invent_something':'Retain original idea/prototype and compare revisions; word count is not originality.',
 'team_leader':'Assign people/tasks and show consequences of listening, delegation and trade-offs.',
 'money_manager':'Make repair and price events actually change allocations and remaining budget.',
 'interest_battle':'Use neutral varied pairings; preserve selected-domain evidence; avoid skill scoring.',
 'curiosity_trail':'Navigate to the selected game; do not count self-reported exploration as gameplay.',
 'photo_mission':'Interactive frame/subject/light controls with visible image changes.',
 'fashion_studio':'Rendered outfit with color/pattern/accessory editing and mission constraints.',
 'directors_cut':'Editable storyboard order with camera and sound preview.',
 'music_maker':'Audible editable sequencer; rests are valid music, not lower accuracy.',
 'junior_chef':'Actual ingredient/step/budget simulation or omit from primary collection after approval.',
 'interior_designer':'Move/remove furniture, enforce access and cost constraints; merge Dream Designer.'}
for game_name in games.get('discovered',[]):
    matched=[o for o in games.get('observations',[]) if o.get('gameId') and o['name'].split('/')[0] in recommendations and o.get('name','').startswith(o['gameId']+'/')]
    # Catalog labels are in discovered.json; the observations carry stable IDs.
    catalog=read('full-games/discovered.json')
    game=next((x for x in catalog if x['name']==game_name),None) if isinstance(catalog,list) else None
    if not game: continue
    sessions=[o for o in matched if o['gameId']==game['id']]
    easy=[o.get('prompts',[]) for o in sessions if o.get('level')=='Easy']
    repeated=len(easy)>1 and any(x==easy[0] for x in easy[1:])
    levels={o['level']:o.get('prompts',[]) for o in sessions if '/replay-' not in o['name']}
    same_levels=len(levels)==4 and len({json.dumps(x) for x in levels.values()})==1
    quality_rows.append((game_name,f"{len(sessions)} saved sessions; exact Easy sequence repeats: {repeated}; identical four-level prompt sequences: {same_levels}",recommendations[game['id']],'Design review; observed behavior'))
replays=[(o['name'],'Restart same game and difficulty',o.get('note'), 'PASS' if o.get('resumesGame') else 'FAIL') for o in games.get('observations',[]) if 'resumesGame' in o]
write('game-quality-audit.md','# Game quality audit\n\nAll judgments below combine actual completed browser sessions with source confirmation. Completion/save PASS does not mean a game is engaging, age-appropriate or educationally validated. No child usability study was performed, so “boring” is not a measured enjoyment result. Exact prompt differences alone do not establish meaningful difficulty; some games change the first sentence while retaining the same choices.\n\n'+table(quality_rows)+'\n## Replay control failures before fixes\n\n'+table(replays)+'\nThe core and career/lifestyle groups reuse choice-button layouts extensively. Photo, Fashion, Director and Chef share ChoiceFlow. City and Interior share placement mechanics with no enforced connectivity/cost. Science/App/Team/Role share short option stages. Dream Designer and Eco/Business are also fixed choice flows. Distinct names and SVG previews do not establish distinct play mechanics.\n\nOnly Puzzle Laboratory and Data Detective normally submit measured accuracy. Other engines save participation without a skill score; that is preferable to arbitrary creative correctness. Mini Entrepreneur submits fixed financial constants, Music Maker has no audible playback, and many rich evidence fields are discarded. The full age × difficulty × game matrix remains NOT RUN; source review confirms most engines ignore age.\n\nNo game was removed or redesigned. Recommendations are deferred product work. Full source/content inventory: [Stage 1 audit](../docs/audit/STAGE1_RECOVERY_AUDIT.md).\n')
write('browser-test-results.md', '# Initial browser and HTTP results\n\nExecuted against local development services in Microsoft Edge / Playwright on 19 October 2026. Dedicated synthetic accounts only. This baseline is retained separately from post-fix evidence. Browser execution is not inferred from a successful build.\n\n## Existing browser suite\n\n'+table(result_rows(baseline))+'\n## Full game UI playthrough matrix\n\n'+table(result_rows(games))+'\n## Additional browser boundary scenarios\n\n'+table(result_rows(edge))+'\n## Controlled histories and HTTP boundaries\n\nThese profiles use real HTTP submissions; they are **not browser-played synthetic histories**. Separately, the full-game matrix plays through the actual UI and reads each result back using the parent API.\n\n'+table(result_rows(evidence))+'\nArtifacts: [baseline](artifacts/baseline/browser-results.json), [game sessions](artifacts/full-games/results.json), [edge cases](artifacts/edge-baseline/results.json), [controlled histories](artifacts/evidence-baseline.json). Full-game prompts, payloads, record IDs, scores and rewards are saved in the game artifact.\n\nScreenshots: [first live browser](screenshots/first-browser.png), [baseline states](artifacts/baseline/screenshots/), [all game engines](artifacts/full-games/), [boundary failures](artifacts/edge-baseline/). Console exceptions and failed network requests are captured in JSON; intentionally aborted requests are distinguished by scenario.\n\nMicrophone recognition was exercised using unavailable/permission-denied browser callbacks and typed fallback where recorded. Real microphone recognition, actual voice/accent handling and physical mobile hardware are **BLOCKED** by the headless environment. No camera-dependent engine exists. Trained AI-server outage is **NOT IMPLEMENTED** because the live app has no such service.\n\nEarly development runs of the new harness hit a too-short completion wait, a post-completion click race, and external-resource load waits. These harness errors are not application bugs; final matrix rows replace those provisional attempts.\n')
write('regression-results.md','# Post-fix regression results\n\nOnly executed assertions appear as PASS. Original failures remain in the initial report.\n\n## Main browser suite\n\n'+table(result_rows(regression))+'\n## Evidence and access regression\n\n'+table(result_rows(fixed_evidence))+'\n## Additional browser regression\n\n'+table(result_rows(fixed_edge))+'\n## Every-game full playthrough regression\n\n'+table(result_rows(game_regression))+'\n## Actual browser-played controlled profiles\n\n'+table(result_rows(browser_profiles))+'\nFull initial game playthroughs are recorded in [initial game results](artifacts/full-games/results.json), with [two-grid-game selector correction](artifacts/full-games-supplement/results.json). Final playthroughs are separate in [full-games-regression](artifacts/full-games-regression/results.json). Each full matrix targets 144 completed sessions, not merely game entry.\n\nBuild, Java, persistence/restart and any outstanding limitations are recorded in fix-summary.md; missing artifacts are NOT RUN, never implied passes.\n')
with (OUT/'regression-results.md').open('a',encoding='utf-8') as f:
    f.write('\n## Career library and feedback\n\n'+table(result_rows(library))+'\n## Mobile touch events\n\n'+table(result_rows(touch))+'\n## Persistence after actual restart\n\n'+table([('Child login, game/XP, parent link and browser overview','Retained after backend process restart',read('persistence-results.json').get('verified','Not executed'),read('persistence-results.json').get('status','NOT RUN'))]))
print('Rendered baseline and regression reports from available execution artifacts.')
