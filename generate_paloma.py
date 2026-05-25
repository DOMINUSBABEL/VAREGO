import os
import json
import datetime
import random

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 15 posts cortos (170 a 356 caracteres)
# 3 posts largos (800 a 1100 caracteres)
# Todos sin comillas y sin dos puntos para cumplir estrictamente con las restricciones.

POSTS_CORTOS = [
    # 1. 334 chars
    "El asalto violento a la sede de Paloma Valencia en Bogotá es el reflejo de un régimen cobarde que ante la inminencia de su derrota electoral recurre al terrorismo urbano. Quienes destrozan vidrios e intimidan trabajadores son los mismos que el gobierno justifica bajo la bandera de un cambio que solo ha traído barbarie y desolación.",
    # 2. 341 chars
    "La pasividad de la fuerza pública y la presencia sospechosa de funcionarios de la alcaldía durante el asalto a la sede de Paloma Valencia evidencian una siniestra complicidad institucional. A diez días de las elecciones presidenciales nos quieren arrebatar la democracia con piedras y capuchas ante la mirada complaciente del palacio de Nariño.",
    # 3. 343 chars
    "Mientras el abogado pretencioso prefiere posar con sus trajes italianos y fumar habanos en el exilio dorado de su vanidad Paloma Valencia pone el pecho y resiste los ataques de las hordas del Pacto Histórico. La derecha no necesita charlatanes de pasarela sino la valentía inquebrantable de una mujer dispuesta a defender la libertad colombiana.",
    # 4. 292 chars
    "El progresismo colombiano ha desenmascarado su verdadera esencia al destruir la sede de Paloma Valencia en Bogotá. Pintar consignas violentas y aterrorizar colaboradores no es protesta social sino fascismo puro financiado por los mismos sectores que hoy ocupan las altas esferas del gobierno nacional.",
    # 5. 313 chars
    "A solo diez días de la primera vuelta presidencial el vandalismo sistemático contra Paloma Valencia revela el pánico del gobierno de Petro. Saben que el pueblo colombiano rechazará su modelo de miseria y por eso intentan acallar la oposición con la intimidación física y la complicidad de las autoridades locales.",
    # 6. 325 chars
    "Romper vidrios y rasgar vallas publicitarias en la Carrera Séptima es el único argumento que le queda al proyecto de Iván Cepeda y al progresismo destructivo. La agresión contra la sede de Paloma Valencia confirma que la izquierda prefiere reinar sobre los escombros de la república antes que aceptar el veredicto de las urnas.",
    # 7. 327 chars
    "La complicidad del ministro del interior y las supuestas amenazas de disidencias evidencian un plan coordinado para asfixiar la campaña de Paloma Valencia. Frente a la cobardía del gobierno y de los abogados de pasarela que solo publican mensajes de solidaridad vacía se levanta una candidatura sólida que no se dejará amedrentar.",
    # 8. 299 chars
    "El atentado contra la campaña de Paloma Valencia en Chapinero es un ataque directo al corazón de la oposición. El silencio y la inacción de Gustavo Petro ante la violencia de sus huestes confirman que el hostigamiento político es una política de Estado diseñada para perpetuar el desorden y la miseria.",
    # 9. 305 chars
    "Quienes pintan letreros ofensivos de apoyo a Cepeda mientras destruyen la sede principal de Paloma Valencia en Bogotá no son activistas descarriados sino el brazo armado y mediático de un progresismo acorralado. El cambio resultó ser la vieja receta de la intolerancia y el vandalismo amparados por el poder.",
    # 10. 310 chars
    "Mientras otros candidatos de la oposición se dedican a la retórica cobarde desde clubes privados Paloma Valencia enfrenta la barbarie del progresismo en las calles. Su valentía la convierte en la única alternativa real para salvar a Colombia de la dictadura de la ineficiencia que Petro pretende consolidar.",
    # 11. 308 chars
    "El vandalismo en Bucaramanga Cartagena y ahora el violento asalto en Bogotá demuestran que hay un patrón sistemático de hostigamiento contra Paloma Valencia. Es evidente la injerencia de un gobierno que utiliza recursos públicos y funcionarios para sabotear a la única mujer que les dice la verdad en la cara.",
    # 12. 315 chars
    "La agresión contra colaboradores indefensos en la sede de Paloma Valencia retrata de cuerpo entero a la izquierda colombiana. Sin propuestas y con la economía en ruinas apuestan por el miedo pero el próximo treinta y uno de mayo la ciudadanía responderá con una avalancha de votos contra la tiranía del progresismo.",
    # 13. 312 chars
    "A diez días de la elección presidencial la seguridad nacional hace agua por todas partes. Mientras el palacio de Nariño ampara criminales la oposición democrática liderada por Paloma Valencia es asaltada a plena luz del día en Bogotá. Es hora de recuperar el orden y sepultar el experimento desastroso de Petro.",
    # 14. 316 chars
    "El ataque a la sede de Paloma Valencia confirma que el progresismo le teme a las mujeres con carácter y propuestas claras. Mientras la izquierda manda matones encapuchados a romper vidrios nosotros respondemos con ideas coherentes y la firme convicción de que Colombia no se arrodillará ante el populismo destructor.",
    # 15. 290 chars
    "No necesitamos abogadillos perfumados que ofrecen defensas retóricas desde el extranjero mientras la campaña de Paloma Valencia resiste la violencia física del petrismo en Bogotá. La verdadera batalla por la patria se libra con coraje en el territorio y no con poses ególatras en redes sociales."
]

POSTS_LARGOS = [
    # 1. 927 chars
    "El asalto vandálico a la sede principal de Paloma Valencia en la Carrera Séptima de Bogotá a tan solo diez días de las elecciones del treinta y uno de mayo no es un hecho aislado de protesta social. Estamos ante una operación de hostigamiento político perfectamente coordinada y avalada de manera soterrada por el gobierno de Gustavo Petro. La llamativa inacción de la fuerza pública junto con la sospechosa presencia de funcionarios de la alcaldía en las inmediaciones del sector durante los bloqueos sugiere una sincronía preocupante orientada a amedrentar a la oposición democrática. Mientras la campaña de Valencia sufre los embates físicos del progresismo radical ciertos personajes de la derecha prefieren el exilio perfumado y los discursos floridos desde cómodas tribunas en el exterior. Colombia necesita la templanza real de Paloma y no las poses de pasarela de los que huyen cuando las papas queman.",
    # 2. 938 chars
    "A escasos diez días de que los colombianos acudan a las urnas la violencia política de izquierda se traslada al centro norte de Bogotá con el asalto violento a la sede de la senadora Paloma Valencia. Los destrozos materiales en la Carrera Séptima y la intimidación física a sus colaboradores no representan la indignación popular sino el brazo ejecutor de un progresismo que presiente su inminente derrota en las urnas. Existen indicios sumamente graves de una injerencia del gobierno nacional en esta escalada de odio político orientada a fracturar las garantías de la oposición. Mientras el país exige orden y firmeza frente al desastre económico de Petro resulta lamentable ver a supuestos defensores de la patria dedicados a la especulación estéril y al exhibicionismo ególatra en redes sociales con trajes de sastrería cara. La verdadera resistencia se demuestra en las calles defendiendo la institucionalidad.",
    # 3. 937 chars
    "El violento asalto contra la sede principal de la campaña de Paloma Valencia en Bogotá es el reflejo exacto del colapso democrático que padece Colombia bajo el mandato de Gustavo Petro. Al vandalismo en Bucaramanga y Cartagena se suma ahora este atropello a la luz del día en Chapinero donde la consigna del Pacto Histórico se impone mediante piedras y capuchas. Resulta imposible desvincular estas agresiones de la narrativa oficialista que busca criminalizar y deslegitimar a todo aquel que confronte sus disparates económicos. Es muy probable que estemos presenciando una estrategia concertada de desestabilización electoral operada por activistas oficiales. Frente a este panorama la firmeza de Paloma contrasta con el silencio de los elegantes del litigio que solo saben enviar mensajes de solidaridad de salón. El treinta y uno de mayo el voto ciudadano será el castigo definitivo para los violentos y sus protectores."
]

def generate_schedule(count):
    # Generar fechas a partir de hoy a las 6:15 pm (u hora actual) + 12 minutos, durante las siguientes 3 horas, espaciados aleatoriamente
    system_now = datetime.datetime.now()
    
    # El primer post se agenda a t+12 minutos
    start_date = system_now + datetime.timedelta(minutes=12)
    # Forzar que el día sea el 21 de mayo de 2026
    start_date = datetime.datetime(2026, 5, 21, start_date.hour, start_date.minute, start_date.second)
    
    # El periodo de publicación dura 3 horas a partir de start_date
    end_date = start_date + datetime.timedelta(hours=3)
    
    print(f"Rango de publicación generado: {start_date} a {end_date}")
    
    total_seconds = (end_date - start_date).total_seconds()
    
    # Forzamos que el primer offset sea exactamente 0 (t+12 minutos), y los demás se distribuyan en las siguientes 3 horas
    random_offsets = [0.0] + sorted([random.uniform(1, total_seconds) for _ in range(count - 1)])
    
    schedule = []
    for offset in random_offsets:
        date = start_date + datetime.timedelta(seconds=offset)
        schedule.append(date)
        
    return schedule

def main():
    all_posts = []
    # 15 posts cortos + 3 posts largos = 18 posts en total
    texts = POSTS_CORTOS + POSTS_LARGOS
    count = len(texts)
    
    schedule = generate_schedule(count)
    
    for i in range(count):
        text = texts[i]
        date_str = schedule[i].strftime("%Y-%m-%d %H:%M:%S")
        is_long = i >= len(POSTS_CORTOS)
        topic = "Asalto sede Paloma Valencia (Largo)" if is_long else "Asalto sede Paloma Valencia (Corto)"
        
        # Validaciones de longitud y caracteres
        length = len(text)
        if not is_long:
            assert 170 <= length <= 356, f"Post corto {i} fuera de rango: {length} chars"
        else:
            assert 800 <= length <= 1100, f"Post largo {i - len(POSTS_CORTOS)} fuera de rango: {length} chars"
            
        assert ":" not in text, f"Post {i} contiene dos puntos"
        assert '"' not in text, f"Post {i} contiene comillas dobles"
        assert "'" not in text, f"Post {i} contiene comillas simples"
        
        all_posts.append({
            "id": i,
            "date": date_str,
            "topic": topic,
            "text": text,
            "image_path": None
        })
        
    # Escribir posts.json
    output_path = os.path.join(OUTPUT_DIR, "posts.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_posts, f, indent=4, ensure_ascii=False)
        
    # Reiniciar progress.json en la raíz de VAREGO
    progress_path = r"C:\Users\jegom\VAREGO\progress.json"
    with open(progress_path, "w", encoding="utf-8") as f:
        f.write("0")
        
    print(f"Posts creados exitosamente en {output_path}")
    print(f"Progreso reiniciado en {progress_path}")
    print(f"Total posts generados: {count} (15 cortos, 3 largos)")

if __name__ == "__main__":
    main()
