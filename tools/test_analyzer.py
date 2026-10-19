import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'ai-analyzer' / 'predict.py'
class AnalyzerValidationTests(unittest.TestCase):
    def run_input(self, text):
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / 'input.json'
            if text is not None:
                file.write_text(text, encoding='utf-8')
            return subprocess.run([sys.executable, str(SCRIPT), '--data', str(file)], capture_output=True, text=True)
    def test_valid_input_and_empty_evidence(self):
        for data, expected in [({'logic_score': 60}, ['Technology & Logic']), ({}, [])]:
            result = self.run_input(json.dumps(data))
            self.assertEqual(result.returncode, 0)
            self.assertEqual(json.loads(result.stdout), expected)
    def test_missing_or_malformed_files_are_detectable_failures(self):
        for data in [None, '{bad json']:
            with self.subTest(data=data):
                result = self.run_input(data)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, '')
                self.assertIn('error', json.loads(result.stderr))
    def test_invalid_schema_and_scores_do_not_invent_predictions(self):
        for data in [[], None, {'interests': None}, {'logic_score': '80'}, {'logic_score': -1}, {'science_score': 101}, {'logic_score': True}]:
            with self.subTest(data=data):
                result = self.run_input(json.dumps(data))
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, '')
if __name__ == '__main__':
    unittest.main()
