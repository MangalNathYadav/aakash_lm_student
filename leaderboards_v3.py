import json
import os
import glob
from datetime import datetime

STUDENTS_ROOT = r'public/api/students'
OUTPUT_PUBLIC = os.path.join('public', 'api', 'leaderboards', 'public')
OUTPUT_PRIVATE = os.path.join('public', 'api', 'leaderboards', 'private')

if not os.path.exists(OUTPUT_PUBLIC): os.makedirs(OUTPUT_PUBLIC)
if not os.path.exists(OUTPUT_PRIVATE): os.makedirs(OUTPUT_PRIVATE)

def get_trend_val(trend):
    order = {"improving": 4, "stable": 3, "declining": 2, "insufficient_data": 1}
    return order.get(trend, 0)

def generate():
    student_dirs = [d for d in glob.glob(os.path.join(STUDENTS_ROOT, "*")) if os.path.isdir(d)]
    profiles = []
    
    for s_dir in student_dirs:
        p_path = os.path.join(s_dir, 'profile.json')
        if not os.path.exists(p_path): continue
        with open(p_path, 'r', encoding='utf-8') as f:
            profiles.append(json.load(f))
            
    gen_time = datetime.now().isoformat()
    
    configs = [
        {"id": "latest_scores", "type": "per_test_latest", "metric": lambda p: p["overall_performance"]["latest_score"]},
        {"id": "overall_average", "type": "overall_average", "metric": lambda p: p["overall_performance"]["average_total_score"]},
        {"id": "consistency_index", "type": "consistency_index", "metric": lambda p: p["overall_performance"].get("consistency_index", 0)},
        {"id": "subject_physics", "type": "subject_wise", "subject": "physics", "metric": lambda p: p["subjects"]["physics"]["average_percentage"]},
        {"id": "subject_chemistry", "type": "subject_wise", "subject": "chemistry", "metric": lambda p: p["subjects"]["chemistry"]["average_percentage"]},
        {"id": "subject_botany", "type": "subject_wise", "subject": "botany", "metric": lambda p: p["subjects"]["botany"]["average_percentage"]},
        {"id": "subject_zoology", "type": "subject_wise", "subject": "zoology", "metric": lambda p: p["subjects"]["zoology"]["average_percentage"]},
    ]
    
    for cfg in configs:
        def sort_key(p):
            metric_val = cfg["metric"](p)
            # Tie breakers
            return (
                metric_val, 
                p["overall_performance"]["best_score"], 
                p["meta"]["tests_taken"], 
                get_trend_val(p["overall_performance"]["trend"])
            )
            
        sorted_profiles = sorted(profiles, key=sort_key, reverse=True)
        
        priv = []
        pub = []
        
        for rank, p in enumerate(sorted_profiles, 1):
            score = cfg["metric"](p)
            
            common = {
                "rank": rank,
                "name": p.get("name", "Unknown"),
                "batch": p.get("batch", "N/A"),
                "score": score,
                "trend": p["overall_performance"]["trend"]
            }
            
            priv.append({**common, "psid": p["psid"]})
            pub.append({**common, "psid": "*******" + p["psid"][-3:]})
            
        with open(os.path.join(OUTPUT_PRIVATE, f"{cfg['id']}.json"), 'w', encoding='utf-8') as f:
            json.dump({"leaderboard_id": cfg["id"], "type": cfg["type"], "generated_at": gen_time, "entries": priv}, f, indent=2)
            
        with open(os.path.join(OUTPUT_PUBLIC, f"{cfg['id']}.json"), 'w', encoding='utf-8') as f:
            json.dump({"leaderboard_id": cfg["id"], "type": cfg["type"], "generated_at": gen_time, "entries": pub}, f, indent=2)
            
    print(f"Leaderboards regenerated for {len(profiles)} students.")

if __name__ == "__main__":
    generate()
