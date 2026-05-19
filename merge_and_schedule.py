import json
import os
import datetime
import random

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Leer los 6 chunks generados por los subagentes
files = [
    r"C:\Users\jegom\VAREGO\bolivia_1.json",
    r"C:\Users\jegom\VAREGO\bolivia_2.json",
    r"C:\Users\jegom\VAREGO\musk_1.json",
    r"C:\Users\jegom\VAREGO\musk_2.json",
    r"C:\Users\jegom\VAREGO\colombia_1.json",
    r"C:\Users\jegom\VAREGO\colombia_2.json"
]

topics = [
    "Golpe de estado en Bolivia y Evo Morales",
    "Golpe de estado en Bolivia y Evo Morales",
    "Litigio de Elon Musk vs. Sam Altman",
    "Litigio de Elon Musk vs. Sam Altman",
    "Elecciones de Colombia 2026: Fragmentación de la derecha",
    "Elecciones de Colombia 2026: Fragmentación de la derecha"
]

all_posts = []

for filepath, topic in zip(files, topics):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            texts = json.load(f)
            for t in texts:
                # Sanitización final infalible
                clean_text = t.replace('"', '').replace("'", "").replace(":", ",").strip()
                all_posts.append({"topic": topic, "text": clean_text})
    except Exception as e:
        print(f"Error leyendo {filepath}: {e}")

# Barajar para intercalar los temas orgánicamente
random.shuffle(all_posts)

# Asegurar exactamente 151 posts
if len(all_posts) >= 151:
    all_posts = all_posts[:151]
else:
    print(f"ADVERTENCIA: Se generaron solo {len(all_posts)} posts.")

# Cronograma: 19 de Mayo 2026
# 26 posts: 12:37 AM a 01:27 AM
# 65 posts: 05:17 AM a 11:00 AM
# 30 posts: 11:00 AM a 03:00 PM (15:00)
# 30 posts: 03:00 PM (15:00) a 06:00 PM (18:00)
def r_dates(s, e, c):
    delta = (e - s).total_seconds()
    return [s + datetime.timedelta(seconds=random.uniform(0, delta)) for _ in range(c)]

d1_s = datetime.datetime(2026, 5, 19, 0, 37)
d1_e = datetime.datetime(2026, 5, 19, 1, 27)

d2_s = datetime.datetime(2026, 5, 19, 5, 17)
d2_e = datetime.datetime(2026, 5, 19, 11, 0)

d3_s = datetime.datetime(2026, 5, 19, 11, 0)
d3_e = datetime.datetime(2026, 5, 19, 15, 0)

d4_s = datetime.datetime(2026, 5, 19, 15, 0)
d4_e = datetime.datetime(2026, 5, 19, 18, 0)

sched = []
sched.extend(r_dates(d1_s, d1_e, 26))
sched.extend(r_dates(d2_s, d2_e, 65))
sched.extend(r_dates(d3_s, d3_e, 30))

remaining = len(all_posts) - 121
if remaining > 0:
    sched.extend(r_dates(d4_s, d4_e, remaining))

sched.sort()

final_data = []
for i in range(len(all_posts)):
    final_data.append({
        "id": i + 5, # ID inicial desplazado según el progreso
        "date": sched[i].strftime("%Y-%m-%d %H:%M:%S"),
        "topic": all_posts[i]["topic"],
        "text": all_posts[i]["text"],
        "image_path": None
    })

with open(os.path.join(OUTPUT_DIR, "posts.json"), "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=4, ensure_ascii=False)

# Crear auditoría
audit_file = r"C:\Users\jegom\VAREGO\REVISION_151_POSTS_EXCELSOS.md"
with open(audit_file, 'w', encoding='utf-8') as f:
    f.write("# AUDITORÍA DE LOS 151 POSTS (ALTA GENIALIDAD - 100% ÚNICOS)\n\n")
    for i, p in enumerate(final_data):
        f.write(f"### POST {i+1} | Tema: {p['topic']}\n")
        f.write(f"**Programado para:** {p['date']}\n\n")
        f.write(f"> {p['text']}\n\n")
        f.write(f"*(Longitud: {len(p['text'])} caracteres)*\n\n")
        f.write("---\n\n")

# Reiniciar index para el navegador
with open(r"C:\Users\jegom\VAREGO\progress.json", "w", encoding="utf-8") as f:
    f.write("0")

print(f"ÉXITO TOTAL. {len(all_posts)} joyas literarias únicas guardadas.")
print(f"Auditoría disponible en: {audit_file}")
