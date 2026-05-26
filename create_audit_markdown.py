# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

posts_path = r"C:\Users\jegom\output\177_posts\posts.json"
audit_path = r"C:\Users\jegom\VAREGO\REVISION_40_POSTS_ENCICLICA.md"

with open(posts_path, "r", encoding="utf-8") as f:
    posts = json.load(f)

with open(audit_path, "w", encoding="utf-8") as f:
    f.write("# AUDITORÍA DE LOS 40 POSTS DE LA CARTA ENCÍCLICA (MAGNIFICA HUMANITAS)\n\n")
    f.write("A continuación se detallan las 5 reflexiones dialécticas a la luz de Hegel, Kojève y Escohotado, estructuradas para ser publicadas o programadas en la plataforma X mediante VAREGO.\n\n")
    f.write("---\n\n")
    
    current_topic = None
    for i, p in enumerate(posts):
        topic = p["topic"]
        if topic != current_topic:
            f.write(f"## TEMA: {topic}\n\n")
            current_topic = topic
            
        post_type = "HILO (En Vivo)" if p["type"] == "thread" else "SUELTO (Programado)"
        thread_details = f" | Hilo ID: {p['thread_id']} | Índice Hilo: {p['thread_index']}" if p["type"] == "thread" else ""
        
        f.write(f"### POST {p['id'] + 1} | {post_type}{thread_details}\n")
        f.write(f"**Fecha/Hora de Lanzamiento:** `{p['date']}`\n\n")
        f.write(f"> {p['text']}\n\n")
        f.write(f"*(Longitud: {len(p['text'])} caracteres)*\n\n")
        f.write("---\n\n")

print(f"Audit markdown written successfully to {audit_path}.")
