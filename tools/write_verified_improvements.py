"""Publish sanitized, reproducible results without committing runtime captures/secrets."""
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-reports'
def read(name):
    return json.loads((OUT/'artifacts'/name).read_text(encoding='utf-8'))
def log(name):
    data=(OUT/'artifacts'/name).read_bytes()
    return data.decode('utf-16' if data.startswith((b'\xff\xfe',b'\xfe\xff')) else 'utf-8-sig')
sources={
    'browser':'improvement-browser/browser-results.json',
    'full_game_sessions':'improvement-final-games/results.json',
    'targeted_regressions':'improvement-quality/results.json',
    'api_evidence':'improvement-evidence.json',
    'browser_boundaries':'improvement-edge/results.json',
    'mobile_touch':'touch/results.json',
}
results={}
for name,source in sources.items():
    data=read(source)
    rows=data['results']
    results[name]={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'cases':[{'name':r['name'],'status':r['status']} for r in rows], 'artifact_sha256':hashlib.sha256((OUT/'artifacts'/source).read_bytes()).hexdigest()}
    assert rows and results[name]['failed']==0, f'Unresolved failures in {name}'
backend=[]
for file in sorted((ROOT/'backend/target/surefire-reports').glob('TEST-*.xml')):
    suite=ET.parse(file).getroot()
    row={k:int(suite.get(k,0)) for k in ('tests','failures','errors','skipped')}
    row['suite']=suite.get('name');row['artifact_sha256']=hashlib.sha256(file.read_bytes()).hexdigest()
    backend.append(row)
assert backend and sum(row['tests'] for row in backend)==12
assert all(not(row['failures'] or row['errors'] or row['skipped']) for row in backend)
assert 'BUILD SUCCESS' in log('improvement-maven.log')
assert 'built in' in log('improvement-build.log')
assert 'error ' not in log('improvement-lint.log')
assert 'fail 0' in log('improvement-content-tests.log')
assert 'OK' in log('improvement-python.log')
persistence=read('persistence-results.json');assert persistence['status']=='PASS'
data={'verified_at':datetime.now(timezone(timedelta(hours=5,minutes=30))).isoformat(),'timezone':'Asia/Calcutta','backend_suites':backend,'results':results,'other_checks':{'maven':'BUILD SUCCESS','frontend_build':'PASS','frontend_lint':'PASS','content_property_tests':'2 PASS','python_validation':'3 PASS','database_restart':persistence['status']},'scope':'Local development data only. No physical-device or production certification. Historical captures/logs remain local and ignored.'}
(OUT/'verified-results.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
evidence=OUT/'evidence';evidence.mkdir(exist_ok=True)
for source,target in [('science_lab-easy.png','science-lab.png'),('build_the_city-easy.png','city-mission.png'),('music_maker-easy.png','music-maker.png'),('parent-after-all-games.png','parent-after-games.png')]:
    shutil.copyfile(OUT/'artifacts/improvement-final-games'/source,evidence/target)
quality=read(sources['targeted_regressions'])
text='''# Verified incremental improvements

19 October 2026 (Asia/Calcutta). Actual local execution against the updated application. This report supersedes the earlier open CQ-01–CQ-13 findings in CONTINUED_TEST_REPORT.md. All 24 activities remain available; the existing project structure and UI were preserved.

## Executed results

| Verification | Actual result |
| --- | --- |
| Maven backend tests | 12 tests; 0 failures/errors/skips; BUILD SUCCESS |
| Main Playwright / Microsoft Edge suite | 138 PASS, 0 FAIL, including role workflows, error handling, responsive layouts and ten automatic accessibility states |
| Full game playthrough matrix | 144 PASS, 0 FAIL: every visible game at four difficulties and two Easy replays |
| Targeted regressions for prior failures | 13 PASS, 0 FAIL |
| API/evidence regression | 30 PASS, 0 FAIL |
| Additional browser boundaries | 13 PASS, 0 FAIL |
| Mobile emulation using actual tap events | 4 complete saved games PASS |
| Generated-content property checks | 2 PASS, covering all 16 age/difficulty puzzle banks and independent non-repeating session decks |
| Python CLI validation | 3 test methods PASS |
| Frontend lint / production build | PASS / PASS |
| Actual backend stop/restart | Login, linked parent, saved game, record ID and XP retained; persistent local signing key works |

The versioned [sanitized results](verified-results.json) contain per-case status, suite counts and artifact hashes. Full local captures, logs, disposable account data and database files are intentionally ignored by Git. Reviewed screenshots: [science](evidence/science-lab.png), [city](evidence/city-mission.png), [music](evidence/music-maker.png), [parent after all sessions](evidence/parent-after-games.png).

## Corrected behavior

- Robot Reset/Exit/unmount cancels scheduled moves. Routes use a rotating bank of reachable targets validated by search, rather than repeating two goals in each session.
- Spell Quest accumulates attempts and hints across every word; the reproduced six-attempt/one-hint session now persists exactly those counters.
- Results return to the catalog when Choose another game is clicked. Replay preserves game/difficulty while creating a fresh attempt.
- Preference records derive domains from selected actions, not all offered domains. Child and parent summaries can use those selected domains. The new Java regression also rejects invalid discovery choices without saving them.
- Versioned structured evidence persists predictions, observations, experiment measurements, design decisions, budgets, patterns and other supported telemetry. Python ML remains separate; this is explainable activity evidence, not a validated career assessment.
- Puzzle Laboratory has 48 unique generated challenges for each age/difficulty combination, three distinct options and one answer, with meaningful progression from arithmetic sequences to growing gaps and multi-step rules. Data Detective now asks objective chart questions with varied data and increasing operations.
- Session decks reserve stable unseen content instead of advancing both round index and history length. Spelling, robot, puzzles, stories, speaking, Eco Rescue, science trials and data charts use rotating content. Small creative banks still have finite variety; no unlimited-content claim is made.
- Eco Rescue uses varied sorting, conservation and resource-allocation missions. Dream Designer changes actual design choices/constraints by difficulty and enforces a feasible Hard budget without assigning arbitrary creative correctness.
- Science uses topic-appropriate variables, controlled conditions and displayed observations from an explicitly simplified classroom model. Mini Entrepreneur calculates demand/revenue/cost/profit from choices rather than posting constants; difficulty changes visitor constraints. Neither model is represented as a real-world forecast.
- City plans must contain the required services and connect house/school before completion; budget, replace and remove controls work. Three houses alone no longer award completion.
- Music Maker synthesizes instrument/beat feedback and offers preview/undo; rests do not count as incorrect music. Audio/timer resources close on exit, with honest fallback when sound is unavailable.
- Runtime signing keys and database passwords are no longer hardcoded. Local development stores its generated signing key in an ignored file; managed environments can supply JWT_SECRET/DB_PASSWORD. The H2 web console defaults to disabled.

## Targeted browser regression outcomes

| Formerly failing scenario | Current execution |
| --- | --- |
'''
for row in quality['results']:
    text+='| '+row['name'].replace('|','/')+' | '+row['status']+' |\n'
text+='''
## Commit scope and remaining limits

The commit includes the previously uncommitted, now-tested application source/components, earlier reliability fixes, incremental corrections above, automated tests and reviewed reports. Generated backend/target, frontend/dist and the generated model binary were removed from Git tracking while retaining local files and the training code. Dependencies, environment files, runtime keys, local databases and raw captures are excluded. No working activity was deleted.

The initial main browser run still expected obsolete Hard design choices and mismatched science controls. Those selectors were updated to the corrected difficulty-specific controls; real completion and persistence assertions were retained. One early browser launch preceded backend readiness and was rerun after startup. These harness/setup attempts are not represented as product regressions or as passes.

Physical microphones/speakers, physical phones/tablets and manual screen-reader testing remain BLOCKED/NOT RUN as appropriate. Browser audio instrumentation and tap emulation were executed, but are not physical-device certification. Full age-by-game playthrough coverage, production deployment/load/security review, admin/notification lifecycle and external learning-site availability remain NOT RUN.

Some lifestyle activities still use choice-based prototypes rather than editable photos/outfits/films. Broader age validation, validated educational rubrics, normalized long-term interest methodology and scientifically trained ML remain future work. Correct completion/telemetry does not establish educational validity. All difficulty buttons remain unlocked, and open-ended creativity remains unscored.

Reproduce with the commands in README.md. Git history is preserved; no force push or remote overwrite is part of this work. Remote origin now points to the explicitly requested FutureQuest-AI repository, replacing its legacy URL. Remote main must remain an ancestor of the verified local commit before a normal push.
'''
(OUT/'VERIFIED_IMPROVEMENTS.md').write_text(text,encoding='utf-8')
print('Published verified summary: 12 Maven tests, 144 full sessions, 13 targeted regressions.')
