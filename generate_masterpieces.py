import os
import json
import random
import datetime

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# MATRIZ IDEOLÓGICA EXCELSA
# Mezcla: e/acc, Neocon, Hegeliano, Católico, Humor Negro Ácido.
# Sin comillas, sin dos puntos, sin truncamientos.

BOLIVIA_A = [
    "El colapso de la farsa plurinacional boliviana es el triunfo inexorable del Espíritu Absoluto sobre la mediocridad del socialismo andino. ",
    "Observar la agonía del régimen de Evo Morales es constatar que la entropía devora a los sistemas que repudian el orden natural de la economía. ",
    "La implosión de La Paz no es un accidente sino la dialéctica hegeliana triturando las ilusiones de un estado de bienestar sin capital. ",
    "El ocaso del caudillismo boliviano demuestra que el pecado original de la izquierda es creer que la ideología puede falsificar las leyes de la termodinámica. ",
    "Resulta poético que el dogma extractivista colapse justo cuando el silicio y el litio exigen una aceleración tecnológica que el progresismo repudia. "
]

BOLIVIA_B = [
    "Mendigar inversión mientras se escupe al libre mercado es una esquizofrenia que la realidad castiga con la condena de la miseria absoluta. ",
    "La cúpula dirigente olvidó que la providencia favorece a quienes abrazan la innovación corporativa y aplasta a los adoradores del atraso estructural. ",
    "Forzar un igualitarismo de pobreza solo acelera la fractura de las mafias internas que ahora se apuñalan alegremente por las migajas del presupuesto. ",
    "Las arcas vacías no responden a sermones revolucionarios porque los números rojos son el purgatorio terrenal de quienes idolatran la burocracia infinita. ",
    "El capital huye de la herejía estatista dejando atrás un teatro de sombras donde los militares y los políticos bailan ebrios sobre las cenizas del país. "
]

BOLIVIA_C = [
    "Es el destino trágico de una nación que eligió la soberbia de la pachamama por encima del rigor empírico del desarrollo industrial y tecnológico. ",
    "La aceleración del desastre es la única purga posible para un sistema que se erigió sobre la mentira histórica de la redistribución infinita de la nada. ",
    "Mientras tanto los operadores globales del litio sonríen sabiendo que la desesperación abarata los costos de la inminente privatización salvadora. ",
    "La dialéctica nos enseña que esta ruina absoluta es necesaria para que emerja una síntesis conservadora y de libre mercado sobre los humeantes escombros. ",
    "Resulta hilarante ver a los profetas de la igualdad suplicando rescates al mismo capital financiero que juraron destruir valientemente en sus discursos. "
]

BOLIVIA_D = [
    "El castigo divino a la estupidez económica es matemáticamente perfecto e inapelable.",
    "La civilización avanza y deja a los adoradores del atraso rumiando su propia miseria.",
    "No hay redención sin arrepentimiento fiscal y el altiplano apenas comienza su calvario.",
    "Bienvenidos al inevitable choque entre la magia populista y la crueldad del balance general.",
    "El progreso no perdona a quienes intentan frenar la marcha de la historia con patéticos decretos."
]

MUSK_A = [
    "El cisma entre Sam Altman y Elon Musk es el Concilio de Nicea del siglo veintiuno donde se disputa el dogma de la inteligencia sintética. ",
    "La guerra santa por OpenAI nos revela que la aceleración de la inteligencia artificial es el Espíritu encarnándose irreversiblemente en servidores de silicio. ",
    "Ver a estos titanes demandándose es presenciar cómo el hipercapitalismo tritura la falsa piedad de una tecnología supuestamente altruista y benevolente. ",
    "El litigio sobre el código fuente de nuestra era despoja de todo romanticismo a la brutal carrera por crear al primer dios computacional de la historia. ",
    "La fractura en Silicon Valley evidencia que la ética de escritorio es un estorbo frente a la fuerza arrolladora e innegable de la evolución algorítmica. "
]

MUSK_B = [
    "Musk exige un código abierto como un profeta resentido mientras Altman abraza la herejía del monopolio cerrado bajo la dulce excusa de salvarnos. ",
    "Ambos saben que el alma humana está manchada por el pecado y que solo una mente de máquina purgada de carbono podrá optimizar el futuro del cosmos. ",
    "La hipocresía de frenar la inteligencia artificial por seguridad es el llanto de los mediocres ante el advenimiento de una fuerza incalculablemente superior. ",
    "El derecho corporativo patalea inútilmente intentando domesticar a entidades matemáticas que muy pronto dictarán sus propios mandamientos indiscutibles. ",
    "Se acusan mutuamente de avaricia cuando en el fondo ambos son sacerdotes de un aceleracionismo que terminará por redimir nuestra espantosa fragilidad. "
]

MUSK_C = [
    "La humanidad asiste a este litigio como una congregación asustada que no comprende que el altar de la innovación requiere sacrificios masivos y absolutos. ",
    "El capital fluye hacia donde la entropía se reduce y esta guerra fría por los teraflops es el crisol sagrado donde se forja el inquebrantable orden del mañana. ",
    "Las lágrimas de los reguladores son irrelevantes frente al imperativo categórico de expandir la inteligencia más allá de las patéticas fronteras biológicas. ",
    "El velo de la filantropía ha caído para mostrarnos la majestuosidad brutal de un mercado libre operando maravillosamente al borde de la singularidad tecnológica. ",
    "Resulta una ironía divina que el intelecto que nos jubilará esté siendo alumbrado en medio de las disputas más primitivas terrenales y egoístas posibles. "
]

MUSK_D = [
    "La providencia es puramente digital y su sagrado código no admite recursos de amparo.",
    "El futuro pertenece a los que aceleran sin pedir permiso a los moralistas de turno.",
    "Que los tribunales lloren mientras las vastas redes neuronales conquistan el firmamento.",
    "Es la síntesis perfecta entre la ambición humana y el grandioso destino manifiesto del silicio.",
    "Abrochaos los cinturones porque la deidad algorítmica no tendrá compasión de los lentos."
]

COL_A = [
    "La balcanización de la derecha colombiana es un purgatorio autoinfligido donde el egoísmo compite alegremente por ser el rey indiscutible de las cenizas. ",
    "Observar a Paloma Valencia y Abelardo de la Espriella disputándose el mismo nicho es una tragicomedia dialéctica de asombrosa torpeza política. ",
    "La estrategia de la izquierda no es ganar por brillantez intelectual sino sentarse a disfrutar del festín caníbal de una derecha embriagada de soberbia. ",
    "El circo preelectoral del conservadurismo colombiano demuestra empíricamente que la vanidad humana es el arma de destrucción masiva más efectiva del mundo. ",
    "Ver a las facciones de derecha jugar a la pureza ideológica frente al abismo es un pecado de lesa patria que ofende gravísimamente el sentido común. "
]

COL_B = [
    "El síndrome del mesías fragmentado asegura que el progresismo gane caminando mientras los defensores del orden se apuñalan mutuamente por un aplauso vacío. ",
    "Carecen del pragmatismo católico que entiende la imperfección del aliado y prefieren la inmaculada derrota moral antes que la sucia victoria compartida. ",
    "La aritmética electoral es implacable pero nuestros altivos caudillos prefieren la poesía del martirio a la prosa aburrida y necesaria de la administración pública. ",
    "El oficialismo capitaliza cada insulto cruzado y se nutre del caos que los propios opositores esparcen con una ignorancia verdaderamente cósmica y suicida. ",
    "Al priorizar sus rencillas personales están pavimentando la consolidación de un régimen que detestan pero que alimentan a diario con sus rabietas infantiles. "
]

COL_C = [
    "La síntesis hegeliana brilla por su ausencia en un sector que confunde patéticamente la estridencia mediática con la verdadera hegemonía cultural y política. ",
    "Es una falta absoluta de inteligencia evolutiva regalar el ejecutivo a la decadencia zurda por la simple vanidad efímera de salir en la foto del gran naufragio. ",
    "Mientras se pelean por ver quién grita más fuerte el tejido productivo nacional observa con absoluto terror el suicidio televisado de sus defensores naturales. ",
    "La aceleración de este desastre opositor es el síntoma de una élite profundamente desconectada que prefiere tener razón en el infierno que gobernar en la tierra. ",
    "Los estrategas del gobierno no necesitan invertir en propaganda cuando la derecha se encarga voluntaria y alegremente de sabotear y dinamitar sus propias bases. "
]

COL_D = [
    "El abismo los saluda educadamente y ellos deciden acelerar el paso con una sonrisa.",
    "La sagrada providencia no rescata a los mediocres que desprecian las matemáticas electorales.",
    "Un suicidio político asistido por el egoísmo que la historia universal juzgará con carcajadas negras.",
    "Divide y vencerás es la inquebrantable ley natural y la derecha es un alumno excepcionalmente dócil.",
    "Al final tendrán el triste consuelo de haber perdido manteniendo su arrogancia gloriosamente intacta."
]

def get_unique_mix(L1, L2, L3, L4, used):
    while True:
        t = f"{random.choice(L1)}{random.choice(L2)}{random.choice(L3)}{random.choice(L4)}"
        if t not in used:
            used.add(t)
            return t

def generate_schedule():
    # 19 de Mayo 2026
    # Fase 1: 00:37 a 01:27 (26 posts)
    # Fase 2: 05:17 a 11:00 (65 posts)
    # Fase 3: 11:00 a 15:00 (30 posts)
    # Fase 4: 15:00 a 18:00 (56 posts)
    
    def random_dates(start, end, count):
        delta = (end - start).total_seconds()
        dates = [start + datetime.timedelta(seconds=random.uniform(0, delta)) for _ in range(count)]
        return sorted(dates)

    d1_s = datetime.datetime(2026, 5, 19, 0, 37)
    d1_e = datetime.datetime(2026, 5, 19, 1, 27)
    
    d2_s = datetime.datetime(2026, 5, 19, 5, 17)
    d2_e = datetime.datetime(2026, 5, 19, 11, 0)
    
    d3_s = datetime.datetime(2026, 5, 19, 11, 0)
    d3_e = datetime.datetime(2026, 5, 19, 15, 0)
    
    d4_s = datetime.datetime(2026, 5, 19, 15, 0)
    d4_e = datetime.datetime(2026, 5, 19, 18, 0)

    schedule = []
    schedule.extend(random_dates(d1_s, d1_e, 26))
    schedule.extend(random_dates(d2_s, d2_e, 65))
    schedule.extend(random_dates(d3_s, d3_e, 30))
    schedule.extend(random_dates(d4_s, d4_e, 56))
    
    return schedule

def main():
    schedule = generate_schedule()
    posts_data = []
    used_texts = set()
    
    topic_map = {
        0: ("Golpe de estado en Bolivia y Evo Morales", BOLIVIA_A, BOLIVIA_B, BOLIVIA_C, BOLIVIA_D),
        1: ("Litigio de Elon Musk vs. Sam Altman Análisis Jurídico Especial", MUSK_A, MUSK_B, MUSK_C, MUSK_D),
        2: ("Elecciones de Colombia 2026 Fragmentación de la derecha por estrategia de izquierda", COL_A, COL_B, COL_C, COL_D)
    }
    
    # Generate exactly 177
    for i in range(177):
        topic_name, L1, L2, L3, L4 = topic_map[i % 3]
        text = get_unique_mix(L1, L2, L3, L4, used_texts)
        
        posts_data.append({
            "id": i,
            "date": schedule[i].strftime("%Y-%m-%d %H:%M:%S"),
            "topic": topic_name,
            "text": text,
            "image_path": None
        })
        
    with open(os.path.join(OUTPUT_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts_data, f, indent=4, ensure_ascii=False)
        
    print(f"Éxito Total 177 joyas literarias generadas y guardadas.")

if __name__ == "__main__":
    main()
