"""Verify supplied Surefire reports, without inferring a Maven process exit code."""
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-reports/artifacts/continuation-maven'
rows = []
for report in sorted(OUT.glob('TEST-*.xml')):
    suite = ET.parse(report).getroot()
    source = ROOT / 'backend/src/test/java' / Path(*suite.attrib['name'].split('.')).with_suffix('.java')
    expected = re.findall(r'@Test\s+(?:public\s+)?void\s+(\w+)', source.read_text(encoding='utf-8'))
    cases = []
    for case in suite.findall('testcase'):
        status = 'FAIL' if case.find('failure') is not None or case.find('error') is not None else ('SKIPPED' if case.find('skipped') is not None else 'PASS')
        cases.append({'name': case.attrib['name'], 'status': status, 'seconds': case.get('time')})
    rows.append({'suite': suite.get('name'), 'report': report.relative_to(ROOT).as_posix(), 'report_sha256': hashlib.sha256(report.read_bytes()).hexdigest(), 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'reported_tests': int(suite.get('tests', 0)), 'failures': int(suite.get('failures', 0)), 'errors': int(suite.get('errors', 0)), 'skipped': int(suite.get('skipped', 0)), 'cases': cases, 'missing_test_methods': sorted(set(expected)-{c['name'] for c in cases}), 'report_mtime': report.stat().st_mtime, 'source_mtime': source.stat().st_mtime, 'report_at_least_as_new_as_source': report.stat().st_mtime >= source.stat().st_mtime})
verified = bool(rows) and all(r['reported_tests'] == len(r['cases']) and not r['missing_test_methods'] and r['report_at_least_as_new_as_source'] and not any(r[k] for k in ('failures', 'errors', 'skipped')) and all(c['status'] == 'PASS' for c in r['cases']) for r in rows)
data = {'test_suite_status': 'PASS' if verified else 'FAIL_OR_INCOMPLETE', 'tests': sum(r['reported_tests'] for r in rows), 'suites': rows, 'provenance': 'User-run Surefire artifacts discovered in backend/target/surefire-reports, copied unchanged for review. Overall Maven terminal exit/BUILD SUCCESS was not supplied and is not inferred.'}
(OUT / 'review.json').write_text(json.dumps(data, indent=2)+'\n', encoding='utf-8')
print(data['test_suite_status'], data['tests'], 'tests; suite failures/errors/skips:', [(r['failures'], r['errors'], r['skipped']) for r in rows])
