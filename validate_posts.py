# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

posts_path = r"C:\Users\jegom\output\177_posts\posts.json"
if not os.path.exists(posts_path):
    print("Error: posts.json does not exist!")
    sys.exit(1)

with open(posts_path, "r", encoding="utf-8") as f:
    posts = json.load(f)

errors = []
forbidden_names = ["Hegel", "Kojéve", "Kojeve", "Escohotado"]

for i, p in enumerate(posts):
    text = p["text"]
    length = len(text)
    
    # Check length
    if length > 280:
        errors.append(f"Post {i} exceeds 280 chars ({length} chars): {text[:30]}...")
        
    # Check quotes
    quotes = ['"', "'", "«", "»", "“", "”", "‘", "’"]
    for q in quotes:
        if q in text:
            errors.append(f"Post {i} contains quote '{q}': {text}")
            
    # Check colons
    if ":" in text:
        errors.append(f"Post {i} contains colon ':': {text}")
        
    # Check forbidden names
    for name in forbidden_names:
        if name.lower() in text.lower():
            errors.append(f"Post {i} contains forbidden philosopher name '{name}': {text}")

if errors:
    print(f"Validation failed with {len(errors)} errors:")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
else:
    print(f"All {len(posts)} posts are 100% compliant!")
