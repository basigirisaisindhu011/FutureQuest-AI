"""Stage 1 source inventory and isolated analyzer probes; no app/database writes."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'audit'
OUT.mkdir(parents=True, exist_ok=True)
paths = [ROOT / 'README.md']
for folder in ('frontend/src', 'backend/src', 'ai-analyzer', 'frontend/tests', 'tools'):
    paths.extend(p for p in (ROOT / folder).rglob('*') if p.is_file() and p.suffix in {'.java', '.js', '.jsx', '.css', '.py', '.mjs', '.properties'})
paths.extend(ROOT / name for name in ('backend/pom.xml', 'backend/Dockerfile', 'frontend/package.json', 'frontend/vite.config.js', 'frontend/vercel.json', 'frontend/eslint.config.js'))
inventory = []
for path in sorted(set(paths)):
    data = path.read_bytes()
    source = data.decode('utf-8-sig')
    inventory.append({'path': path.relative_to(ROOT).as_posix(), 'lines': len(source.splitlines()), 'sha256': hashlib.sha256(data).hexdigest()})
models = {}
for path in sorted((ROOT / 'backend/src/main/java/com/careerquest/backend/model').glob('*.java')):
    source = path.read_text(encoding='utf-8')
    models[path.stem] = {'table': re.findall(r'@Table\(name\s*=\s*"([^"]+)"', source), 'fields': re.findall(r'^\s*private\s+([\w<>]+)\s+(\w+)\s*[;=]', source, re.M)}
routes = {}
for path in sorted((ROOT / 'backend/src/main/java/com/careerquest/backend/controller').glob('*.java')):
    source = path.read_text(encoding='utf-8')
    routes[path.stem] = re.findall(r'@(Request|Get|Post|Put|Delete)Mapping(?:\("([^"]*)"\))?', source)
profiles = {
    'creative': {'interests': 'art drawing design'},
    'technology': {'interests': 'coding robot', 'logic_score': 85},
    'science': {'interests': 'science space', 'science_score': 85},
    'balanced': {'interests': 'art coding science story', 'logic_score': 70, 'science_score': 70, 'vocabulary_score': 70},
    'high_interest_developing_skill': {'interests': 'coding robot', 'logic_score': 20},
    'limited_history': {},
    'skill_without_stated_interest': {'logic_score': 95},
    'nature_only': {'interests': 'nature wildlife environment'},
}
probes = []
with tempfile.TemporaryDirectory() as temp:
    for name, data in profiles.items():
        input_path = Path(temp) / 'profile.json'
        input_path.write_text(json.dumps(data), encoding='utf-8')
        runs = []
        for _ in range(2):
            result = subprocess.run([sys.executable, str(ROOT / 'ai-analyzer/predict.py'), '--data', str(input_path)], capture_output=True, text=True)
            runs.append({'exit': result.returncode, 'output': json.loads(result.stdout) if result.stdout else None, 'stderr': result.stderr})
        probes.append({'name': name, 'input': data, 'runs': runs, 'repeat_equal': runs[0] == runs[1]})
report = {'scope': '2026-10-19 Stage 1; current working tree; static extraction and isolated CLI only', 'files': inventory, 'models': models, 'controller_mappings': routes, 'analyzer_probes': probes}
target = OUT / 'stage1-evidence.json'
target.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(f'Inventoried {len(inventory)} files and {len(models)} models; ran {len(probes) * 2} analyzer CLI probes.')
for probe in probes:
    print(probe['name'], probe['runs'][0]['output'], 'repeat_equal=', probe['repeat_equal'])
