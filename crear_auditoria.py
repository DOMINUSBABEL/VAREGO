import json
import os

input_file = r"C:\Users\jegom\output\177_posts\posts.json"
output_file = r"C:\Users\jegom\VAREGO\REVISION_151_POSTS.md"

with open(input_file, 'r', encoding='utf-8') as f:
    posts = json.load(f)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# AUDITORÍA DE LOS 151 POSTS (MATRIZ EXCELSA)\n")
    f.write("Este documento contiene la matriz completa generada con las restricciones de cero comillas y cero dos puntos, con la postura ideológica exigida.\n\n")
    
    for i, p in enumerate(posts):
        f.write(f"### POST {i+1} | Tema: {p['topic']}\n")
        f.write(f"**Programado para:** {p['date']}\n\n")
        f.write(f"> {p['text']}\n\n")
        f.write(f"*(Longitud: {len(p['text'])} caracteres)*\n\n")
        f.write("---\n\n")

print(f"Archivo de revisión generado en: {output_file}")
