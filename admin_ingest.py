import sys
import os
import json
import re
from datetime import datetime
import importlib.util

# Configuration
STUDENTS_DIR = os.path.join('public', 'api', 'students')

def log(msg):
    print(msg)
    sys.stdout.flush()

def check_dependencies():
    # Check for pdfplumber
    if importlib.util.find_spec("pdfplumber") is None:
        log("ERROR: 'pdfplumber' library not found. Please run: pip install pdfplumber")
        sys.exit(1)

def parse_pdf(pdf_path):
    import pdfplumber
    results = []
    
    log(f"Opening PDF: {pdf_path}")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                log(f"Processing page {page_num + 1}...")
                
                # Table extration strategy
                # Aakash PDFs usually have tables. We'll look for tables.
                tables = page.extract_tables()
                
                for table in tables:
                    # Heuristic: Find header row
                    header_idx = -1
                    headers = []
                    
                    for i, row in enumerate(table):
                        # Clean row values
                        clean_row = [str(c).lower().strip() if c else "" for c in row]
                        
                        # Look for identifying columns
                        if any("psid" in c or "roll" in c for c in clean_row) and \
                           any("phy" in c or "che" in c for c in clean_row):
                            header_idx = i
                            headers = clean_row
                            break
                    
                    if header_idx != -1:
                        # Process data rows
                        for row in table[header_idx+1:]:
                            if not row or not row[0]: continue
                            
                            student_data = parse_row(row, headers)
                            if student_data:
                                results.append(student_data)
                                
    except Exception as e:
        log(f"Error reading PDF: {str(e)}")
        # Fallback manual text parsing (Mock logic for stability if generic table fails)
        pass

    return results

def parse_row(row, headers):
    # Map headers to indices
    # We need PSID, Physics, Chem, Bot, Zoo
    try:
        data = {}
        row = [str(c).strip() if c else "0" for c in row]
        
        # Regex helper
        def get_idx(keywords):
            for k in keywords:
                for i, h in enumerate(headers):
                    if k in h: return i
            return -1

        psid_idx = get_idx(["psid", "roll", "id"])
        phy_idx = get_idx(["phys", "phy"])
        che_idx = get_idx(["chem", "che"])
        bot_idx = get_idx(["bot"])
        zoo_idx = get_idx(["zoo"])
        tot_idx = get_idx(["total", "score", "marks"])

        if psid_idx == -1: return None

        data['psid'] = row[psid_idx].strip()
        
        # Safe number conversion
        def to_float(val):
            try:
                return float(re.sub(r'[^\d.]', '', val))
            except:
                return 0.0

        if phy_idx != -1: data['physics'] = to_float(row[phy_idx])
        if che_idx != -1: data['chemistry'] = to_float(row[che_idx])
        if bot_idx != -1: data['botany'] = to_float(row[bot_idx])
        if zoo_idx != -1: data['zoology'] = to_float(row[zoo_idx])
        
        # Calculate total if missing
        calc_total = data.get('physics',0) + data.get('chemistry',0) + data.get('botany',0) + data.get('zoology',0)
        
        if tot_idx != -1:
            data['total'] = to_float(row[tot_idx])
        else:
            data['total'] = calc_total
            
        return data

    except Exception as e:
        # log(f"Row parse error: {e}")
        return None

def update_student(data, test_id, test_type, test_date, max_marks):
    psid = data['psid']
    # Pad PSID if necessary (Aakash usually 11 digits, but existing system uses 11)
    # Check if directory exists
    
    s_path = os.path.join(STUDENTS_DIR, psid)
    p_path = os.path.join(s_path, 'profile.json')
    
    if not os.path.exists(p_path):
        log(f"Skipping {psid}: Profile not found.")
        return False
        
    try:
        with open(p_path, 'r', encoding='utf-8') as f:
            profile = json.load(f)
            
        # Check for duplicate
        existing_tests = profile.get("tests", [])
        for t in existing_tests:
            if t.get("norm_tid") == test_id:
                log(f"Skipping {psid}: Test {test_id} already exists.")
                return False
        
        # Create new test object
        # Format: {"syl_date": "2025-06-15T00:00:00", "marks": {...}, "norm_tid": "FT_01", "order_idx": ...}
        
        # Generate order_idx based on date
        dt = datetime.strptime(test_date, "%Y-%m-%d")
        ts = int(dt.timestamp())
        
        new_test = {
            "syl_date": f"{test_date}T00:00:00",
            "marks": {
                "physics": data.get('physics', 0),
                "chemistry": data.get('chemistry', 0),
                "botany": data.get('botany', 0),
                "zoology": data.get('zoology', 0),
                "total": data.get('total', 0)
            },
            "norm_tid": test_id,
            "order_idx": ts, // Simple timestamp based order
            "meta": {
                "ingested_at": datetime.now().isoformat(),
                "test_type": test_type
            }
        }
        
        existing_tests.append(new_test)
        # Sort tests by order_idx (date)
        existing_tests.sort(key=lambda x: x.get("order_idx", 0))
        
        profile['tests'] = existing_tests
        
        # Note: We won't update 'overall_performance' here, 
        # we will rely on evalyx_engine.py to re-calculate that.
        
        with open(p_path, 'w', encoding='utf-8') as f:
            json.dump(profile, f, indent=2)
            
        log(f"Updated {psid} with match.")
        return True
        
    except Exception as e:
        log(f"Error updating {psid}: {e}")
        return False

def main():
    if len(sys.argv) < 6:
        log("Usage: python admin_ingest.py <pdf_path> <test_id> <type> <date> <max>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    test_id = sys.argv[2]
    test_type = sys.argv[3]
    test_date = sys.argv[4]
    max_marks = float(sys.argv[5])

    log("Initializing Pipeline...")
    check_dependencies()
    
    # 1. Parsing
    log("Stage 1: PDF Extraction")
    results = parse_pdf(pdf_path)
    
    if not results:
        log("No data found in PDF. Check format or ensure table headers match (PSID, Phy, Chem, Bot, Zoo).")
        # For DEMONSTRATION purposes if extraction fails (no real PDF):
        # We might inject a dummy record for the logged in user if they exist
        # But for 'admin-only' strict mode, we should just exit.
        sys.exit(0)
        
    log(f"Found {len(results)} rows.")

    # 2. Ingestion
    log("Stage 2: Database Update")
    updated = 0
    for r in results:
        if update_student(r, test_id, test_type, test_date, max_marks):
            updated += 1
            
    log(f"Pipeline Complete. Updated {updated} profiles.")
    
    # 3. Analytics Refresh
    if updated > 0:
        log("Stage 3: Triggering Evalyx Engine for Analytics Refresh...")
        # We can import evalyx_engine logic or just run it via os.system
        # Running via os.system is safer to avoid context pollution in this script
        exit_code = os.system("python evalyx_engine.py")
        if exit_code == 0:
            log("Analytics refreshed successfully.")
        else:
            log("Warning: Analytics refresh returned error.")

if __name__ == "__main__":
    main()
