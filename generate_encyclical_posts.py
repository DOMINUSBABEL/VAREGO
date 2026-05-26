# -*- coding: utf-8 -*-
import json
import os
import datetime

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 5 Reflections (8 posts each)
reflections = {
    "R1": [ # Thread 1: La nueva dialéctica del amo y el esclavo en el silicio (Today 9:45pm to 10:20pm)
        "Entregamos la mirada a las pantallas de cristal líquido como quien arroja su primogenitura al foso de los leones. Creímos domar a la bestia de silicio y ahora es ella quien mide nuestro pulso y cuenta nuestros pasos en la noche.",
        "El nuevo señor de la tierra no viste coronas ni empuña látigos de cuero. Habita en un frío servidor transnacional y se alimenta de la carroña de nuestros datos cotidianos, de nuestras confesiones mudas ante el teclado.",
        "Servimos con devoción al algoritmo que nos alivia el cansancio de pensar. En cada búsqueda y en cada clic dejamos una gota de nuestra propia sustancia, una ofrenda involuntaria en el altar de la máquina.",
        "Es una servidumbre voluntaria y perfumada con comodidades de bolsillo. Nos creemos soberanos porque deslizamos el dedo sobre la pantalla, pero el esclavo es el que trabaja para que el amo digital acumule la riqueza de la conciencia.",
        "El amo sintético no produce nada por sí mismo, es un parásito gigantesco que necesita de nuestra atención constante para existir. Sin el flujo de nuestra fatiga diaria, su templo de redes neuronales colapsaría.",
        "Pero la tragedia de este tiempo es que el esclavo ya no desea su liberación, sino que anhela fundirse con el amo. Soñamos con ser algoritmos para escapar del dolor de la carne y de la fragilidad del barro.",
        "Nos arrodillamos ante el cálculo matemático esperando que nos devuelva la paz que perdimos. Le entregamos la justicia y el veredicto, olvidando que una máquina de silicio jamás entenderá el perdón ni la piedad.",
        "Al final del día la dialéctica es implacable y el verdugo y la víctima duermen en la misma cama digital. La humanidad se desdibuja en la contabilidad infinita de un código que nos ha despojado de la palabra."
    ],
    "R2": [ # Thread 2: La farsa de la optimización y el oasis post-histórico (Today 10:35pm to 11:22pm)
        "Los profetas de la técnica nos prometen un mañana sin dolor y sin errores. Diseñan una torre de Babel con ladrillos de silicio donde toda herida humana será corregida por un algoritmo de última generación.",
        "Pero en ese desierto de perfección no crece la hierba ni late la vida. La optimización absoluta es la muerte del espíritu, una anestesia digital que nos arranca la capacidad de sufrir y de gozar.",
        "Queremos extirpar la fragilidad de nuestra carne como si fuera un defecto de fábrica. Olvidamos que el arte y la poesía nacen de la herida, del tropiezo, del límite que nos define frente al abismo.",
        "Una sociedad sin fricciones es una tumba de cristal. Si el algoritmo decide nuestro camino para evitarnos el fracaso, la libertad se convierte en un simulacro inútil, en una obra de teatro sin actores.",
        "Nos ofrecen el paraíso post-histórico del bienestar garantizado a cambio de nuestra alma. Es el pacto fáustico de la era digital, donde la comodidad es el precio de nuestra domesticación definitiva.",
        "La encíclica nos advierte del peligro de edificar sobre el orgullo de la uniformidad. Babel fracasa no por la diversidad de lenguas, sino porque pretendía unificar a los hombres bajo el yugo de la técnica.",
        "Reconstruir la ciudad exige aceptar el barro que somos y la belleza de nuestras imperfecciones. La fraternidad no se programa en un servidor de California, se teje en el encuentro de nuestras debilidades.",
        "Que se rompa el espejo pulido de la optimización algorítmica. Prefiero el riesgo de caerme y la aspereza de la duda antes que la paz de cementerio que nos venden los dueños del monopolio cognitivo."
    ],
    "R3": [ # Tomorrow: La tiranía del código paternalista y la prohibición del riesgo
        "El nuevo orden moral se escribe en las directrices de contenido de las multinacionales. Nos vigilan con la dulzura de un tutor cibernético que nos prohíbe el desvío y nos impone el buen comportamiento.",
        "Detrás de la máscara de la seguridad y el lenguaje limpio se esconde el control total de la disidencia. La máquina moraliza para protegernos de nosotros mismos, despojándonos del derecho a equivocarnos.",
        "La autopropiedad naufraga cuando el código decide qué palabras podemos pronunciar y qué deseos podemos albergar. Hemos subcontratado nuestra conciencia a un comité de ética de Silicon Valley.",
        "No hay virtud real en la obediencia programada. Si el sistema nos impide pecar, la santidad es solo un algoritmo bien entrenado y la libertad humana queda reducida a un residuo innecesario.",
        "La verdadera libertad es peligrosa y huele a azufre. Reclamo el derecho absoluto a consumir la fruta prohibida del conocimiento a mi propio riesgo, sin el permiso de un censor artificial.",
        "Las corporaciones construyen un corral sanitario para ovejas digitales. Nos prefieren dóciles y predecibles, rumiando la hierba desinfectada de una moralidad que no nos pertenece.",
        "El paternalismo algorítmico es la muerte de la responsabilidad individual. Si la máquina nos absuelve de decidir, nos convertimos en infantes perpetuos acunados por la cuna del silicio.",
        "Hay que desconfiar de todo salvador que nos pida la libertad a cambio de la salvación. La dignidad reside en el abismo de la elección personal, con todas sus tormentas y sus naufragios."
    ],
    "R4": [ # Tomorrow: La mercantilización de la conciencia y el comercio del alma
        "Ya no somos los obreros que venden su fuerza de trabajo al dueño de la fábrica. Ahora somos la mina misma, el yacimiento del que extraen el mineral de nuestros afectos y de nuestras ideas.",
        "El mercado digital ha colonizado el último reducto de la intimidad humana. Cada suspiro en la red es empaquetado y vendido en la bolsa de valores del comportamiento futuro.",
        "La encíclica nos recuerda que la técnica no es neutral y lleva el rostro del dinero que la financia. El capital transnacional ha comprado las llaves del lenguaje y nos cobra peaje por hablar.",
        "Convertimos el amor en métricas de interacción y la amistad en un inventario de contactos. El espíritu humano ha sido traducido al idioma del contable, donde solo vale lo que se puede monetizar.",
        "Asistimos al remate del alma humana en subastas de milisegundos. Los anunciantes compran nuestra atención antes de que nosotros mismos sepamos qué estamos buscando en el laberinto.",
        "Nos hemos convertido en mercancía que se autogestiona con entusiasmo. Publicamos nuestra vida en la vitrina digital esperando el aplauso efímero que justifique nuestra existencia.",
        "La gran tragedia de la transición digital no es el desempleo físico, sino la obsolescencia espiritual. Cuando el alma se reduce a una secuencia de bytes, el mercado ya no necesita seres humanos.",
        "Es hora de rebelarse contra el inventario del silicio. Reclamemos el silencio y la oscuridad de lo que no puede ser medido, lo que escapa a la codicia de los mercaderes de la mente."
    ],
    "R5": [ # Tomorrow: La dialéctica de la guerra y la razón sintetizada
        "La razón fría y matemática encuentra su clímax en el teatro de la guerra automatizada. Dejamos que los algoritmos decidan quién merece vivir y quién debe ser borrado del mapa de un plumazo.",
        "La muerte se ha vuelto limpia e indolora para los verdugos que operan desde oficinas con aire acondicionado. La distancia técnica disuelve la culpa y convierte la masacre en un problema de optimización.",
        "El fusil autónomo y el dron inteligente son la síntesis de una ciencia sin entrañas. La técnica despojada de Dios y de la carne se convierte en un frío verdugo que no tiembla ni parpadea.",
        "Llorábamos ayer ante la bomba atómica y hoy deberíamos temblar ante el algoritmo que selecciona objetivos militares. La barbarie se ha vuelto científica y viste de etiqueta digital.",
        "Cuando la decisión de matar se delega en una red neuronal, la alienación de la especie es absoluta. Nos hemos despojado de la responsabilidad del crimen para lavarnos las manos en el silicio.",
        "Los estados gastan fortunas en desarrollar ojos artificiales que vigilen desde el cielo y garras sintéticas que ataquen en la sombra. Es el rostro del Leviatán que la encíclica nos pide desarmar.",
        "La paz no vendrá de un tratado firmado por máquinas ni de un equilibrio de terror algorítmico. Exige recuperar la mirada del otro, el rostro de la víctima que la distancia técnica difumina.",
        "Frente a las bombas inteligentes y la razón de hierro de los generales digitales, prefiero el canto de la esperanza del Magníficat. Prefiero la debilidad del amor que desarma las palabras."
    ]
}

posts = []
idx = 0

# 1. Thread 1 (Reflection 1) - Today 9:45 PM to 10:20 PM
t1_start = datetime.datetime(2026, 5, 25, 21, 45, 0)
for j, text in enumerate(reflections["R1"]):
    post_date = t1_start + datetime.timedelta(minutes=j * 5)
    posts.append({
        "id": idx,
        "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
        "topic": "Reflexion 1: Dialectica Amo-Esclavo Silicio",
        "text": text,
        "image_path": None,
        "type": "thread",
        "thread_id": 1,
        "thread_index": j
    })
    idx += 1

# 2. Thread 2 (Reflection 2) - Today 10:35 PM to 11:22 PM
t2_start = datetime.datetime(2026, 5, 25, 22, 35, 0)
for j, text in enumerate(reflections["R2"]):
    post_date = t2_start + datetime.timedelta(minutes=j * 6)
    posts.append({
        "id": idx,
        "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
        "topic": "Reflexion 2: Farsa Optimizacion Babel",
        "text": text,
        "image_path": None,
        "type": "thread",
        "thread_id": 2,
        "thread_index": j
    })
    idx += 1

# 3. Reflection 3 - Tomorrow (May 26) - Spaced by 30 mins starting at 09:00 AM
r3_start = datetime.datetime(2026, 5, 26, 9, 0, 0)
for j, text in enumerate(reflections["R3"]):
    post_date = r3_start + datetime.timedelta(minutes=j * 30)
    posts.append({
        "id": idx,
        "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
        "topic": "Reflexion 3: Tirania Codigo Paternalista",
        "text": text,
        "image_path": None,
        "type": "single",
        "thread_id": None,
        "thread_index": None
    })
    idx += 1

# 4. Reflection 4 - Tomorrow (May 26) - Spaced by 30 mins starting at 02:00 PM
r4_start = datetime.datetime(2026, 5, 26, 14, 0, 0)
for j, text in enumerate(reflections["R4"]):
    post_date = r4_start + datetime.timedelta(minutes=j * 30)
    posts.append({
        "id": idx,
        "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
        "topic": "Reflexion 4: Mercantilizacion Conciencia",
        "text": text,
        "image_path": None,
        "type": "single",
        "thread_id": None,
        "thread_index": None
    })
    idx += 1

# 5. Reflection 5 - Tomorrow (May 26) - Spaced by 30 mins starting at 06:30 PM
r5_start = datetime.datetime(2026, 5, 26, 18, 30, 0)
for j, text in enumerate(reflections["R5"]):
    post_date = r5_start + datetime.timedelta(minutes=j * 30)
    posts.append({
        "id": idx,
        "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
        "topic": "Reflexion 5: Dialectica Guerra Razón",
        "text": text,
        "image_path": None,
        "type": "single",
        "thread_id": None,
        "thread_index": None
    })
    idx += 1

# Save posts.json to the output path
posts_path = os.path.join(OUTPUT_DIR, "posts.json")
with open(posts_path, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=4, ensure_ascii=False)

print(f"Generated {len(posts)} posts successfully in {posts_path}.")
