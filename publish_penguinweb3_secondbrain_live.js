const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// Hilo de 13 posts sobre Obsidian e integración con Inteligencia Artificial
// Español impecable, sin comillas ni guiones
// Longitud de cada post estrictamente entre 550 y 720 caracteres
const HILO_POSTS = [
    "La gestión de conocimiento personal ha dado un vuelco radical con la integración de inteligencia artificial. Obsidian ya no es una simple aplicación de notas estéticas sino que se consolida como el repositorio de contexto definitivo para alimentar a nuestros agentes cognitivos autónomos.\n\nEl verdadero valor de almacenar nuestras ideas, decisiones y fallos históricos radica en estructurar estos datos de forma que los modelos de lenguaje puedan leer y extraer patrones de nuestro pensamiento. Analizaremos en profundidad la arquitectura técnica para conectar tu segundo cerebro con modelos comerciales y locales, permitiendo que la máquina comprenda tu criterio y actúe bajo tu estilo de manera autónoma. 👇",
    "El principal error al construir una base de conocimientos para inteligencia artificial es centrarse en clasificaciones rígidas o carpetas complejas. Los modelos de lenguaje no requieren un orden visual tradicional sino relaciones semánticas sólidas y un contexto detallado de las notas. Cada archivo debe contener información sobre el propósito del tema, las implicaciones prácticas y los enlaces a conceptos relacionados.\n\nPara lograr una ingesta de datos eficiente estructuramos el directorio raíz en diez carpetas esenciales que segmentan desde las ideas preliminares hasta los flujos de trabajo repetibles, garantizando que el agente localice los recursos de manera veloz y precisa. 📂",
    "La conexión técnica entre Obsidian y los modelos de lenguaje comerciales de gama alta como Claude de Anthropic se realiza mediante la interfaz de programación de aplicaciones. A través de complementos comunitarios o scripts personalizados en Python podemos enviar el contenido de una nota o de una carpeta entera directamente como contexto dentro del system prompt.\n\nAl recibir esta información el modelo deja de generar respuestas genéricas y vacías ya que cuenta con un historial de tus preferencias, tu estilo de redacción y las decisiones estratégicas previas. Esto transforma el chat tradicional en una extensión interactiva de tu propia capacidad cognitiva y de análisis. 🔗",
    "Para aquellos desarrolladores que priorizan la privacidad absoluta del conocimiento personal la alternativa ideal consiste en desplegar modelos de lenguaje de código abierto de forma local. Herramientas como Ollama y vLLM facilitan la ejecución de modelos de catorce mil millones de parámetros en computadores personales con chips de memoria unificada.\n\nMediante la API local de estos motores podemos configurar complementos en Obsidian que envían fragmentos de notas para realizar tareas de resumen, corrección de estilo o búsqueda de contradicciones lógicas sin que ningún dato sensible salga de tu infraestructura física privada. 💻",
    "El procesamiento de notas extensas requiere una estrategia de recuperación de información eficiente para no saturar el límite de tokens del modelo. La implementación de la técnica de generación aumentada por recuperación conocida como RAG es indispensable en vaults de gran tamaño. Este flujo convierte las notas de texto en vectores numéricos utilizando un modelo de embedding local.\n\nAl formular una consulta el sistema busca los fragmentos con mayor similitud semántica y los inyecta en el prompt del modelo de lenguaje. Esto permite que el agente responda basándose en miles de notas históricas sin necesidad de enviarlas todas a la vez. 🗂️",
    "La automatización avanzada de la base de conocimientos se alcanza al integrar agentes autónomos que no solo leen sino que escriben y estructuran el vault. Utilizando marcos de desarrollo como LlamaIndex o LangChain creamos scripts en Python que monitorean la carpeta de entrada de Obsidian.\n\nCuando un agente detecta un nuevo archivo realiza tareas de limpieza de formato, extrae las entidades clave mediante etiquetado automático y genera enlaces semánticos hacia notas preexistentes en la base de datos. De este modo la estructura del grafo de conocimiento crece y se depura constantemente sin intervención humana directa. ⚙️",
    "Una aplicación práctica y de alto valor consiste en utilizar los agentes autónomos para auditar la consistencia de tu propio pensamiento. Al dar acceso a un modelo avanzado a todo el historial de decisiones y errores registrados el sistema puede ejecutar análisis transversales.\n\nPodemos solicitarle que detecte contradicciones lógicas entre tus planes pasados y tus acciones presentes o que identifique patrones repetitivos de fallos en tus proyectos. Esta revisión automatizada proporciona un nivel de autoconocimiento técnico y estratégico que resulta imposible de alcanzar con métodos tradicionales. 🧠",
    "El flujo de trabajo semanal propuesto para mantener la base de conocimientos optimizada exige una rutina ordenada y libre de fricciones. El primer paso consiste en vaciar todas las capturas rápidas del teléfono o navegador en la bandeja de entrada. Luego el agente clasifica estos elementos en las carpetas correspondientes de ideas, proyectos o investigación.\n\nEl tercer paso implica ejecutar el script de vectorización para actualizar la base de datos semántica. Finalmente se corre una sesión de consulta con el modelo para que sugiera nuevas conexiones entre notas recientes y registros antiguos del sistema. 📅",
    "Para implementar esta arquitectura de forma sólida es recomendable adoptar un formato estructurado y uniforme en la cabecera de cada nota utilizando metadatos en formato YAML. Al definir variables como la fecha de creación, las etiquetas de clasificación técnica, el estado del proyecto y las relaciones principales facilitamos el análisis por parte de los agentes.\n\nLos scripts de Python pueden parsear estos bloques de metadatos de forma veloz para filtrar notas específicas antes de enviarlas al modelo de lenguaje, reduciendo drásticamente el consumo de tokens y acelerando el tiempo de respuesta del sistema. 📑",
    "El verdadero valor de la memoria como ventaja competitiva se hace evidente al iniciar nuevos proyectos de desarrollo de software o creación de contenido. En lugar de comenzar desde cero con un lienzo en blanco solicitamos al agente que recopile toda la investigación, las herramientas y los flujos de trabajo previamente validados en el vault.\n\nEl modelo genera un plan detallado de ejecución que respeta tus pautas históricas y aprovecha tus propios recursos técnicos. Esto reduce significativamente la fatiga de decisión y optimiza la asignación de tu tiempo hacia tareas creativas y de alto impacto. 🚀",
    "Los modelos de lenguaje locales como Llama o Mistral demuestran un rendimiento excelente en tareas de estructuración interna del vault. Al correr estos modelos en servidores domésticos evitamos los costos de suscripción recurrentes y los riesgos de filtración de datos corporativos.\n\nLa implementación de una base de datos vectorial local como Chroma o FAISS permite gestionar la indexación semántica de forma gratuita y eficiente. Al combinar estas herramientas creamos un entorno de desarrollo seguro que funciona de manera autónoma incluso sin conexión a la red, garantizando soberanía operativa absoluta. 🌐",
    "Al escalar el sistema a equipos de trabajo la base de conocimientos se convierte en un centro de operaciones inteligente compartido. Los agentes pueden analizar las notas de múltiples integrantes para identificar duplicidades en la investigación o sugerir colaboraciones automáticas al detectar intereses comunes en el grafo.\n\nEsta inteligencia colectiva distribuida acelera los procesos de innovación y asegura que el aprendizaje organizacional permanezca y se multiplique dentro de la empresa, evitando la pérdida de conocimiento crítico cuando un miembro del equipo se retira de la organización. 👥",
    "La integración de Obsidian con agentes autónomos y modelos de lenguaje redefine la relación entre el ser humano y el software. Dejamos de ser simples almacenadores de datos para convertirnos en directores de sistemas inteligentes que operan bajo nuestro propio criterio y memoria acumulada.\n\nAdoptar estas tecnologías no es una cuestión de moda sino una decisión estratégica para potenciar nuestra soberanía intelectual y operativa en la era digital. Te invitamos a dar el paso técnico y construir una infraestructura de conocimiento que crezca y trabaje a tu servicio de forma ininterrumpida. 🔚"
];

// Distribución de imágenes relacionadas de otras carpetas
const POST_MEDIA = {
    0: [
        path.join(__dirname, 'downloaded_media_5', 'media_1.jpg'),
        path.join(__dirname, 'downloaded_media_5', 'media_2.jpg'),
        path.join(__dirname, 'downloaded_media_5', 'media_3.jpg'),
        path.join(__dirname, 'downloaded_media_5', 'media_4.jpg')
    ],
    1: [
        path.join(__dirname, 'downloaded_media_2', 'media_1.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_2.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_3.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_4.jpg')
    ],
    2: [
        path.join(__dirname, 'downloaded_media_4', 'media_1.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_2.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_3.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_4.png')
    ],
    3: [
        path.join(__dirname, 'downloaded_media_4', 'media_5.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_6.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_7.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_8.jpg')
    ],
    4: [
        path.join(__dirname, 'downloaded_media_4', 'media_9.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_10.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_11.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_12.jpg')
    ]
};

const DELAY_MS = 8000;

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Publicador Live del Hilo Obsidian AI Second Brain");
        console.log(`Mensajes a publicar: ${HILO_POSTS.length}`);
        console.log("==================================================\n");

        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de X en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

        console.log("Iniciando navegador paralelo (Modo Sigilo Anti-Bot)...");
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: headless,
            userDataDir: path.join(__dirname, 'browser_profile'),
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
                '--window-size=1280,800',
                '--disable-notifications',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-infobars'
            ]
        });

        const pages = await browser.pages();
        let xPage = pages.length > 0 ? pages[0] : await browser.newPage();
        
        await xPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await xPage.setViewport({ width: 1280, height: 800 });

        // Intercept network response to capture created Tweet ID
        let interceptedTweetId = null;
        xPage.on('response', async response => {
            try {
                const url = response.url();
                if ((url.includes('CreateTweet') || url.includes('create_tweet')) && response.request().method() === 'POST') {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    const createTweetData = json?.data?.create_tweet;
                    if (createTweetData) {
                        const findRestId = (obj) => {
                            if (!obj || typeof obj !== 'object') return null;
                            if (obj.rest_id) return obj.rest_id;
                            for (const key in obj) {
                                const res = findRestId(obj[key]);
                                if (res) return res;
                            }
                            return null;
                        };
                        const restId = findRestId(createTweetData);
                        if (restId) {
                            interceptedTweetId = restId;
                            console.log(`[Red] ✅ Identificador de publicación interceptado: ${interceptedTweetId}`);
                        }
                    }
                }
            } catch (e) {
                console.error("[Red] Error al interceptar respuesta:", e.message);
            }
        });

        // Navigate and wait for login session
        console.log("Navegando a X.com...");
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Esperando inicio de sesión...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("✅ Sesión detectada activa");
        await new Promise(r => setTimeout(r, 3000));

        // Get own username robustly
        let ownUsername = 'NeoDominusBabel';
        try {
            await new Promise(r => setTimeout(r, 2000));
            const detectedUname = await xPage.evaluate(() => {
                const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]') || 
                           document.querySelector('[data-testid="AppTabBar_Profile_Link"]') ||
                           document.querySelector('a[aria-label="Profile"]') ||
                           document.querySelector('a[aria-label="Perfil"]');
                if (el) {
                    const href = el.getAttribute('href');
                    if (href) return href.replace('/', '');
                }
                const handleEl = document.querySelector('[data-testid="UserAvatar-Container-profile"]');
                if (handleEl) {
                    const parentLink = handleEl.closest('a');
                    if (parentLink) {
                        const href = parentLink.getAttribute('href');
                        if (href) return href.replace('/', '');
                    }
                }
                const elements = Array.from(document.querySelectorAll('*'));
                for (const el of elements) {
                    if (el.children.length === 0 && el.innerText && el.innerText.startsWith('@')) {
                        const handle = el.innerText.replace('@', '').trim();
                        if (handle.length > 0 && handle.length < 30) return handle;
                    }
                }
                return null;
            });
            if (detectedUname) ownUsername = detectedUname;
        } catch (e) {
            console.log("No se pudo obtener el nombre de usuario de forma dinámica. Se usará el valor predeterminado.");
        }
        console.log(`Nombre de usuario detectado: @${ownUsername}\n`);

        const getLatestTweetUrl = async (page, uname) => {
            try {
                console.log(`[Búsqueda] Navegando al perfil: https://x.com/${uname}/with_replies`);
                await page.goto(`https://x.com/${uname}/with_replies`, { waitUntil: 'domcontentloaded' });
                await new Promise(r => setTimeout(r, 5000));
                return await page.evaluate((un) => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const statusLinks = links
                         .map(l => l.href)
                         .filter(href => href && href.includes(`/${un}/status/`));
                    
                    if (statusLinks.length === 0) return null;
                    
                    statusLinks.sort((a, b) => {
                        const idA = a.split('/status/')[1].split('?')[0].split('/')[0];
                        const idB = b.split('/status/')[1].split('?')[0].split('/')[0];
                        try {
                            const diff = BigInt(idB) - BigInt(idA);
                            return diff > 0n ? 1 : (diff < 0n ? -1 : 0);
                        } catch (e) {
                            return 0;
                        }
                    });
                    
                    return statusLinks[0];
                }, uname);
            } catch (err) {
                console.error("[Búsqueda] Error al buscar publicación en perfil:", err.message);
                return null;
            }
        };

        let parentTweetUrl = null;

        // Loop HILO_POSTS
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const postText = HILO_POSTS[i];
            const postNum = i + 1;
            const mediaFiles = POST_MEDIA[i] || [];

            if (i > 0) {
                console.log(`\n⏳ Esperando ${DELAY_MS / 1000} segundos antes del post ${postNum}/${HILO_POSTS.length}...`);
                await new Promise(r => setTimeout(r, DELAY_MS));
            }

            console.log(`\n--------------------------------------------------`);
            console.log(`📝 Publicando mensaje ${postNum}/${HILO_POSTS.length} en vivo`);
            console.log(`--------------------------------------------------`);

            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;

                    if (postNum === 1) {
                        // First post to home
                        console.log("Navegando al inicio para publicar el primer mensaje...");
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 3000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const textArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!textArea) throw new Error("Caja de texto no encontrada en inicio");

                        await textArea.click();
                        await new Promise(r => setTimeout(r, 800));
                        await xPage.evaluate(el => el.focus(), textArea);

                        // Upload Media
                        if (mediaFiles.length > 0) {
                            console.log(`[Media] Subiendo ${mediaFiles.length} imágenes...`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                const validFiles = mediaFiles.filter(f => fs.existsSync(f));
                                if (validFiles.length > 0) {
                                    await fileInputs[0].uploadFile(...validFiles);
                                    console.log("[Media] Imágenes cargadas en input");
                                }
                            }
                        }

                        // Type text
                        await xPage.keyboard.down('Control');
                        await xPage.keyboard.press('A');
                        await xPage.keyboard.up('Control');
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 800));

                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.type(postText, { delay: 10 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Wait for publish button to be ready
                        console.log("[Media] Esperando que el botón de publicación esté habilitado (máximo 60 segundos)...");
                        let buttonReady = false;
                        for (let check = 0; check < 60; check++) {
                            buttonReady = await xPage.evaluate(() => {
                                const btn = document.querySelector('[data-testid="tweetButtonInline"]') || document.querySelector('[data-testid="tweetButton"]');
                                return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
                            });
                            if (buttonReady) break;
                            await new Promise(r => setTimeout(r, 1000));
                        }
                        if (!buttonReady) throw new Error("El botón de publicación permaneció deshabilitado");

                        // Click Publish Button
                        console.log("[Componer] Enviando tweet...");
                        const postClicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled && inlineBtn.getAttribute('aria-disabled') !== 'true') {
                                inlineBtn.click(); return 'ok';
                            }
                            const mainBtn = document.querySelector('[data-testid="tweetButton"]');
                            if (mainBtn && !mainBtn.disabled && mainBtn.getAttribute('aria-disabled') !== 'true') {
                                mainBtn.click(); return 'ok';
                            }
                            return 'fail';
                        });

                        if (postClicked === 'fail') throw new Error("Botón de publicación no encontrado");
                        console.log("[Componer] Publicación enviada, obteniendo ID...");

                        await new Promise(r => setTimeout(r, 5000));

                        let newUrl = null;
                        const start = Date.now();
                        while (Date.now() - start < 15000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/i/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en el perfil del usuario...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener el ID del mensaje principal");
                        parentTweetUrl = newUrl;
                        console.log(`🎯 Mensaje principal publicado en: ${parentTweetUrl}`);
                        success = true;
                    } else {
                        // Subsequent replies
                        console.log(`Respondiendo a publicación previa: ${parentTweetUrl}`);
                        await xPage.goto(parentTweetUrl, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!replyArea) throw new Error("Caja de respuesta no encontrada");

                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 600));
                        await xPage.evaluate(el => el.focus(), replyArea);

                        // Upload Media for reply
                        if (mediaFiles.length > 0) {
                            console.log(`[Media] Subiendo ${mediaFiles.length} imágenes para la respuesta...`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                const validFiles = mediaFiles.filter(f => fs.existsSync(f));
                                if (validFiles.length > 0) {
                                    await fileInputs[0].uploadFile(...validFiles);
                                    console.log("[Media] Imágenes de respuesta cargadas en input");
                                }
                            }
                        }

                        await xPage.keyboard.type(postText, { delay: 10 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Wait for reply button to be ready
                        console.log("[Media] Esperando que el botón de respuesta esté habilitado (máximo 60 segundos)...");
                        let buttonReady = false;
                        for (let check = 0; check < 60; check++) {
                            buttonReady = await xPage.evaluate(() => {
                                const btn = document.querySelector('[data-testid="tweetButtonInline"]') || 
                                           document.querySelector('[data-testid="tweetButton"]') ||
                                           document.querySelector('[role="button"][data-testid*="reply"]');
                                return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
                            });
                            if (buttonReady) break;
                            await new Promise(r => setTimeout(r, 1000));
                        }

                        const replyClicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled && inlineBtn.getAttribute('aria-disabled') !== 'true') {
                                inlineBtn.click(); return 'ok';
                            }
                            const all = Array.from(document.querySelectorAll('[role="button"]'));
                            for (const b of all) {
                                const t = (b.innerText || '').trim().toLowerCase();
                                const tid = (b.getAttribute('data-testid') || '').toLowerCase();
                                if ((tid.includes('tweetbutton') || t === 'reply' || t === 'responder' || t === 'post' || t === 'publicar') && !b.disabled && b.getAttribute('aria-disabled') !== 'true') {
                                    b.click(); return 'ok';
                                }
                            }
                            return 'fail';
                        });

                        if (replyClicked === 'fail') throw new Error("Botón de respuesta no encontrado");
                        console.log("[Componer] Respuesta enviada, obteniendo ID...");

                        await new Promise(r => setTimeout(r, 5000));

                        let newUrl = null;
                        const start = Date.now();
                        while (Date.now() - start < 15000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/i/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en el perfil del usuario...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener el ID del mensaje de respuesta");
                        parentTweetUrl = newUrl;
                        console.log(`🎯 Mensaje ${postNum} publicado en: ${parentTweetUrl}`);
                        success = true;
                    }
                } catch (err) {
                    retries++;
                    console.error(`❌ Error en publicación ${postNum}, intento ${retries}: ${err.message}`);
                    try {
                        await xPage.keyboard.press('Escape');
                        await new Promise(r => setTimeout(r, 1000));
                        await xPage.keyboard.press('Escape');
                    } catch (e) {}
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (!success) {
                console.error(`💀 Fallo definitivo en publicación ${postNum}. Deteniendo.`);
                process.exit(1);
            }
        }

        console.log("\n==================================================");
        console.log(`🎉 HILO PUBLICADO CON EXITO LIVE: ${HILO_POSTS.length}/${HILO_POSTS.length} posts`);
        console.log("==================================================");
        await browser.close();
    } catch (err) {
        console.error("💀 Fallo crítico:", err);
        process.exit(1);
    }
})();
