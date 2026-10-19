import sys
import json
import math
import argparse

DOMAINS = [
    "Communication & Language", "Technology & Logic", "Science & Exploration",
    "Creativity & Design", "Nature & Environment", "Social & Helping", "Business & Leadership"
]

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("Input must be a JSON object")
    if not isinstance(data.get("interests", ""), str):
        raise ValueError("interests must be text")
    for key in ("vocabulary_score", "logic_score", "listening_score", "science_score"):
        value = data.get(key, 0)
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not 0 <= value <= 100:
            raise ValueError(f"{key} must be a number between 0 and 100")
    return data

def predict_fallback(data):
    interests = data.get("interests", "").lower()
    
    vocab_score = data.get("vocabulary_score", 0)
    logic_score = data.get("logic_score", 0)
    listening_score = data.get("listening_score", 0)
    science_score = data.get("science_score", 0)
    
    predictions = []
    
    # Communication & Language
    if vocab_score >= 60 or listening_score >= 60 or "story" in interests or "read" in interests or "speak" in interests or "write" in interests:
        predictions.append("Communication & Language")
        
    # Technology & Logic
    if logic_score >= 60 or "tech" in interests or "coding" in interests or "robot" in interests:
        predictions.append("Technology & Logic")
        
    # Creativity & Design
    if "art" in interests or "design" in interests or "drawing" in interests:
        predictions.append("Creativity & Design")
        
    # Science & Exploration
    if science_score >= 60 or "science" in interests or "space" in interests:
        predictions.append("Science & Exploration")
        
    return predictions[:3]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to input json file")
    args = parser.parse_args()
    
    try:
        data = load_data(args.data)
        print(json.dumps(predict_fallback(data)))
    except (OSError, ValueError, TypeError) as error:
        print(json.dumps({"error": str(error)}), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
