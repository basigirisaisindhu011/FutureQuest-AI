"""Local HTTP smoke checks; creates disposable users in the running H2 database."""
import secrets
import json
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]
results = []
def check(name, ok, detail=''):
    results.append(dict(name=name, passed=bool(ok), detail=detail))
    print(('PASS' if ok else 'FAIL') + ' ' + name + (': ' + str(detail) if detail else ''))
def call(path, method='GET', body=None, token=None, headers=None):
    h = {'Content-Type': 'application/json', **(headers or {})}
    if token: h['Authorization'] = 'Bearer ' + token
    req = Request('http://127.0.0.1:8080/api' + path, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    try:
        response = urlopen(req, timeout=20)
    except HTTPError as error:
        response = error
    raw = response.read().decode()
    try: data = json.loads(raw)
    except ValueError: data = raw
    return response.status, data, dict(response.headers)

with urlopen('http://127.0.0.1:5173/', timeout=20) as response:
    html = response.read().decode()
    check('Frontend HTTP entry', response.status == 200 and '/src/main.jsx' in html)
status, _, _ = call('/child/profile')
check('Anonymous child API denied', status in (401, 403), status)
child_form = dict(nickname='Smoke Explorer', avatar='rocket', ageGroup='11-13', pin='2468')
status, child, _ = call('/auth/child/register', 'POST', child_form)
check('Child registration', status == 201 and bool(child.get('token')), status)
ct = child['token']; cid = child['childId']; code = child['playerCode']
status, _, _ = call('/auth/child/register', 'POST', {**child_form, 'pin': '12'})
check('Invalid PIN rejected', status == 400, status)
status, _, _ = call('/auth/child/login', 'POST', dict(playerCode=code, pin='0000'))
check('Wrong child PIN rejected', status == 401, status)
status, login, _ = call('/auth/child/login', 'POST', dict(playerCode=code, pin='2468'))
check('Child login', status == 200 and login.get('childId') == cid, status)
status, profile, _ = call('/child/profile', token=ct)
check('Authenticated profile', status == 200 and profile.get('nickname') == child_form['nickname'], status)
status, empty, _ = call('/child/analysis', token=ct)
check('Empty analysis reports no evidence', status == 200 and empty.get('totalGamesPlayed') == 0 and not empty.get('enoughEvidence'), status)
status, levels, _ = call('/child/games/code_robot/levels', token=ct)
check('Four difficulties unlocked', status == 200 and len(levels) == 4 and all(x['unlocked'] for x in levels), status)
for level in ('EASY', 'MODERATE', 'MEDIUM', 'HARD'):
    status, data, _ = call('/child/games/code_robot/questions?level=' + level, token=ct)
    check('Robot question bank ' + level, status == 200 and len(data) > 0, status)
status, complete, _ = call('/child/games/level-complete', 'POST', dict(gameId='puzzle_lab', level='HARD', gameCategory='Technology & Logic', accuracy=80, duration=30), ct)
check('Scored game completion', status == 200 and complete.get('xpEarned') == 80, status)
status, open_ended, _ = call('/child/games/level-complete', 'POST', dict(gameId='invent_something', level='EASY', gameCategory='Engineering & Making', choicesMade=['Design', 'Revise']), ct)
check('Exploratory game completion', status == 200 and open_ended.get('xpEarned') == 40, status)
status, profile, _ = call('/child/profile', token=ct)
check('XP persisted across reads', status == 200 and profile.get('points') == 120, profile.get('points'))
status, timeline, _ = call('/child/timeline', token=ct)
check('Timeline contains both sessions', status == 200 and len(timeline) == 2, status)
status, analysis, _ = call('/child/analysis', token=ct)
check('Analysis counts sessions', status == 200 and analysis.get('totalGamesPlayed') == 2, status)
status, chat, _ = call('/ai/chat', 'POST', dict(message='coding'), ct)
check('Rule-based chatbot responds', status == 200 and bool(chat.get('response')), status)
suffix = str(time.time_ns())
parent_form = dict(username='smoke_' + suffix, email='smoke_' + suffix + '@example.test', password=secrets.token_urlsafe(24), role='PARENT')
status, parent, _ = call('/auth/register', 'POST', parent_form)
check('Parent registration', status == 200 and bool(parent.get('token')), status)
pt = parent['token']
status, _, _ = call('/auth/register', 'POST', parent_form)
check('Duplicate parent rejected', status == 400, status)
status, _, _ = call('/auth/login', 'POST', dict(username=parent_form['email'], password=parent_form['password']))
check('Parent email login', status == 200, status)
status, _, _ = call('/auth/login', 'POST', dict(username=parent_form['username'], password='incorrect'))
check('Wrong parent password rejected', status == 401, status)
status, _, _ = call(f'/parent/children/{cid}/insights', token=pt)
check('Unlinked parent denied over HTTP', status in (401, 403), status)
status, _, _ = call('/parent/link-child', 'POST', dict(playerCode=code, pin='2468'), pt)
check('Parent links player code', status == 200, status)
status, children, _ = call('/parent/children', token=pt)
check('Linked child listed', status == 200 and any(x['profileId'] == cid for x in children), status)
status, activity, _ = call(f'/parent/children/{cid}/activity', token=pt)
check('Parent sees persisted game records', status == 200 and len(activity.get('games', [])) == 2, status)
check('Open-ended record has no invented score', any(g['gameType'] == 'invent_something' and g['score'] is None for g in activity.get('games', [])))
status, insights, _ = call(f'/parent/children/{cid}/insights', token=pt)
check('Parent insights include recorded domains', status == 200 and insights.get('playCounts', {}).get('Technology & Logic') == 1 and insights.get('playCounts', {}).get('Engineering & Making') == 1, status)
status, _, _ = call('/parent/children', token=ct)
check('Child denied parent routes', status == 403, status)
status, _, _ = call('/child/profile', token=pt)
check('Parent denied child routes', status == 403, status)
status, careers, _ = call('/careers', token=ct)
check('Career library API responds', status == 200, 'entries=' + str(len(careers)))
status, _, _ = call('/child/quizzes', 'POST', dict(quizType='RIASEC', score=5, responses='{}'), ct)
check('Quiz submission route exists', status in (200, 201), status)
status, _, headers = call('/child/profile', 'OPTIONS', headers={'Origin': 'http://127.0.0.1:5173', 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization'})
check('Browser CORS preflight', status == 200 and any(k.lower() == 'access-control-allow-origin' for k in headers), status)
with tempfile.TemporaryDirectory() as tmp:
    data = Path(tmp) / 'input.json'; data.write_text(json.dumps(dict(logic_score=85, interests='coding')), encoding='utf-8')
    run = subprocess.run([sys.executable, str(ROOT / 'ai-analyzer/predict.py'), '--data', str(data)], capture_output=True, text=True)
    check('Python analyzer CLI valid input', run.returncode == 0 and 'Technology & Logic' in json.loads(run.stdout), run.stdout.strip())
    run = subprocess.run([sys.executable, str(ROOT / 'ai-analyzer/predict.py'), '--data', str(Path(tmp) / 'missing.json')], capture_output=True, text=True)
    check('Python analyzer rejects missing input', run.returncode != 0, 'exit=' + str(run.returncode) + ' output=' + run.stdout.strip())
# Negative checks deliberately report current defects without printing credentials.
check('Profile omits PIN hash', 'pinHash' not in profile)
status, _, _ = call('/ai/chat', 'POST', {}, ct)
check('Missing chat message rejected as bad request', status == 400, status)
status, _, _ = call('/child/games/level-complete', 'POST', dict(gameId='puzzle_lab', level='IMPOSSIBLE', accuracy=999), ct)
check('Invalid difficulty and accuracy rejected', status == 400, status)
status, _, _ = call('/auth/register', 'POST', {**parent_form, 'username': 'admin_' + suffix, 'email': 'admin_' + suffix + '@example.test', 'role': 'ADMIN'})
check('Public registration rejects ADMIN role', status in (400, 403), status)
report = ROOT / 'docs/local-smoke-results.json'
report.write_text(json.dumps(dict(executedAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'), checks=results), indent=2), encoding='utf-8')
print(str(sum(r['passed'] for r in results)) + '/' + str(len(results)) + ' checks passed; ' + str(report))
sys.exit(1 if any(not r['passed'] for r in results) else 0)
