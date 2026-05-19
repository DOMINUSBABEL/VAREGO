import random
import itertools

# Matriz literaria súper expandida para garantizar unicidad absoluta
# Textos garantizados entre 250 y 900 caracteres.

# Cada lista contiene 10 oraciones. Total combinaciones por tema = 10x10x10x10 = 10,000.

BOLIVIA_1 = [
    "El teatro político boliviano se resquebraja como un cristal bajo la presión de sus propias contradicciones históricas. ",
    "Las grietas del poder en el altiplano muestran la anatomía de un colapso institucional perfectamente coreografiado por la avaricia. ",
    "El resurgimiento del caos en Bolivia nos recuerda la fragilidad endémica de las democracias que adoran a sus líderes ciegamente. ",
    "La tormenta que azota La Paz despeja la niebla del relato heroico para revelar la crudeza de la ambición humana. ",
    "Observar el laberinto político en Bolivia es presenciar la autopsia de un modelo económico que se alimentó de ilusiones. ",
    "El espejismo del altiplano ha llegado a su inevitable fin, desnudando las fracturas de un estado diseñado para el caudillismo. ",
    "La maquinaria gubernamental boliviana se tambalea, asfixiada por el peso de las lealtades compradas que ya no puede costear. ",
    "Evo Morales y su cúpula enfrentan ahora el monstruo que ellos mismos alimentaron durante años de retórica vacía. ",
    "El telón ha caído en La Paz, revelando que el supuesto milagro plurinacional era apenas una ilusión contable a corto plazo. ",
    "La implosión del sistema boliviano no es una casualidad, es la matemática inexorable de gastar lo que no se produce. "
]

BOLIVIA_2 = [
    "Durante años nos vendieron el espejismo de un milagro económico sostenido por hilos de seda pero la realidad macroeconómica ha venido a cobrar la factura. ",
    "Forzar una maquinaria económica basándose únicamente en retórica revolucionaria equivale a construir castillos sobre arenas movedizas. ",
    "La narrativa del milagro plurinacional se ahoga en sus propios números rojos mientras la liquidez estatal se evapora sin remedio. ",
    "Cuando el capital del estado se agota las facciones internas desenfundan los cuchillos abandonando cualquier pretensión de hermandad. ",
    "El populismo agota las arcas y cuando el dinero desaparece la lealtad de las calles se esfuma como agua en el desierto ardiente. ",
    "Las arcas vacías no entienden de discursos revolucionarios ni de apologías al pasado glorioso; solo reflejan la ruina administrativa. ",
    "Es un choque frontal contra el muro de la realidad fiscal, donde las promesas mesiánicas no logran pagar los salarios ni los subsidios. ",
    "La ineficiencia estructural finalmente superó a la propaganda, dejando al país frente a una encrucijada financiera de proporciones bíblicas. ",
    "Se ha agotado el oxígeno financiero que mantenía a flote la ilusión, forzando a los actores políticos a una guerra descarnada por las sobras. ",
    "Agotados los recursos estratégicos, el gobierno se ve obligado a recurrir a la represión y la fractura interna como únicos métodos de supervivencia. "
]

BOLIVIA_3 = [
    "Quien domina el litio y los recursos estratégicos domina la supervivencia del estado, y en esta partida los ciudadanos son simples peones. ",
    "La verdadera pugna no es ideológica, es un combate a muerte por el control de la energía del mañana y las riquezas del subsuelo. ",
    "Transformar el estado en un botín corporativo disfrazado de lucha social es el truco de magia más antiguo y doloroso del continente. ",
    "Detrás del ruido mediático la disputa real y cruda es por la hegemonía de los recursos naturales que las potencias globales codician. ",
    "Las facciones en guerra hoy solo disputan quién se quedará con los restos del naufragio económico para venderlos al mejor postor. ",
    "El pueblo asiste impotente a un saqueo sistematizado donde la retórica de izquierda sirve de telón para el corporativismo de estado. ",
    "El control de los hidrocarburos y los minerales se ha convertido en una maldición que corroe cualquier intento de democracia real. ",
    "Lejos de los discursos de liberación, lo que impera es una lógica de cártel donde los ministerios operan como feudos personales. ",
    "La avaricia por asegurar el monopolio del litio ha desencadenado una cacería de brujas política sin precedentes en la historia reciente. ",
    "El país se ha transformado en un tablero de ajedrez donde operadores internacionales mueven los hilos del caos para asegurar sus inversiones. "
]

BOLIVIA_4 = [
    "Se trata de una tragedia anunciada que duele profundamente pero que enseña una lección invaluable a toda la región. ",
    "Asistimos al réquiem de un modelo insostenible que la historia juzgará con una severidad implacable e ineludible. ",
    "Un recordatorio amargo y necesario para quienes creen que las leyes de la economía se pueden derogar por simple decreto presidencial. ",
    "Una lección magistral y dolorosa sobre los límites del mesianismo político, donde solo quedan sistemas frágiles sucumbiendo a su arrogancia. ",
    "La historia latinoamericana se repite como una farsa trágica, demostrando que la ideología jamás podrá sustituir a la sensatez financiera. ",
    "El costo de esta miopía lo pagarán las próximas generaciones, atrapadas en un ciclo de endeudamiento y polarización crónica. ",
    "Al final del día, el caudillismo demuestra ser la receta perfecta para el desastre institucional y la pobreza generalizada. ",
    "Negar esta realidad no es ceguera, es complicidad directa con un régimen que prefirió el poder absoluto a la estabilidad nacional. ",
    "No hay atajos para entender este nivel de deterioro; es el fruto directo de años de megalomanía y falta de contrapesos. ",
    "El abismo boliviano sirve de espejo para toda América Latina advirtiendo los letales peligros del hiperpresidencialismo sin control. "
]


MUSK_1 = [
    "La cruzada judicial entre Elon Musk y Sam Altman es la verdadera guerra fría de nuestra era moderna. ",
    "El espectáculo jurídico que protagonizan OpenAI y Elon Musk trasciende el chisme de Silicon Valley para convertirse en una advertencia existencial. ",
    "La demanda que sacude los cimientos de la inteligencia artificial nos revela la oscura verdad detrás del milagro algorítmico. ",
    "Sam Altman y Elon Musk están escenificando el debate más trascendental de la historia humana disfrazado de un litigio por incumplimiento de contrato. ",
    "Observar la batalla de titanes entre Altman y Musk es presenciar la privatización definitiva del intelecto sintético. ",
    "El choque legal en la cúpula de OpenAI es la autopsia en tiempo real de una ética tecnológica que nació muerta. ",
    "La guerra de Silicon Valley ha dejado de ser sobre redes sociales para convertirse en una disputa por el alma del futuro digital. ",
    "El cisma en OpenAI descorre el velo de una industria donde el mesianismo tecnológico oculta la ambición más primitiva. ",
    "Musk y Altman no pelean por una junta directiva, pelean por sentarse en el trono del imperio algorítmico global. ",
    "El litigio del siglo no ocurre en estrados internacionales sino en tribunales de California, donde se subasta la inteligencia artificial. "
]

MUSK_2 = [
    "Bajo la reluciente careta de la filantropía y la supuesta protección de la especie humana se esconde un apetito voraz por monopolizar el código fuente. ",
    "El código es la nueva arma de destrucción o construcción masiva y la disputa por su control carece de cualquier marco ético real. ",
    "Detrás de los discursos grandilocuentes sobre el peligro existencial de la IA se esconde una vulgar pelea por el monopolio de las redes neuronales. ",
    "La guerra narrativa es fascinante por su nivel de cinismo, donde un bando utiliza el pánico para consolidar su monopolio regulatorio. ",
    "Altman promete salvación mientras privatiza el conocimiento, y Musk exige apertura mientras cierra herméticamente sus propios feudos digitales. ",
    "Hablan de salvar a la humanidad de una catástrofe robótica mientras compiten ferozmente por ser los primeros en desencadenarla. ",
    "La ética corporativa se disuelve cuando hay trillones de dólares en juego y el premio es la hegemonía cognitiva global. ",
    "Ninguno de los dos bandos defiende al ciudadano; ambos utilizan la moralidad como una táctica de relaciones públicas para asfixiar a la competencia. ",
    "El altruismo prometido en los inicios de OpenAI se ha evaporado, reemplazado por un hipercapitalismo salvaje disfrazado de progreso. ",
    "Ambos titanes pretenden ser los mesías del silicio, pero sus acciones reflejan la frialdad de quienes solo veneran el crecimiento exponencial. "
]

MUSK_3 = [
    "El derecho corporativo que rige nuestros tribunales es un pergamino obsoleto intentando contener a entidades que diseñan intelectos superiores. ",
    "La hipocresía es asombrosa e innegable, reduciendo la seguridad global a un simple balance financiero trimestral entre multimillonarios. ",
    "Los tribunales intentan aplicar leyes del siglo pasado a tecnologías que están rediseñando irreversiblemente la conciencia humana. ",
    "Resulta aterrador comprender que no existe un contrapeso democrático a este nivel astronómico de concentración de poder algorítmico. ",
    "Estamos dejando el destino de la humanidad en manos de juntas directivas que no responden ante ningún soberano ni parlamento. ",
    "Las decisiones que alterarán el curso de la civilización se toman a puerta cerrada por un puñado de ingenieros sin escrutinio público. ",
    "El sistema legal es como un escudo de papel frente a corporaciones que acumulan un poder casi divino a un ritmo vertiginoso. ",
    "Los legisladores asisten como espectadores pasivos a una revolución que desmantela los fundamentos mismos de la soberanía estatal. ",
    "Es una asimetría de poder brutal; las grandes tecnológicas redactan sus propias reglas mientras la sociedad civil asimila pasivamente los impactos. ",
    "La ausencia de un marco regulatorio global permite que estas entidades operen como naciones estado soberanas e inexpugnables. "
]

MUSK_4 = [
    "Despertemos del letargo tecnológico de una vez por todas. Nos prometieron la llave del universo y nos forjaron cadenas invisibles. ",
    "Los reguladores observan este choque como quien mira llover, incapaces de articular una ley que detenga este naciente tecno-feudalismo. ",
    "Una farsa monumental donde el usuario común es el perdedor predeterminado, entregando su privacidad por comodidades efímeras. ",
    "Es el nacimiento de un nuevo orden mundial. La ingenuidad de creer que estas tecnologías nos harán libres quedará sepultada para siempre. ",
    "Al final del día, es la guerra fría del siglo veintiuno y la estamos perdiendo por estar distraídos venerando a los ídolos equivocados. ",
    "Bienvenidos a la tiranía del algoritmo, donde el libre albedrío se subasta al mejor postor corporativo. ",
    "El monopolio sobre el pensamiento automatizado es la amenaza más grave a la que nos hemos enfrentado como civilización moderna. ",
    "Nadie vendrá a rescatarnos de este oligopolio cognitivo si no empezamos a desmitificar a los profetas de Silicon Valley. ",
    "Es hora de aceptar que la revolución de la IA no fue diseñada para emanciparnos, sino para perfeccionar nuestra sumisión productiva. ",
    "La utopía prometida ha colapsado, dejando en su lugar un panorama de vigilancia, control y extractivismo de datos sin precedentes. "
]

COL_1 = [
    "El naufragio de la derecha colombiana de cara al 2026 es un espectáculo tan predecible como doloroso de presenciar. ",
    "El tablero electoral colombiano para las próximas elecciones revela una ceguera política que raya en el delirio clínico. ",
    "La fractura de la oposición en Colombia es el síntoma de una enfermedad crónica que podemos denominar el síndrome del mesías fragmentado. ",
    "Asistimos a la crónica de una derrota electoral meticulosamente diseñada desde las propias filas de la derecha colombiana. ",
    "La torpeza estratégica de las élites conservadoras en Colombia ha alcanzado niveles que desafían cualquier lógica electoral básica. ",
    "Observar la atomización de la derecha es ser testigo de un suicidio sociopolítico ejecutado con un entusiasmo verdaderamente escalofriante. ",
    "El panorama preelectoral colombiano exhibe a una oposición atrapada en un laberinto de vanidades y rencores irreconciliables. ",
    "La derecha nacional parece empeñada en demostrar que su capacidad de autodestrucción no conoce límite histórico alguno. ",
    "La contienda para el 2026 se perfila como un festival de egos donde el oficialismo ni siquiera tiene que esforzarse para brillar. ",
    "La ceguera de los líderes opositores colombianos es tan monumental que parece un guion escrito por sus propios detractores. "
]

COL_2 = [
    "Ver a figuras como Abelardo de la Espriella y Paloma Valencia disputándose las migajas del electorado es escuchar a la orquesta del Titanic. ",
    "La división impulsada por candidaturas paralelas es matemáticamente un regalo envuelto en papel de seda para la actual administración. ",
    "Cada candidato cree genuinamente ser el único iluminado capaz de enderezar el rumbo, negándose rotundamente a sumar fuerzas vitales. ",
    "La guerra civil entre figuras conservadoras es la melodía perfecta y tranquilizadora para los oídos del actual ejecutivo gubernamental. ",
    "La estrategia del progresismo es de un cinismo brillante porque no necesitan ganar por mérito cuando sus rivales se devoran a sí mismos. ",
    "El canibalismo electoral entre aliados naturales asegura la dispersión del voto de castigo, fragmentándolo hasta volverlo irrelevante. ",
    "Disputar la pureza ideológica en medio de una crisis institucional es el equivalente a debatir sobre estética mientras la casa arde. ",
    "La soberbia de los precandidatos les impide entender que un diez por ciento de apoyo no basta para recuperar el timón de la república. ",
    "En lugar de construir una coalición sólida, optan por levantar barricadas de vanidad que solo benefician al proyecto que pretenden derrotar. ",
    "La competencia fratricida asegura que la mitad de los esfuerzos de campaña se gasten en destruir al aliado en lugar de enfrentar al opositor. "
]

COL_3 = [
    "Mientras los sectores conservadores organizan torneos de pureza inútil, la izquierda avanza en la sombra tejiendo redes territoriales. ",
    "El adversario no tiene que mover un solo dedo para triunfar; le basta con observar pacientemente cómo las facciones se aniquilan. ",
    "Divide y vencerás es la lección más vieja, y el oficialismo la está aplicando con una maestría absoluta, alimentando las fricciones. ",
    "Carecen de la madurez y el pragmatismo que exigen los momentos de crisis profunda, priorizando la estética de la confrontación interna. ",
    "El oficialismo capitaliza cada insulto cruzado entre la oposición, utilizando la polarización opositora como su mejor escudo defensivo. ",
    "La desconexión absoluta con el pragmatismo electoral garantiza que el gobierno actual consolide su poder de cara al próximo periodo. ",
    "Se niegan a aplicar la aritmética electoral más elemental, prefiriendo naufragar solos que llegar a la orilla compartiendo el crédito. ",
    "Los estrategas del pacto de gobierno celebran a carcajadas este espectáculo de divisionismo que les asegura la continuidad sin sobresaltos. ",
    "Mientras la derecha pelea por ser tendencia en redes, el oficialismo moviliza maquinarias reales y tangibles en las regiones del país. ",
    "La falta de un frente unido es un pase libre para que el actual modelo se atrinche y perpetúe sus lógicas de poder sin oposición real. "
]

COL_4 = [
    "La historia política rara vez perdona tamaña miopía estratégica; el premio de consolación será perder la nación por completo. ",
    "Un desastre anunciado con bombos y platillos. El ego inquebrantable de los autodenominados salvadores será la llave que asegure el modelo. ",
    "La factura histórica de este berrinche electoral será inmensa. Cuando despierten del letargo, el país ya habrá cruzado el punto de no retorno. ",
    "Entregar el futuro de una nación por la absoluta incapacidad de domesticar los egos es un espectáculo que los libros de historia no perdonarán. ",
    "Asistimos a un naufragio colectivo impulsado por la terquedad, donde el precio final lo pagarán las clases medias y populares. ",
    "Es una bofetada a los ciudadanos que claman por un cambio de rumbo y solo reciben un circo de ambiciones personales irrefrenables. ",
    "La arrogancia terminará costándoles no solo una elección, sino la irrelevancia política permanente durante las próximas décadas. ",
    "Este síndrome del mesianismo fraccionado será recordado como el error más catastrófico del conservadurismo en el siglo veintiuno. ",
    "La torpeza tiene un precio, y en política, ese precio se paga con el abandono absoluto del poder y el sometimiento a la agenda rival. ",
    "No hay excusas válidas para este suicidio transmitido en vivo; es la demostración palmaria de que el ego venció definitivamente a la patria. "
]

def generate_all_posts(total=177):
    # Generar todos asegurando que sean 100% únicos usando un Set
    unique_texts = set()
    posts = []
    
    def get_unique_mix(L1, L2, L3, L4):
        while True:
            t = f"{random.choice(L1)}{random.choice(L2)}{random.choice(L3)}{random.choice(L4)}"
            if t not in unique_texts:
                unique_texts.add(t)
                return t
                
    for i in range(total):
        if i % 3 == 0:
            topic = "Golpe de estado en Bolivia y Evo Morales"
            text = get_unique_mix(BOLIVIA_1, BOLIVIA_2, BOLIVIA_3, BOLIVIA_4)
        elif i % 3 == 1:
            topic = "Litigio de Elon Musk vs. Sam Altman: Análisis Jurídico Especial"
            text = get_unique_mix(MUSK_1, MUSK_2, MUSK_3, MUSK_4)
        else:
            topic = "Elecciones de Colombia 2026: Fragmentación de la derecha por estrategia de izquierda (Abelardo de las Prie, Paloma)"
            text = get_unique_mix(COL_1, COL_2, COL_3, COL_4)
            
        posts.append({
            "topic": topic,
            "text": text
        })
        
    random.shuffle(posts)
    return [(p["topic"], p["text"]) for p in posts]
