import json
import random
import datetime
import os

posts_path = r"C:\Users\jegom\output\177_posts\posts.json"
with open(posts_path, "r", encoding="utf-8") as f:
    posts = json.load(f)

# Current local time: May 21, 2026, 16:24:09.
# Starting the remaining window from May 21, 2026, 16:35:00
start_time = datetime.datetime(2026, 5, 21, 16, 35, 0)
end_time = start_time + datetime.timedelta(hours=6)

total_seconds = (end_time - start_time).total_seconds()
remaining_count = len(posts) - 2

random_seconds = [random.uniform(0, total_seconds) for _ in range(remaining_count)]
random_seconds.sort()

for idx, sec in enumerate(random_seconds):
    post_idx = 2 + idx
    new_date = start_time + datetime.timedelta(seconds=sec)
    posts[post_idx]["date"] = new_date.strftime("%Y-%m-%d %H:%M:%S")

with open(posts_path, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=4, ensure_ascii=False)

print(f"Successfully adjusted schedule for the remaining {remaining_count} posts over the next 6 hours.")
