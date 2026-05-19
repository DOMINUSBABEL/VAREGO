import os
import json
import random
import datetime

# Configuración
OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
TOTAL_POSTS = 177

os.makedirs(OUTPUT_DIR, exist_ok=True)

import content_matrix

def generate_schedule():
    dates = []
    start_fase1 = datetime.datetime(2026, 5, 19, 0, 45)
    end_fase1 = datetime.datetime(2026, 5, 19, 12, 45)
    delta1 = (end_fase1 - start_fase1).total_seconds()
    
    for _ in range(20):
        dates.append(start_fase1 + datetime.timedelta(seconds=random.uniform(0, delta1)))
        
    start_fase2 = datetime.datetime(2026, 5, 20, 5, 7)
    
    def random_date_weighted():
        while True:
            r_day = random.randint(0, 3)
            r_hour = random.randint(0, 23)
            r_min = random.randint(0, 59)
            dt = start_fase2 + datetime.timedelta(days=r_day)
            dt = dt.replace(hour=r_hour, minute=r_min)
            
            weight = 0.2
            if 11 <= r_hour <= 14: weight = 0.8
            elif 15 <= r_hour <= 18: weight = 0.9
            elif 19 <= r_hour <= 22: weight = 1.0
            
            if random.random() < weight:
                return dt

    for _ in range(157):
        dates.append(random_date_weighted())
        
    dates.sort()
    return dates

def main():
    print("Generando cronograma y mini-columnas literarias de opinión...")
    schedule = generate_schedule()
    posts_data = []
    
    # Obtener 177 posts masivos de alta calidad literaria generados por Gemini Matrix
    generated_texts = content_matrix.generate_all_posts(TOTAL_POSTS)
            
    for i in range(TOTAL_POSTS):
        topic, text = generated_texts[i]
        
        posts_data.append({
            "id": i,
            "date": schedule[i].strftime("%Y-%m-%d %H:%M:%S"),
            "topic": topic,
            "text": text,
            "image_path": None
        })
        
    with open(os.path.join(OUTPUT_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts_data, f, indent=4, ensure_ascii=False)
            
    print(f"Finalizado. {TOTAL_POSTS} posts guardados en {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
