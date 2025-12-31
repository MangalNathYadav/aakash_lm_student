import json
import os
import glob
import math
import re
from collections import defaultdict, Counter
from datetime import datetime

# Path Config
ROOT = r'public/api'
EXTRACTION_FILE = os.path.join(ROOT, 'extraction_results.json')
SYLLABUS_FILE = os.path.join(ROOT, 'test_syllabus.json')
STUDENTS_DIR = os.path.join(ROOT, 'students')
LEADERBOARD_PUBLIC = os.path.join(ROOT, 'leaderboards', 'public')

def prefix_fix(p):
    if p == "NBTSR": return "NBTS"
    return p

def normalize_tid(tid):
    if not tid: return ""
    tid = str(tid).upper()
    pm = re.search(r"([A-Z]+)", tid)
    nm = re.search(r"(\d+)", tid)
    if pm and nm:
        p = pm.group(1)
        n = int(nm.group(1))
        return f"{prefix_fix(p)}{n}"
    return tid.replace("-", "").replace("_", "").replace(" ", "")

def parse_syllabus_date(date_str):
    if not date_str: return datetime(1900, 1, 1)
    try:
        clean = re.sub(r"(\d+)(st|nd|rd|th)", r"\1", date_str)
        clean = clean.replace("'", " ").replace(".", " ").replace("  ", " ")
        formats = ["%d %b %y", "%d %B %y"]
        for fmt in formats:
            try: return datetime.strptime(clean.strip(), fmt)
            except: continue
    except: pass
    return datetime(1900, 1, 1)

def compute_consistency(scores):
    if not scores or len(scores) == 0: return 0.0
    n = len(scores)
    avg = sum(scores) / n
    if avg == 0: return 0.0
    if n < 2: return round(avg * 0.4, 2)
    variance = sum((x - avg) ** 2 for x in scores) / n
    std_dev = math.sqrt(variance)
    cv = std_dev / avg
    reliability = min(1.0, math.log2(n + 1) / math.log2(15))
    return round(avg * (1 / (cv + 1)) * reliability, 2)

def run_pipeline():
    print("Starting Evalyx Data Pipeline (v2.3 - Priority Fix)...")
    
    with open(SYLLABUS_FILE, 'r', encoding='utf-8') as f:
        syllabus_list = json.load(f)
    
    syllabus_map = {}
    test_dates = {}
    test_order = {}
    for i, t in enumerate(syllabus_list):
        ntid = normalize_tid(t['test_id'])
        syllabus_map[ntid] = t['subjects']
        test_dates[ntid] = parse_syllabus_date(t['test_date'])
        test_order[ntid] = i
        
    with open(EXTRACTION_FILE, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    student_map = defaultdict(lambda: {"tests": [], "names": [], "batches": []})
    for test in raw_data:
        tid = test['test_id']
        norm_tid = normalize_tid(tid)
        syl_date = test_dates.get(norm_tid, datetime(1900, 1, 1))
        order_idx = test_order.get(norm_tid, 999)
        
        for s in test['students']:
            psid = s['psid']
            if not psid: continue
            student_map[psid]["tests"].append({
                "test_id": tid,
                "norm_tid": norm_tid,
                "syl_date": syl_date.isoformat(),
                "order_idx": order_idx,
                "marks": s['marks'],
                "center_rank": s.get('center rank'),
                "air_rank": s.get('air rank'),
                "percentile": s.get('percentile', 0)
            })
            if s.get('name'): student_map[psid]["names"].append(s['name'])
            if s.get('batch'): student_map[psid]["batches"].append(s['batch'])

    # Load Manual Names
    manual_names_file = os.path.join(ROOT, 'manual_names.json')
    manual_names = {}
    if os.path.exists(manual_names_file):
        with open(manual_names_file, 'r', encoding='utf-8') as f:
            manual_names = json.load(f)

    student_profiles = []
    for psid, info in student_map.items():
        # Override with manual name if provided
        if psid in manual_names:
            name = manual_names[psid]
        else:
            name = Counter(info["names"]).most_common(1)[0][0] if info["names"] else "Unknown"
            
        batch = Counter(info["batches"]).most_common(1)[0][0] if info["batches"] else "N/A"
        if name and name != "Unknown": batch = "RMS1"
            
        sorted_tests = sorted(info["tests"], key=lambda x: (x["syl_date"], x["order_idx"]))
        
        # Priority logic for "Latest"
        # 1. Find the latest test that happened according to chronological order
        # 2. BUT user specifically said FT08 is the latest happened.
        # So we filter out any test that has index > index of FT08 in the syllabus
        # OR we just prioritize FT tests.
        
        ft_08_index = test_order.get("FT8", 999)
        # Only consider tests up to FT08 as "Already Happened"
        happened_tests = [t for t in sorted_tests if t["order_idx"] <= ft_08_index]
        
        if happened_tests:
            latest_t = happened_tests[-1]
            latest_score = latest_t["marks"]["total"]
            latest_test_id = latest_t["test_id"]
        else:
            latest_t = sorted_tests[-1]
            latest_score = latest_t["marks"]["total"]
            latest_test_id = latest_t["test_id"]

        scores = [t["marks"]["total"] for t in sorted_tests if t["marks"].get("total") is not None]
        avg_score = sum(scores)/len(scores) if scores else 0
        best_score = max(scores) if scores else 0
        consistency = compute_consistency(scores)
        
        trend = "stable"
        if len(scores) >= 2:
            diff = scores[-1] - scores[-2]
            if diff > 10: trend = "improving"
            elif diff < -10: trend = "declining"

        subjects_data = {}
        chapter_stats = defaultdict(lambda: defaultdict(lambda: {"total": 0, "max": 0, "count": 0, "last_perc": 0}))
        for t in sorted_tests:
            ntid = t["norm_tid"]
            if ntid not in syllabus_map: continue
            syl = syllabus_map[ntid]
            for sub in ["physics", "chemistry", "botany", "zoology"]:
                sub_marks = t["marks"].get(sub, 0)
                sub_max = 180
                chapters = syl.get(sub, {}).get('chapters', [])
                for ch in chapters:
                    stat = chapter_stats[sub][ch]
                    stat["total"] += (sub_marks / len(chapters))
                    stat["max"] += (sub_max / len(chapters))

        for sub in ["physics", "chemistry", "botany", "zoology"]:
            strong, average, weak = [], [], []
            sub_percs = []
            chapter_list = []
            
            for ch, stat in chapter_stats[sub].items():
                perc = (stat["total"] / stat["max"] * 100) if stat["max"] > 0 else 0
                sub_percs.append(perc)
                
                # 0-10 Rating Scale Logic
                rating = round(perc / 10, 1)
                
                # Determine status based on rating
                if rating >= 8.0: 
                    strong.append(ch)
                    status = "Mastered"
                elif rating >= 5.0: 
                    average.append(ch)
                    status = "Average"
                else: 
                    weak.append(ch)
                    status = "Weak"
                    
                chapter_list.append({
                    "name": ch,
                    "rating": rating,
                    "percentage": round(perc),
                    "status": status
                })

            # Sort chapters by rating (lowest first for focus)
            chapter_list.sort(key=lambda x: x["rating"])

            subjects_data[sub] = {
                "average_percentage": round(sum(sub_percs)/len(sub_percs)) if sub_percs else 0,
                "strong_chapters": strong, 
                "average_chapters": average, 
                "weak_chapters": weak,
                "chapters": chapter_list
            }

        all_weak = [ch for sub in subjects_data for ch in subjects_data[sub]["weak_chapters"]]
        profile = {
            "psid": psid, "name": name, "batch": batch,
            "meta": {
                "tests_taken": len(sorted_tests),
                "latest_test_id": latest_test_id,
                "latest_test_order_idx": latest_t["order_idx"]
            },
            "overall_performance": {
                "average_total_score": round(avg_score),
                "best_score": best_score,
                "latest_score": latest_score,
                "consistency_index": consistency,
                "trend": trend
            },
            "subjects": subjects_data,
            "focus_insights": { "top_weak_chapters": all_weak[:5], "most_improved_chapters": [], "chapters_needing_attention": all_weak },
            "tests": sorted_tests
        }
        
        s_dir = os.path.join(STUDENTS_DIR, psid)
        if not os.path.exists(s_dir): os.makedirs(s_dir)
        with open(os.path.join(s_dir, 'profile.json'), 'w', encoding='utf-8') as f:
            json.dump(profile, f, indent=2)
        student_profiles.append(profile)

        # Graph Generation Logic
        graphs = []
        graph_definitions = [
            {"id": "all_tests_subject_trend", "title": "Overall Subject Performance (All Tests)", "filter": lambda t: True},
            {"id": "aiats_subject_trend", "title": "AIATS Subject Performance", "filter": lambda t: "AIATS" in t["norm_tid"]},
            {"id": "ft_subject_trend", "title": "Fortnightly Test (FT) Subject Performance", "filter": lambda t: "FT" in t["norm_tid"]},
            {"id": "nbts_subject_trend", "title": "NCERT Booster Test (NBTS) Subject Performance", "filter": lambda t: "NBTS" in t["norm_tid"]}
        ]

        for g_def in graph_definitions:
            filtered_tests = [t for t in sorted_tests if g_def["filter"](t)]
            
            # Skip if no tests found for this category
            if not filtered_tests:
                graphs.append({
                    "graph_id": g_def["id"],
                    "title": g_def["title"],
                    "x_axis": {"label": "Test Date", "values": []},
                    "datasets": []
                })
                continue

            dates = [t["syl_date"].split("T")[0] for t in filtered_tests]
            datasets = []
            
            for sub in ["physics", "chemistry", "botany", "zoology"]:
                data_points = []
                for t in filtered_tests:
                    m = t["marks"].get(sub)
                    # Convert to None if logic requires, but 0 is usually valid marks. 
                    # Requirement says "If a subject mark is missing... insert null". 
                    # get() returns None if missing, so we are good.
                    data_points.append(m)
                datasets.append({"subject": sub, "data": data_points})

            graphs.append({
                "graph_id": g_def["id"],
                "title": g_def["title"],
                "x_axis": {"label": "Test Date", "values": dates},
                "datasets": datasets
            })

        # Save Graphs
        graphs_dir = os.path.join(s_dir, 'graphs')
        if not os.path.exists(graphs_dir): os.makedirs(graphs_dir)
        with open(os.path.join(graphs_dir, 'subject_trends.json'), 'w', encoding='utf-8') as f:
            json.dump({"graphs": graphs}, f, indent=2)

        # --- Advanced Analytics Modules ---
        analysis_dir = os.path.join(s_dir, 'analysis')
        if not os.path.exists(analysis_dir): os.makedirs(analysis_dir)

        # Module 1: Progress Delta
        if len(sorted_tests) >= 2:
            earliest_t = sorted_tests[0]
            # Latest is already identified as latest_t
            
            # First vs Latest
            delta_total_first = latest_t["marks"]["total"] - earliest_t["marks"]["total"]
            
            # Recent Average (Last 3) vs Latest
            recent_tests = sorted_tests[-3:] if len(sorted_tests) >= 3 else sorted_tests
            avg_recent = sum(t["marks"]["total"] for t in recent_tests) / len(recent_tests)
            delta_total_recent = round(latest_t["marks"]["total"] - avg_recent)
            
            subjects_delta = {}
            for sub in ["physics", "chemistry", "botany", "zoology"]:
                 latest_sub = latest_t["marks"].get(sub, 0)
                 recent_sub_avg = sum(t["marks"].get(sub, 0) for t in recent_tests) / len(recent_tests)
                 subjects_delta[sub] = round(latest_sub - recent_sub_avg)
            
            delta_data = {
                "comparison_type": "last_3_tests_average_vs_latest",
                "total_score_delta": delta_total_recent,
                "first_test_delta": delta_total_first,
                "subjects": subjects_delta
            }
        else:
             delta_data = {
                "comparison_type": "insufficient_data",
                "total_score_delta": 0,
                "first_test_delta": 0,
                "subjects": {"physics": 0, "chemistry": 0, "botany": 0, "zoology": 0}
            }

        with open(os.path.join(graphs_dir, 'progress_delta.json'), 'w', encoding='utf-8') as f:
            json.dump(delta_data, f, indent=2)

        # Module 2: Consistency Analysis
        recent_n = 2
        consistency_tests = sorted_tests[-recent_n:]
        c_scores = [t["marks"]["total"] for t in consistency_tests]
        c_mean = sum(c_scores) / len(c_scores) if c_scores else 0
        
        c_level = "low"
        c_variance = 0
        c_interpretation = "Not enough data to calculate consistency."

        if len(c_scores) > 1 and c_mean > 0:
            c_variance = sum((x - c_mean) ** 2 for x in c_scores) / len(c_scores)
            c_std_dev = math.sqrt(c_variance)
            cv = c_std_dev / c_mean
            
            # Check for ANY significant drop in the last 2 tests
            last_two_drop = False
            drop_reason = ""
            
            if len(c_scores) >= 2:
                prev_score = c_scores[-2]
                curr_score = c_scores[-1]
                
                # Check absolute drop > 15 marks
                if (prev_score - curr_score) > 15:
                    last_two_drop = True
                    drop_reason = "Score dropped significantly."
                # Check percentage drop > 2%
                elif prev_score > 0 and (prev_score - curr_score) / prev_score > 0.02:
                    last_two_drop = True
                    drop_reason = "Score declined recently."

            if cv < 0.10 and not last_two_drop: 
                c_level = "high"
                c_interpretation = "Your performance is highly stable. You consistently score near your average."
            elif cv < 0.20 or ((cv < 0.10 or cv < 0.20) and last_two_drop):
                c_level = "medium"
                if last_two_drop:
                    c_interpretation = f"{drop_reason} Consistency rating adjusted."
                else:
                    c_interpretation = "Your performance shows moderate fluctuations."
            else:
                c_level = "low"
                c_interpretation = "Your scores are highly volatile or declining sharply."
        
        consistency_data = {
            "tests_considered": len(c_scores),
            "consistency_level": c_level,
            "variance": round(c_variance, 2),
            "interpretation": c_interpretation
        }

        with open(os.path.join(analysis_dir, 'consistency.json'), 'w', encoding='utf-8') as f:
            json.dump(consistency_data, f, indent=2)

        # Module 3: Readiness Indicator
        # Inputs: Trend (from profile), Consistency Level, Weak Chapters
        r_trend = profile["overall_performance"]["trend"]
        r_level = "needs_work"
        r_confidence = "medium"
        r_reasoning = "Based on your current trajectory."

        if r_trend == "improving" and c_level == "high":
            r_level = "ready"
            r_confidence = "high"
            r_reasoning = "You are showing consistent improvement, which is the best indicator of exam readiness."
        elif r_trend == "improving" and c_level == "medium":
            r_level = "ready"
            r_confidence = "medium"
            r_reasoning = "You are improving, though there is some fluctuation. Keep stabilizing your scores."
        elif r_trend == "stable" and c_level == "high":
            r_level = "moderate"
            r_confidence = "high"
            r_reasoning = "Your scores are stable. To be fully ready, try to push for an upward trend."
        elif r_trend == "stable" and c_level == "medium":
            r_level = "moderate"
            r_confidence = "medium"
            r_reasoning = "You are maintaining a steady pace with minor ups and downs."
        elif r_trend == "declining":
            r_level = "needs_work"
            r_confidence = "high"
            r_reasoning = "Your recent trend shows a decline. Focus on weak areas to arrest this fall immediately."
        else: # low consistency or other combos
            r_level = "needs_work"
            r_confidence = "low"
            r_reasoning = "High volatility in scores makes it hard to predict readiness. Focus on consistency."

        readiness_data = {
            "readiness_level": r_level,
            "confidence": r_confidence,
            "reasoning": r_reasoning
        }

        with open(os.path.join(analysis_dir, 'readiness.json'), 'w', encoding='utf-8') as f:
            json.dump(readiness_data, f, indent=2)

        # Module 4: Prediction & Explainability
        # Calculate Weighted Prediction
        p_recency_n = 5
        p_tests = sorted_tests[-p_recency_n:]
        p_weights = [i+1 for i in range(len(p_tests))] # e.g., 1, 2, 3, 4, 5
        p_weighted_sum = sum(t["marks"]["total"] * w for t, w in zip(p_tests, p_weights))
        p_weight_total = sum(p_weights)
        p_score_est = p_weighted_sum / p_weight_total if p_weight_total > 0 else 0
        
        # Determine Margin based on Consistency
        p_margin_pct = 0.08 # Default Low
        p_stability = "unstable"
        if c_level == "high":
            p_margin_pct = 0.03
            p_stability = "stable"
        elif c_level == "medium":
            p_margin_pct = 0.05
            p_stability = "moderately_stable"
            
        p_min = int(p_score_est * (1 - p_margin_pct))
        p_max = int(p_score_est * (1 + p_margin_pct))
        # Cap at 720
        p_max = min(p_max, 720)
        p_min = min(p_min, p_max)

        # Subject Contribution
        p_subj_status = {}
        p_overall_avg = sum(t["marks"]["total"] for t in sorted_tests) / len(sorted_tests) if sorted_tests else 0
        p_benchmark = p_overall_avg / 4.0 # Assuming equal weightage 180/720
        
        for sub in ["physics", "chemistry", "botany", "zoology"]:
            sub_scores = [t["marks"].get(sub, 0) for t in sorted_tests]
            sub_avg = sum(sub_scores) / len(sub_scores) if sub_scores else 0
            
            if sub_avg > p_benchmark * 1.05:
                p_subj_status[sub] = "boosting"
            elif sub_avg < p_benchmark * 0.95:
                p_subj_status[sub] = "limiting"
            else:
                p_subj_status[sub] = "neutral"

        # Reasoning Generation
        p_reasoning = []
        p_reasoning.append(f"Based on a weighted average of your last {len(p_tests)} tests, prioritizing recent performance.")
        if c_level == "high":
             p_reasoning.append("Your high consistency allows for a precise prediction range.")
        elif c_level == "low":
             p_reasoning.append("High volatility in your scores widens the prediction range.")
        
        if r_trend == "improving":
            p_reasoning.append("Your upward trend suggests potential to hit the upper bound of this range.")
        elif r_trend == "declining":
            p_reasoning.append("Recent score drops suggest caution; the lower bound is a realistic safety net.")

        # Range Narrowing Insight
        p_future_min = int(p_score_est * 0.97) # scenario high consistency
        p_future_max = int(p_score_est * 1.03)
        p_narrowing = {
            "future_range": {"min": p_future_min, "max": min(p_future_max, 720)},
            "condition": "If you maintain 'High' consistency for the next 3 tests."
        }

        prediction_output = {
            "psid": psid,
            "predicted_score_range": f"{p_min} - {p_max}",
            "confidence_level": "High" if c_level == "high" else ("Medium" if c_level == "medium" else "Low"),
            "prediction_explainability": {
                "reasoning": p_reasoning,
                "subject_contribution": p_subj_status,
                "range_narrowing": p_narrowing,
                "stability": {
                    "level": p_stability,
                    "explanation": f"Based on score variance of {consistency_data['variance']} across recent tests."
                }
            },
            "disclaimer": "This prediction is based on statistical extrapolation of past test results and assumes consistent study patterns."
        }
        
        # Save to root of student folder (matching previous observation)
        with open(os.path.join(s_dir, 'prediction.json'), 'w', encoding='utf-8') as f:
            json.dump(prediction_output, f, indent=2)

    # Leaderboards
    configs = [
        {"id": "latest_scores", "metric": lambda p: p["overall_performance"]["latest_score"]},
        {"id": "overall_average", "metric": lambda p: p["overall_performance"]["average_total_score"]},
        {"id": "consistency_index", "metric": lambda p: p["overall_performance"]["consistency_index"]},
    ]
    gen_time = datetime.now().isoformat()
    for cfg in configs:
        sorted_p = sorted(student_profiles, key=lambda p: (cfg["metric"](p), p["overall_performance"]["latest_score"]), reverse=True)
        entries = [{
            "rank": r, "name": p["name"], "batch": p["batch"],
            "psid": p["psid"], "score": cfg["metric"](p), "trend": p["overall_performance"]["trend"]
        } for r, p in enumerate(sorted_p, 1)]
        with open(os.path.join(LEADERBOARD_PUBLIC, f"{cfg['id']}.json"), 'w', encoding='utf-8') as f:
            json.dump({"entries": entries, "generated_at": gen_time}, f, indent=2)

    print(f"Pipeline Complete. FT08 enforced as latest baseline. Processed {len(student_profiles)} profiles.")

if __name__ == "__main__":
    run_pipeline()
