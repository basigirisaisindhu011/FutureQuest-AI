import os
import random
import json

# Target domains
DOMAINS = [
    "Technology and Software", 
    "Medicine and Healthcare", 
    "Photography and Creative Media", 
    "Wildlife and Environmental Science",
    "Business and Entrepreneurship",
    "Design and Innovation"
]

def train_and_save():
    try:
        import pandas as pd
        import numpy as np
        from sklearn.ensemble import RandomForestClassifier
        import joblib
        
        print("Scikit-Learn detected. Generating synthetic training data...")
        
        # Generate synthetic records
        data = []
        for _ in range(500):
            # Features
            interest_tech = random.choice([0, 1])
            interest_photo = random.choice([0, 1])
            interest_wildlife = random.choice([0, 1])
            interest_business = random.choice([0, 1])
            interest_medical = random.choice([0, 1])
            
            score_coding = random.randint(0, 100) if interest_tech else random.randint(0, 50)
            score_photography = random.randint(0, 100) if interest_photo else random.randint(0, 50)
            score_business = random.randint(0, 100) if interest_business else random.randint(0, 50)
            score_healthcare = random.randint(0, 100) if interest_medical else random.randint(0, 50)
            score_design = random.randint(0, 100) if (interest_photo or interest_tech) else random.randint(0, 50)
            
            points = score_coding + score_photography + score_business + score_healthcare + score_design
            level = (points // 150) + 1
            
            # Label
            max_score = max(score_coding, score_photography, score_business, score_healthcare, score_design)
            if max_score == score_coding:
                domain = "Technology and Software"
            elif max_score == score_business:
                domain = "Business and Entrepreneurship"
            elif max_score == score_healthcare:
                domain = "Medicine and Healthcare"
            elif max_score == score_photography and interest_wildlife:
                domain = "Wildlife and Environmental Science"
            elif max_score == score_photography:
                domain = "Photography and Creative Media"
            else:
                domain = "Design and Innovation"
                
            data.append({
                "interest_tech": interest_tech,
                "interest_photo": interest_photo,
                "interest_wildlife": interest_wildlife,
                "interest_business": interest_business,
                "interest_medical": interest_medical,
                "score_coding": score_coding,
                "score_photography": score_photography,
                "score_business": score_business,
                "score_healthcare": score_healthcare,
                "score_design": score_design,
                "points": points,
                "level": level,
                "label": domain
            })
            
        df = pd.DataFrame(data)
        X = df.drop(columns=["label"])
        y = df["label"]
        
        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        clf.fit(X, y)
        
        model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
        joblib.dump(clf, model_path)
        print(f"RandomForestClassifier successfully trained and saved to {model_path}!")
        
    except ImportError:
        print("Python libraries (pandas, scikit-learn, joblib) not installed.")
        print("Using built-in pure Python rule fallback instead. No training needed.")

if __name__ == "__main__":
    train_and_save()
