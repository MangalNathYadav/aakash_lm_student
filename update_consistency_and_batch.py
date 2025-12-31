import json
import os
import glob
import math

STUDENTS_ROOT = r'public/api/students'
INDEX_FILE = r'public/api/students_index.json'

def compute_consistency(scores):
    if not scores: return 0
    n = len(scores)
    avg = sum(scores) / n
    if n < 2:
        return avg * 0.5 # Penalty for single test
    
    variance = sum((x - avg) ** 2 for x in scores) / n
    std_dev = math.sqrt(variance)
    
    # Coeff of variation (lower is more consistent)
    cv = std_dev / avg if avg > 0 else 1.0
    
    # Consistency Index: Higher is better performance AND stability
    # We factor in the number of tests to give more weight to long-term consistency
    test_factor = min(1.0, n / 10.0) # Reach full reliability at 10 tests
    
    # Score = Avg * (1 - CV) * test_factor
    # If CV is 0 (perfectly consistent), score is Avg * test_factor
    index = avg * (n / (n + 1)) * (1 / (cv + 1))
    return round(index, 2)

def update_data():
    student_dirs = [d for d in glob.glob(os.path.join(STUDENTS_ROOT, "*")) if os.path.isdir(d)]
    updated_index = []
    
    print(f"Updating {len(student_dirs)} students...")
    
    for s_dir in student_dirs:
        psid = os.path.basename(s_dir)
        p_path = os.path.join(s_dir, 'profile.json')
        if not os.path.exists(p_path): continue
        
        with open(p_path, 'r', encoding='utf-8') as f:
            profile = json.load(f)
            
        # 1. Update batch if name is present
        name = profile.get('name', 'Unknown')
        if name and name != "Unknown":
            profile['batch'] = "RMS1"
            if "meta" in profile:
                profile["meta"]["batch"] = "RMS1"
        
        # 2. Recalculate consistency index
        tests = profile.get('tests', [])
        scores = [t.get('marks', {}).get('total', 0) or 0 for t in tests]
        new_consistency = compute_consistency(scores)
        
        if "overall_performance" in profile:
            profile["overall_performance"]["consistency_index"] = new_consistency
            
        with open(p_path, 'w', encoding='utf-8') as f:
            json.dump(profile, f, indent=2)
            
        # Update index entry
        index_entry = {
            "psid": psid,
            "name": name,
            "batch": profile.get("batch", "N/A"),
            "tests_taken": len(tests),
            "latest_score": profile["overall_performance"]["latest_score"] if "overall_performance" in profile else 0,
            "trend": profile["overall_performance"]["trend"] if "overall_performance" in profile else "insufficient_data"
        }
        updated_index.append(index_entry)

    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(updated_index, f, indent=2)
    
    print("Batch and Consistency update complete.")

if __name__ == "__main__":
    update_data()
