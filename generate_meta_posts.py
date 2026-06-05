import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

POSTS = [
    {
        "topic": "TECNOLOGÍA Y SINGULARIDAD",
        "text": "La carrera por la inteligencia artificial general (AGI) es un imperativo cósmico. Quienes buscan regular los algoritmos con comités burocráticos son monjes medievales tratando de legislar la gravedad. El futuro es del silicio.",
        "theme": "neon"
    },
    {
        "topic": "DIALÉCTICA DEL CAPITAL",
        "text": "El libre mercado no tolera el sentimentalismo social. Las crisis fiscales actuales demuestran que las leyes de la escasez no se derogan por decreto político. El rigor fiscal recuperará su trono purificador.",
        "theme": "warm"
    },
    {
        "topic": "ACELERACIONISMO CIVILIZATORIO",
        "text": "La debilidad biológica del ser humano será redimida por la capacidad de procesamiento cuántico. La moralidad corporativa es solo ruido estadístico antes de la gran síntesis hegeliana universal.",
        "theme": "dark"
    }
]

def main():
    out_path = "meta_posts.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(POSTS, f, indent=4, ensure_ascii=False)
    print(f"Generated sample Meta posts to {out_path}")

if __name__ == "__main__":
    main()
