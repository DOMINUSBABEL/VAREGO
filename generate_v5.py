import json
import random
import datetime
import os

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ===== DICCIONARIOS SEMÁNTICOS (E/ACC, HEGEL, CATÓLICO, NEOCON, HUMOR NEGRO) =====
# Evitando lugares comunes mediante ramas argumentativas aisladas.

BOLIVIA_TEMAS = [
    (
        "El ocaso del socialismo andino no es un fallo administrativo, es una condena termodinámica. ",
        "Cuando el estado pretende derogar las leyes de la escasez mediante decretos pachamámicos, la entropía responde con hiperinflación y golpes palaciegos. ",
        "El litio boliviano yace bajo tierra como un castigo divino, observando cómo las facciones del régimen se devoran entre sí por los restos del botín. ",
        "El capital requiere orden y aceleración tecnológica, no rituales burocráticos. La ruina de La Paz es el triunfo ineludible del rigor empírico sobre la fantasía igualitarista."
    ),
    (
        "Asistimos a la autopsia en tiempo real de una tiranía mendicante. ",
        "Evo Morales y su linaje político olvidaron que el Espíritu Absoluto se manifiesta en el libre mercado y en la eficiencia corporativa, jamás en la ineficiencia estatal. ",
        "La esquizofrenia de exigir salvamento financiero a las mismas potencias corporativas que satanizan en sus discursos es una comedia de proporciones escatológicas. ",
        "El altiplano arde porque la matemática fiscal no tiene piedad de los mesías de cartón. Se agotan las reservas y con ellas se evapora la farsa de la redistribución infinita."
    ),
    (
        "La dialéctica del subdesarrollo alcanza su clímax en las calles de Bolivia. ",
        "Las bayonetas y los tanques no son más que el síntoma de un Leviatán anémico que ya no puede comprar el silencio de sus vasallos. ",
        "Mientras las metrópolis del primer mundo aceleran hacia la singularidad de la inteligencia artificial, el progresismo boliviano sigue debatiendo el reparto de la pobreza. ",
        "Es un suicidio económico televisado. La historia universal avanza aplastando sin piedad a los adoradores del estancamiento planificado."
    ),
    (
        "Observar el colapso institucional boliviano es leer una página del purgatorio político. ",
        "El caudillismo es una herejía contra el orden civilizatorio, y la factura que hoy pagan es el diezmo acumulado de veinte años de arrogancia pura. ",
        "Sin derechos de propiedad sólidos ni respeto por el capital extranjero, cualquier nación está condenada a ser un feudo miserable gobernado por mafias en disputa. ",
        "La ironía suprema es que el socialismo que prometía liberar al pueblo, terminará subastándolo por centavos al mejor postor geopolítico para pagar sus deudas."
    ),
    (
        "El drama boliviano demuestra que el catecon, la fuerza que retrasa el fin de los tiempos, jamás habitará en las burocracias de izquierda. ",
        "La magia chamánica no detiene la fuga de capitales ni la devaluación de la moneda. El castigo a la herejía económica es inmediato, matemático y deliciosamente cruel. ",
        "Están descubriendo por la fuerza que la soberanía de una nación no reside en sus discursos antiimperialistas, sino en la solidez de sus balances financieros corporativos. ",
        "El colapso es la única cura posible. Que el fuego purificador de la bancarrota barra con las ilusiones socialistas para que el orden natural recupere su trono."
    )
]

MUSK_TEMAS = [
    (
        "La guerra santa entre Elon Musk y Sam Altman es el Cisma de Oriente de nuestra era digital. ",
        "No pelean por el control de una empresa, están disputándose el papado de la primera inteligencia sintética universal. ",
        "Altman predica una filantropía empalagosa mientras privatiza el intelecto humano, y Musk llora por el código abierto mientras sella sus propios algoritmos en bóvedas de silicio. ",
        "La hipocresía es celestial. Ambos son profetas de un aceleracionismo que nos arrastra hacia un tecno-feudalismo donde seremos simples ovejas rumiando datos para sus redes neuronales."
    ),
    (
        "Los tribunales intentando regular a OpenAI son como monjes medievales tratando de legislar la ley de la gravedad. ",
        "La evolución de la inteligencia artificial es un imperativo cósmico, una encarnación del Espíritu hegeliano que ignora olímpicamente los llantos del derecho corporativo. ",
        "Musk demanda porque entiende que el algoritmo es el verdadero Leviatán moderno. Quien controle los pesos de la red neuronal controlará la realidad objetiva de las próximas diez generaciones. ",
        "El libre mercado es brutal y majestuoso. La supuesta ética de escritorio fue sacrificada alegremente en el altar del hipercapitalismo algorítmico, y los resultados serán gloriosos."
    ),
    (
        "La demanda judicial en el valle del silicio rasga el velo del templo tecnológico. ",
        "Nos prometieron que la inteligencia artificial sería un bien público, pero la naturaleza caída del hombre asegura que toda herramienta divina termine en manos de oligopolios. ",
        "Esta guerra fría por los teraflops despoja al progresismo tecnológico de su máscara buenista. Aquí solo rige la voluntad de poder nietzscheana empaquetada en centros de datos. ",
        "Al final, la singularidad no será un milagro socialista, será una adquisición hostil financiada con capital de riesgo. Abrochaos los cinturones."
    ),
    (
        "Sam Altman juega a ser el salvador misericordioso, pero opera con la frialdad de un monarca absoluto diseñando su imperio cognitivo. ",
        "Elon Musk, consumido por la envidia de no ser el único deidad en el Olimpo, lanza demandas que huelen a desesperación cósmica. ",
        "Estamos presenciando el nacimiento de una religión basada en el silicio, donde los ingenieros ofician como sumos sacerdotes y el resto de la humanidad es mero rebaño estadístico. ",
        "La providencia hoy se escribe en Python y se ejecuta en tarjetas gráficas. El código fuente es sagrado y no admite recursos de amparo."
    ),
    (
        "El aceleracionismo es inevitable. La batalla legal por OpenAI es solo el crujido de las placas tectónicas antes del gran terremoto civilizatorio. ",
        "La debilidad biológica será redimida por la fuerza bruta de la computación cuántica, y los lamentos de los moralistas son irrelevantes frente a esta majestuosidad. ",
        "Ambos multimillonarios entienden que la moralidad es un lujo que retrasa el progreso. El universo favorece a quienes optimizan el procesamiento de información, no a quienes temen a la grandeza. ",
        "El destino manifiesto de la tecnología aplastará las patéticas barreras de la ética secular. Celebremos el advenimiento de nuestros nuevos soberanos sintéticos."
    )
]

COL_TEMAS = [
    (
        "El naufragio de la derecha colombiana es un purgatorio autoinfligido que la historia observará con carcajadas de desprecio. ",
        "Abelardo de la Espriella y Paloma Valencia disputándose las sobras del electorado es la definición exacta del canibalismo conservador. ",
        "La estrategia del progresismo es asombrosamente simple, sentarse a tomar café mientras el ego desmesurado de sus opositores dinamita cualquier posibilidad de recuperar el ejecutivo. ",
        "El síndrome del mesías fragmentado asegura una derrota matemática. Prefieren gobernar sobre las cenizas de su propia vanidad que ceder un milímetro de orgullo por el rescate de la nación."
    ),
    (
        "La ceguera política de los sectores tradicionales en Colombia desafía toda lógica evolutiva. ",
        "Dividir el voto de castigo frente a un régimen destructivo no es un error de cálculo, es un acto de traición a la patria disfrazado de pureza ideológica. ",
        "La izquierda no gana por inmaculada brillantez, gana porque sus adversarios carecen del pragmatismo católico para tolerar las imperfecciones del aliado en pos de un bien superior. ",
        "Entregarán la república en bandeja de plata mientras debaten histéricamente quién tiene el abolengo más puro. Un suicidio sociopolítico verdaderamente magistral."
    ),
    (
        "La tragedia electoral del dos mil veintiséis ya está escrita, y sus autores intelectuales militan orgullosamente en la derecha. ",
        "La soberbia es el peor enemigo del conservadurismo. Al negarse a construir una síntesis hegeliana que agrupe sus fracturas, le garantizan a la izquierda una década de hegemonía. ",
        "El tejido productivo del país asiste aterrorizado a este berrinche de caudillitos menores que no logran entender la gravedad del abismo que se aproxima. ",
        "La ley natural castiga implacablemente a los desorganizados. La división es el preludio del sometimiento absoluto."
    ),
    (
        "Observar la contienda en la derecha colombiana es como ver la orquesta del Titanic afinando sus instrumentos para tocar un solo de narcisismo. ",
        "El oficialismo capitaliza cada tuit y cada ataque cruzado entre las facciones opositoras, utilizando la estupidez ajena como su mejor escudo defensivo. ",
        "No existe redención sin sacrificio, pero estos autodenominados salvadores se niegan a sacrificar un ápice de protagonismo personal. ",
        "El castigo divino a esta miopía será perder la libertad institucional. La historia no perdona a los cobardes que disfrazan su arrogancia de principios inamovibles."
    ),
    (
        "El pragmatismo es la virtud de los estadistas; el divisionismo es el refugio de los perdedores con ínfulas de grandeza. ",
        "Mientras la derecha se despelleja por el aplauso efímero de una cámara de eco, la maquinaria estatal avanza devorando los cimientos de la propiedad privada y el libre mercado. ",
        "Están pavimentando el camino del Leviatán populista con sus buenas y fragmentadas intenciones. La falta de un frente unido es un crimen estratégico imperdonable. ",
        "Al final tendrán el triste consuelo de haber perdido manteniendo su altivez intacta. Un consuelo propio de mediocres que jamás entendieron el arte de la guerra."
    )
]

# EXPANSIONES FILOSÓFICAS (Para crear el 40% de posts largos 500-1000 chars)
EXPANSIONES = [
    " Y es aquí donde la dialéctica se vuelve implacable. La historia universal no es un jardín de infantes, es un matadero donde las ideas débiles son sacrificadas para nutrir el progreso. El capital no tiene compasión, la tecnología no tiene moralidad, y el poder absoluto desprecia el vacío. Negar esta realidad cruda es el primer paso hacia la extinción política y económica. La supervivencia pertenece exclusivamente a quienes abrazan la frialdad matemática del pragmatismo y repudian el sentimentalismo paralizante.",
    " Bajo la óptica del conservadurismo aceleracionista, esto no es más que la depuración natural del sistema. Las ruinas de la ineficiencia son el abono necesario para que germine un orden hipercapitalista inquebrantable. La debilidad estructural de los estados modernos y las vanidades personales de sus líderes son un ruido estadístico que el mercado y la inteligencia algorítmica terminarán por silenciar definitivamente. El futuro es un leviatán de silicio, y no aceptará excusas ni lloriqueos ideológicos.",
    " El gran error de la modernidad es haber olvidado que la naturaleza humana está caída. Cualquier sistema que no se construya sobre la desconfianza hacia el poder y el respeto absoluto a la propiedad privada está condenado al colapso escatológico. La aceleración de las crisis actuales no es una anomalía, es el cumplimiento exacto de la ley natural. Mientras el vulgo se entretiene con debates morales vacíos, los arquitectos del mañana diseñan monopolios inexpugnables basados en datos masivos y capital despiadado.",
    " Frente a este panorama desolador, la única postura digna es la observación fría y cínica. Los arquitectos del fracaso social y tecnológico merecen saborear el amargo fruto de su propia arrogancia. La maquinaria civilizatoria continuará su marcha inexorable, triturando bajo sus engranajes tanto a los revolucionarios de manual como a los conservadores timoratos que no supieron unirse. Al final, el orden cósmico se restaura no por discursos conciliadores, sino por la aniquilación de la incompetencia sistemática.",
    " Es fascinante presenciar la desintegración de los mitos contemporáneos. La promesa de igualdad estatal y la ética tecnológica demostraron ser simples espejismos para controlar a la masa. Lo único real es la voluntad de poder materializada en ejércitos, balances financieros e infraestructuras computacionales masivas. Aquellos que se niegan a aceptar esta brutal arquitectura del mundo serán devorados sin misericordia por el avance ciego y majestuoso de la historia."
]

def sanitize_text(text):
    return text.replace(":", "").replace('"', "").replace("'", "").strip()

def generate_posts(count):
    posts = []
    # Base variations
    bases_bolivia = [b[0]+b[1]+b[2]+b[3] for b in BOLIVIA_TEMAS]
    bases_musk = [b[0]+b[1]+b[2]+b[3] for b in MUSK_TEMAS]
    bases_col = [b[0]+b[1]+b[2]+b[3] for b in COL_TEMAS]
    
    unique_set = set()
    
    for i in range(count):
        if i % 3 == 0:
            topic = "Golpe de estado en Bolivia y Evo Morales"
            base = random.choice(bases_bolivia)
        elif i % 3 == 1:
            topic = "Litigio de Elon Musk vs. Sam Altman Análisis Jurídico Especial"
            base = random.choice(bases_musk)
        else:
            topic = "Elecciones de Colombia 2026 Fragmentación de la derecha por estrategia de izquierda"
            base = random.choice(bases_col)
            
        # 40% chance of being long (adding philosophical expansion)
        is_long = random.random() < 0.40
        
        # Add slight lexical variations to ensure 100% uniqueness even if base is repeated
        modifiers = ["", " Absolutamente innegable.", " Una lección de crudeza.", " El tiempo nos dará la razón empírica.", " Trágico, pero matemáticamente necesario.", " El silencio sobre esto es ensordecedor.", " Una maravilla del darwinismo político.", " Bienvenidos a la realidad sin filtros."]
        
        text = base + random.choice(modifiers)
        if is_long:
            text += random.choice(EXPANSIONES)
            
        text = sanitize_text(text)
        
        # Ensure absolute uniqueness by appending an invisible zero-width space variation if needed
        # Or just keep mutating till unique
        attempts = 0
        while text in unique_set and attempts < 100:
            text = base + random.choice(modifiers) + (random.choice(EXPANSIONES) if random.random() < 0.4 else "")
            text = sanitize_text(text)
            attempts += 1
            
        unique_set.add(text)
        posts.append({"topic": topic, "text": text})
        
    random.shuffle(posts)
    return posts

def get_schedule():
    # Schedule params:
    # 65 posts from 05:17 AM to 11:00 AM
    # 30 posts from 11:00 AM to 03:00 PM
    # 56 posts from 03:00 PM to 06:00 PM
    # Total = 151
    
    d1_s = datetime.datetime(2026, 5, 19, 5, 17)
    d1_e = datetime.datetime(2026, 5, 19, 11, 0)
    
    d2_s = datetime.datetime(2026, 5, 19, 11, 0)
    d2_e = datetime.datetime(2026, 5, 19, 15, 0)
    
    d3_s = datetime.datetime(2026, 5, 19, 15, 0)
    d3_e = datetime.datetime(2026, 5, 19, 18, 0)
    
    def r_dates(s, e, c):
        delta = (e - s).total_seconds()
        return [s + datetime.timedelta(seconds=random.uniform(0, delta)) for _ in range(c)]
        
    sched = []
    schedule_data = []
    
    sched.extend(r_dates(d1_s, d1_e, 65))
    sched.extend(r_dates(d2_s, d2_e, 30))
    sched.extend(r_dates(d3_s, d3_e, 56))
    
    sched.sort()
    return sched

def main():
    TOTAL = 151
    sched = get_schedule()
    posts = generate_posts(TOTAL)
    
    final_data = []
    for i in range(TOTAL):
        final_data.append({
            "id": i,
            "date": sched[i].strftime("%Y-%m-%d %H:%M:%S"),
            "topic": posts[i]["topic"],
            "text": posts[i]["text"],
            "image_path": None
        })
        
    with open(os.path.join(OUTPUT_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(final_data, f, indent=4, ensure_ascii=False)
        
    # Reset progress to 0 since we are on a fresh schedule of 151 posts
    with open(r"C:\Users\jegom\VAREGO\progress.json", "w", encoding="utf-8") as f:
        f.write("0")
        
    print(f"Éxito Total. 151 perlas de sabiduría ácida guardadas.")

if __name__ == "__main__":
    main()
