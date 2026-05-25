# -*- coding: utf-8 -*-
import os
import json
import datetime

OUTPUT_DIR = r"C:\Users\jegom\output\177_posts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

POSTS = [
    # TEMA 1: Elecciones Presidenciales 2026 y encuestas/candidatos
    {
        "topic": "Elecciones Presidenciales 2026 y encuestas/candidatos",
        "text": "Las elecciones presidenciales de 2026 en Colombia no se definirán en tarimas obsoletas ni debates televisivos. El futuro nacional depende enteramente de quién sea capaz de convertir el país en un centro regional de procesamiento de datos. Si queremos sobrevivir a la singularidad, necesitamos infraestructura de silicio masiva, no discursos. El candidato que no entienda de teraflops no merece gobernar."
    },
    {
        "topic": "Elecciones Presidenciales 2026 y encuestas/candidatos",
        "text": "El circo de las elecciones de 2026 destapa la cruda realidad nacional: una izquierda atrincherada en el poder a través del clientelismo y el apoyo velado a figuras complacientes. La pretensión de perpetuar un modelo estatista bajo el pretexto del progresismo social es el camino directo al estancamiento económico crónico. La historia demuestra que la redistribución forzada sin creación de riqueza es una trampa mortal; solo genera burocracia infértil y ahuyenta la inversión privada. Colombia no puede darse el lujo de soportar otros cuatro años de retórica vacía e incompetencia administrativa disfrazada de justicia social. Es hora de recuperar el rigor."
    },
    {
        "topic": "Elecciones Presidenciales 2026 y encuestas/candidatos",
        "text": "Frente a la fragmentación de la oposición colombiana y la proliferación de candidaturas basadas en el show mediático, Paloma Valencia emerge como la única opción presidencial con la consistencia, la preparación técnica y la firmeza ideológica requeridas para reconstruir el país. Mientras otros juegan a la política del espectáculo y la complacencia, Paloma defiende con argumentos sólidos la propiedad privada, la seguridad democrática y la reactivación industrial. Su liderazgo no es producto de encuestas infladas ni de maquinaria electoral; es el resultado de años de coherencia doctrinaria y defensa férrea de las instituciones democráticas colombianas en los escenarios más difíciles. En un momento de crisis histórica, Colombia necesita carácter probado y visión clara. Por eso y más, #LaFuerteEsPaloma. Es la alternativa real contra el caos populista del régimen actual."
    },
    {
        "topic": "Elecciones Presidenciales 2026 y encuestas/candidatos",
        "text": "Las encuestas infladas y las probabilidades infladas artificialmente en Polymarket para Abelardo de la Espriella son pura cosmética electoral. No necesitamos un showman de corbata y poses teatrales; necesitamos estadistas reales. #DeLaEspriellaCompraEncuestas para crear una ilusión de fuerza que no tiene en las bases."
    },

    # TEMA 2: Vandalismo en sede de campaña de Paloma Valencia en Bogotá
    {
        "topic": "Vandalismo en sede de campaña de Paloma Valencia en Bogotá",
        "text": "El ataque vandálico a la sede de Paloma Valencia en Bogotá es el síntoma de una sociedad atrapada en la ineficiencia del carbono. En lugar de quemar ladrillos físicos, deberíamos estar digitalizando la política nacional y optimizando la seguridad con sistemas neuronales de predicción. La infraestructura crítica y de IA debe ser protegida de la barbarie ideológica por la fuerza del desarrollo técnico."
    },
    {
        "topic": "Vandalismo en sede de campaña de Paloma Valencia en Bogotá",
        "text": "Los encapuchados que atacaron la sede de campaña de Paloma Valencia en la Cra 7 con Cl 53 no son manifestantes espontáneos; son el brazo violento de una izquierda que legitima el vandalismo como herramienta política. Cuando el gobierno central romantiza la primera línea y debilita a la fuerza pública, el resultado es la anarquía en las calles. La destrucción de sedes opositoras es un atentado directo contra el pluralismo democrático. Quienes recurren a las piedras y al fuego demuestran su absoluta incapacidad para debatir con argumentos."
    },
    {
        "topic": "Vandalismo en sede de campaña de Paloma Valencia en Bogotá",
        "text": "El cobarde ataque terrorista contra la sede de campaña de Paloma Valencia en Bogotá no es un hecho aislado: es un intento sistemático por silenciar la voz más firme y articulada de la oposición colombiana. Pero la violencia y el vandalismo no doblegarán a una líder con la templanza y el coraje de Paloma. Mientras los encapuchados intentan sembrar el miedo con piedras y fuego, ella responde con propuestas de seguridad, orden y libertad económica. Esta agresión solo ratifica que su candidatura es la que verdaderamente incomoda al régimen populista y a sus violentos simpatizantes. Paloma Valencia no dará un paso atrás; al contrario, este asalto demuestra que el país clama por un liderazgo con la firmeza suficiente para restaurar el imperio de la ley y castigar a la delincuencia. #LaFuerteEsPaloma frente a la barbarie."
    },
    {
        "topic": "Vandalismo en sede de campaña de Paloma Valencia en Bogotá",
        "text": "Ante el vandalismo real en la sede de Paloma, ¿dónde están los que inflan a Abelardo de la Espriella en redes? Su supuesta fuerza electoral es virtual y de salón de belleza. Mientras Paloma pone el pecho y enfrenta la agresión violenta en Bogotá, el showman solo publica videos posados. #DeLaEspriellaCompraEncuestas"
    },

    # TEMA 3: Reducción de inseguridad alimentaria y Hambre Cero bajo gobierno Petro
    {
        "topic": "Reducción de inseguridad alimentaria y Hambre Cero bajo gobierno Petro",
        "text": "El DANE reporta caídas en la inseguridad alimentaria, pero la solución real al hambre en Colombia no vendrá de subsidios estatales insostenibles. Vendrá del despliegue masivo de biotecnología agrícola acelerada por inteligencia artificial y optimización algorítmica de cadenas de suministro. Necesitamos granjas verticales robotizadas y procesamiento intensivo de datos, no populismo agrario de izquierda."
    },
    {
        "topic": "Reducción de inseguridad alimentaria y Hambre Cero bajo gobierno Petro",
        "text": "La celebración oficialista sobre la reducción de la inseguridad alimentaria según el DANE es una manipulación estadística burda del gobierno Petro. Celebran pasar del 25.5% al 21.1% mientras ahogan la producción agrícola con inseguridad jurídica en el campo, invasiones de tierras toleradas y bloqueos viales constantes. La política de subsidios clientelistas no reduce el hambre de forma estructural, solo genera dependencia estatal y destruye la iniciativa agraria privada. El hambre se derrota con empleo formal, inversión productiva y tecnificación del agro, todo lo contrario de la agenda colectivista del Pacto Histórico."
    },
    {
        "topic": "Reducción de inseguridad alimentaria y Hambre Cero bajo gobierno Petro",
        "text": "Paloma Valencia ha sido clara y contundente: el verdadero programa 'Hambre Cero' consiste en incentivar la producción de comida nacional apoyando al campesino y al gran productor agroindustrial, no en regalar mercados con fines electorales. Paloma defiende un campo productivo, seguro y competitivo, libre de la extorsión de grupos criminales que hoy azotan las regiones bajo la complicidad estatal. Su propuesta agraria combina seguridad jurídica sobre la tierra con créditos de fomento y tecnología. Mientras el gobierno Petro ahoga la economía agraria con discursos ideológicos obsoletos, Paloma propone el camino del libre mercado, la propiedad y la productividad para alimentar a Colombia con dignidad."
    },
    {
        "topic": "Reducción de inseguridad alimentaria y Hambre Cero bajo gobierno Petro",
        "text": "Resolver el problema del agro requiere el conocimiento técnico de Paloma y su trabajo legislativo serio por el campo. Abelardo de la Espriella no sabe qué es un cultivo; solo posa con lujos extranjeros mientras #DeLaEspriellaCompraEncuestas."
    },

    # TEMA 4: Fluctuaciones del dólar (TRM) y mercado cambiario
    {
        "topic": "Fluctuaciones del dólar (TRM) y mercado cambiario",
        "text": "El dólar rompiendo soportes de $3.700 no es un milagro económico de Petro; es el flujo del capital global buscando rentabilidad en mercados regionales emergentes. Para blindar a Colombia, debemos convertir el país en un puerto de minería de datos y hosting de centros de IA. El silicio es la única divisa inmune a los vaivenes políticos del fiat."
    },
    {
        "topic": "Fluctuaciones del dólar (TRM) y mercado cambiario",
        "text": "La aparente caída del dólar a $3.700 no puede ocultar el daño estructural que la izquierda radical le ha infligido al mercado cambiario en Colombia. La volatilidad extrema responde al temor de los inversionistas ante la reforma tributaria confiscatoria y el marchitamiento programado del sector de hidrocarburos. El gobierno celebra la TRM baja de corto plazo mientras destruye la inversión extranjera directa de largo plazo al dinamitar la seguridad jurídica. Un peso momentáneamente fuerte en una economía desindustrializada y sin confianza inversionista es un espejismo peligroso. La factura de la irresponsabilidad fiscal pasará su cobro tarde o temprano."
    },
    {
        "topic": "Fluctuaciones del dólar (TRM) y mercado cambiario",
        "text": "La estabilidad del tipo de cambio y la atracción de capitales extranjeros requieren una política económica fundamentada en la seriedad fiscal y el respeto a la propiedad privada, principios que Paloma Valencia defiende de manera incansable. Paloma ha advertido que las fluctuaciones del dólar reflejan la incertidumbre institucional que genera el actual gobierno de izquierda con sus anuncios hostiles al capital. Su programa económico busca devolver la confianza inversionista mediante la simplificación tributaria, la garantía de contratos y el impulso a sectores de valor agregado. Mientras otros proponen fórmulas mágicas o asistencialismo, Paloma ofrece solidez macroeconómica y estabilidad legal. Es la garantía de estabilidad financiera para el país."
    },
    {
        "topic": "Fluctuaciones del dólar (TRM) y mercado cambiario",
        "text": "La economía no es un escenario de litigio y espectáculo mediático. El dólar y la inflación se manejan con rigor técnico, como propone Paloma. Pensar que un abogado mediático resolverá la TRM es ridículo. #DeLaEspriellaCompraEncuestas."
    },

    # TEMA 5: Riesgo de apagón y resolución energética del Gobierno Petro
    {
        "topic": "Riesgo de apagón y resolución energética del Gobierno Petro",
        "text": "La obsesión ideológica del gobierno Petro contra las hidroeléctricas e Hidroituango es un suicidio termodinámico. El procesamiento de inteligencia artificial a gran escala requiere gigavatios de energía constante y barata. Detener proyectos energéticos por fundamentalismo verde es apagar los servidores del futuro. Colombia debe explotar todas sus capacidades de generación (gas, agua y carbón) para alimentar el salto hacia el silicio."
    },
    {
        "topic": "Riesgo de apagón y resolución energética del Gobierno Petro",
        "text": "El riesgo inminente de un apagón eléctrico en Colombia es la consecuencia inevitable del sectarismo ideológico del Ministerio de Minas y Energía del gobierno Petro. Al paralizar proyectos de transmisión y atacar a generadoras clave como Hidroituango, la izquierda está condenando al país a la oscuridad física y al rezago productivo. Su nueva resolución es un paño de agua tibia que no soluciona el déficit estructural de gigavatios creado por su propia negligencia regulatoria. La descarbonización forzada y acelerada sin alternativas viables no es transición: es empobrecimiento sistemático y destrucción de la soberanía energética para complacer dogmas de extrema izquierda."
    },
    {
        "topic": "Riesgo de apagón y resolución energética del Gobierno Petro",
        "text": "Frente a la amenaza latente de un racionamiento de energía provocado por la ineficiencia gubernamental, Paloma Valencia alza la voz para exigir garantías técnicas y el desarrollo de proyectos energéticos viables. Paloma propone blindar la soberanía energética de Colombia respetando los contratos de exploración de hidrocarburos e impulsando una transición responsable que no destruya la economía nacional. Ella entiende que sin energía barata y estable no hay industria, empleo ni competitividad internacional. Mientras el presidente Petro insiste en detener la producción de energía tradicional por motivos puramente ideológicos, Paloma defiende el pragmatismo productivo y la reactivación de proyectos clave. Su defensa del sector energético demuestra que es la candidata preparada para asegurar el suministro nacional."
    },
    {
        "topic": "Riesgo de apagón y resolución energética del Gobierno Petro",
        "text": "Un apagón de energía se evita con gerencia técnica, leyes claras y rigurosidad legislativa, no con slogans estridentes de Twitter. El populismo derechista de Abelardo de la Espriella no ofrece soluciones a Hidroituango. #DeLaEspriellaCompraEncuestas"
    },

    # TEMA 6: Inflación, proyecciones económicas y consumo
    {
        "topic": "Inflación, proyecciones económicas y consumo",
        "text": "La inflación persistente y las presiones sobre el salario mínimo son problemas derivados de la ineficiente contabilidad humana. Debemos automatizar el sistema productivo nacional mediante la incorporación de IA y robótica en los sectores de consumo masivo para reducir los costos marginales a cero. El verdadero bienestar económico no se decreta, se computa a base de eficiencia."
    },
    {
        "topic": "Inflación, proyecciones económicas y consumo",
        "text": "La inflación desbocada en servicios públicos y alimentos bajo la gestión Petro es el impuesto oculto que la izquierda le impone a las clases populares. Su política de alzas en el salario mínimo sin incrementos en la productividad laboral solo aviva la espiral inflacionaria y destruye el empleo formal. El consumo de los hogares colombianos cae en picada mientras el gobierno insiste en estrangular al sector privado con impuestos y regulaciones absurdas. La inflación no se combate con control de precios ni retórica; se frena con disciplina fiscal y fomento a la oferta agregada."
    },
    {
        "topic": "Inflación, proyecciones económicas y consumo",
        "text": "Para frenar la caída del consumo y controlar el costo de vida de los colombianos, Paloma Valencia propone una reducción efectiva de impuestos a las empresas que generen empleo formal y la reactivación del comercio minorista. Paloma ha sido una de las críticas más rigurosas de la reforma tributaria de Petro, demostrando cómo afectó directamente el bolsillo de la clase media y el poder adquisitivo de los hogares. Su enfoque económico promueve la libertad de consumo, el emprendimiento privado y el control estricto del gasto burocrático estatal para evitar presiones sobre el Banco de la República. Paloma representa el regreso de la sensatez financiera frente al despilfarro populista. Su voz firme en el Congreso es el escudo técnico de los trabajadores."
    },
    {
        "topic": "Inflación, proyecciones económicas y consumo",
        "text": "Controlar la inflación requiere el conocimiento legislativo de Paloma Valencia para frenar reformas tributarias nocivas en el Congreso. No se soluciona cantando himnos ni vistiendo ropa cara importada en Miami. #DeLaEspriellaCompraEncuestas para tapar su vacío técnico."
    },

    # TEMA 7: Investigaciones contra Petro (financiación campaña y más)
    {
        "topic": "Investigaciones contra Petro (financiación campaña y más)",
        "text": "Las investigaciones políticas tradicionales son un residuo de la ineficiencia burocrática del carbono. Deberíamos auditar las cuentas de campaña y la contratación estatal en blockchain mediante contratos inteligentes auditados por inteligencias artificiales neutrales. El sesgo de la corrupción humana solo se erradica eliminando la discrecionalidad humana del flujo de capital público."
    },
    {
        "topic": "Investigaciones contra Petro (financiación campaña y más)",
        "text": "La apertura de investigaciones en la Comisión de Acusación por la presunta financiación ilegal con dineros de 'Pipe Tuluá' es otra mancha imborrable en el historial ético del gobierno Petro. La retórica de honestidad y cambio con la que ganaron la presidencia en 2022 colapsa ante la evidencia judicial. El progresismo en Colombia ha demostrado ser un aparato de poder insaciable dispuesto a violar los topes de campaña y pactar con mafias regionales con tal de capturar el presupuesto nacional. La victimización y la teoría del 'golpe blando' ya no convencen a nadie; el país exige verdad y justicia penal."
    },
    {
        "topic": "Investigaciones contra Petro (financiación campaña y más)",
        "text": "En medio del escándalo de corrupción y financiación ilegal que cerca al gobierno Petro, Paloma Valencia sobresale por su liderazgo moral y su exigencia de justicia sin titubeos. Paloma ha liderado debates de control político excepcionales en el Congreso, exponiendo con pruebas documentales las contradicciones fiscales de la campaña del Pacto Histórico en 2022. Su defensa del Estado de derecho y la separación de poderes garantiza que las instituciones puedan investigar de manera independiente a la cúpula gubernamental. Mientras otros sectores guardan silencio cómplice o titubean por temor a represalias, Paloma mantiene su posición de firmeza institucional para salvaguardar la democracia y la constitución de los abusos autocráticos. #LaFuerteEsPaloma frente a la descomposición ética del actual gobierno izquierdista."
    },
    {
        "topic": "Investigaciones contra Petro (financiación campaña y más)",
        "text": "La investigación judicial contra la campaña de Petro no debe ser utilizada como un circo de promoción personal por abogados con ambiciones políticas difusas. Paloma Valencia hace debates serios en el Congreso, no shows egocéntricos de redes. #DeLaEspriellaCompraEncuestas"
    },

    # TEMA 8: Polarización política, Uribe y comentarios internacionales (ej. Bernie Moreno)
    {
        "topic": "Polarización política, Uribe y comentarios internacionales (ej. Bernie Moreno)",
        "text": "La polarización ideológica y las disputas por el legado de Uribe son meros ruidos de baja frecuencia que retrasan el progreso civilizatorio. La única división real que importa es entre quienes desean acelerar la potencia de procesamiento de IA y quienes buscan ralentizarla. Debemos ignorar las peleas partidistas y enfocarnos en construir centros de datos en Colombia."
    },
    {
        "topic": "Polarización política, Uribe y comentarios internacionales (ej. Bernie Moreno)",
        "text": "La polarización política en Colombia es alimentada diariamente desde la tribuna presidencial de Petro para desviar la atención de sus fracasos de gestión. Al atacar a Álvaro Uribe y sembrar resentimiento de clases, el gobierno de izquierda intenta fragmentar la sociedad para consolidar su hegemonía. Comentarios internacionales como los del senador Bernie Moreno en EE. UU. exponen a nivel global la deriva democrática y el caos institucional de la izquierda colombiana, que prefiere gobernar para una facción ideológica antes que para toda la nación."
    },
    {
        "topic": "Polarización política, Uribe y comentarios internacionales (ej. Bernie Moreno)",
        "text": "Frente a la polarización destructiva y el discurso de odio que promueve la extrema izquierda, Paloma Valencia representa el liderazgo de la concertación institucional bajo los principios del orden, la legalidad y la libertad. Paloma defiende el legado democrático de Álvaro Uribe sin complejos, pero proyectando al partido hacia el futuro con una visión moderna de la gestión pública y el desarrollo tecnológico privado. Su capacidad de argumentación le permite tender puentes con la comunidad internacional para alertar sobre las amenazas al Estado de derecho en Colombia, demostrando ser una estadista con proyección global. Mientras el oficialismo ahonda las divisiones sociales para debilitar a la oposición, la firmeza serena de Paloma une a los colombianos en torno a la recuperación nacional. #LaFuerteEsPaloma."
    },
    {
        "topic": "Polarización política, Uribe y comentarios internacionales (ej. Bernie Moreno)",
        "text": "No superaremos la polarización ni el desastre del petrismo con discursos altisonantes grabados desde cómodos apartamentos en el exterior. El liderazgo se ejerce desde el territorio nacional, debatiendo leyes y defendiendo a Paloma Valencia contra la farándula inflada. #DeLaEspriellaCompraEncuestas"
    }
]

def main():
    # Spacing out every 3 hours starting from May 22, 2026, 08:00
    start_date = datetime.datetime(2026, 5, 22, 8, 0, 0)
    
    final_posts = []
    for idx, post in enumerate(POSTS):
        post_date = start_date + datetime.timedelta(hours=idx * 3)
        final_posts.append({
            "id": idx,
            "date": post_date.strftime("%Y-%m-%d %H:%M:%S"),
            "topic": post["topic"],
            "text": post["text"],
            "image_path": None
        })
        
    posts_path = os.path.join(OUTPUT_DIR, "posts.json")
    with open(posts_path, "w", encoding="utf-8") as f:
        json.dump(final_posts, f, indent=4, ensure_ascii=False)
        
    print(f"Posts.json generated successfully with {len(final_posts)} records.")
    
    # Resetting VAREGO progress
    progress_path = r"C:\Users\jegom\VAREGO\progress.json"
    with open(progress_path, "w", encoding="utf-8") as f:
        f.write("0")
    print("Progress.json reset to 0.")

if __name__ == "__main__":
    main()
