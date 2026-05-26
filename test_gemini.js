const apiKey = "AIzaSyC7-9S0o3rVoZtshAl57eMV-LhJx4_Sgxg";

function parseGemmaOutput(text) {
    // Attempt 1: Standard JSON parse
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.respuesta_coherente || parsed.curated_reply) {
                return {
                    analisis: parsed.analisis_curado || parsed.curation_analysis || "Exitoso",
                    reply: parsed.respuesta_coherente || parsed.curated_reply
                };
            }
        }
    } catch (e) {}

    // Attempt 2: Regex extraction of keys with optional quotes/backticks/asterisks
    const replyRegex = /(?:"|`|'|\*)(?:respuesta_coherente|curated_reply)(?:"|`|'|\*)\s*:\s*["'`]([^"'`]+)["'`]/i;
    const analysisRegex = /(?:"|`|'|\*)(?:analisis_curado|curation_analysis)(?:"|`|'|\*)\s*:\s*["'`]([^"'`]+)["'`]/i;
    
    const replyMatch = text.match(replyRegex);
    const analysisMatch = text.match(analysisRegex);
    
    if (replyMatch) {
        return {
            analisis: analysisMatch ? analysisMatch[1] : "Exitoso",
            reply: replyMatch[1]
        };
    }
    
    // Attempt 3: Bullet points or label-based matches
    const bulletReplyRegex = /(?:respuesta_coherente|curated_reply|Respuesta Curada Generada)\s*:\s*([^\n]+)/i;
    const bulletAnalysisRegex = /(?:analisis_curado|curation_analysis|Análisis de Coherencia)\s*:\s*([^\n]+)/i;
    
    const bulletReplyMatch = text.match(bulletReplyRegex);
    const bulletAnalysisMatch = text.match(bulletAnalysisRegex);
    
    if (bulletReplyMatch) {
        let reply = bulletReplyMatch[1].trim().replace(/^[`"'*]+|[`"'*]+$/g, '');
        let analisis = bulletAnalysisMatch ? bulletAnalysisMatch[1].trim().replace(/^[`"'*]+|[`"'*]+$/g, '') : "Exitoso";
        return { analisis, reply };
    }
    
    throw new Error("Could not extract reply or analysis from model output");
}

async function testGenerateReply(tweetText, isAcademic, modelName) {
    const prompt = `Analiza detenidamente el siguiente mensaje de referencia (Tweet) para responder de forma sumamente coherente, estilosa y con sentido, evitando respuestas disonantes o genéricas.

Mensaje de referencia (Tweet): ${tweetText}

${isAcademic ? 
`CONTEXTO DE RESPUESTA: Filosofía e Inteligencia Artificial.
Debes actuar como un filósofo e investigador académico sumamente técnico, irreverente y recalcitrante. Tu postura es de debate intelectual profundo y confrontativo, pero sumamente técnico e inteligente.` 
: 
`CONTEXTO DE RESPUESTA: Política Colombiana.
Debes actuar como un analista de opinión política de derecha, muy ácido, sarcástico e irreverente hacia el populismo e ideas de izquierda ("zurdos"). Debes apoyar ideas de derecha y propiedad privada, e incluir un apoyo sumamente sutil o soterrado a la senadora Paloma Valencia (por ejemplo usando términos como "la senadora caucana", "la firmeza de Paloma" o "el liderazgo de la senadora Paloma") pero de forma totalmente orgánica y contextualizada.`
}

REGLAS DE FORMATO Y ESTILO (ESTRICTAS):
1. La respuesta final NO debe contener NINGUNA comilla (ni simples ni dobles, ni curly ni rectas como " o ' o « o »).
2. La respuesta final NO debe contener dos puntos (:).
3. Habla en primera persona del singular ("yo", "mi", "opino", "considero").
4. Escribe en español impecable, natural, fluido y libre de anglicismos innecesarios (por ejemplo, nunca uses palabras como "tweet", "post", "schedule", etc.; en su lugar usa "mensaje", "publicación", "hilo", "programación").
5. La longitud máxima de la respuesta final es de 240 caracteres.
6. La respuesta debe tener sentido directo y coherencia con respecto al mensaje de referencia, aportando valor al debate o la crítica de manera específica, no con una frase prefabricada o disonante.

FASE DE CURADO:
Analiza detenidamente cómo proyectar el contenido para que guarde perfecta coherencia, estilo y sentido con el mensaje de referencia.
Devuelve el resultado en formato JSON con la siguiente estructura exacta:
{
  "analisis_curado": "Tu análisis de curado previo explicando cómo proyectar la respuesta de forma coherente con el mensaje de referencia",
  "respuesta_coherente": "El texto final de la respuesta curada, cumpliendo todas las reglas y restricciones de estilo y caracteres"
}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.7
                }
            })
        });
        
        console.log(`Status [Model=${modelName}, Academic=${isAcademic}]:`, response.status);
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const rawText = data.candidates[0].content.parts[0].text.trim();
            console.log("Raw output length:", rawText.length);
            console.log("--- RAW GEMMA OUTPUT ---");
            console.log(rawText);
            console.log("------------------------");
            const parsed = parseGemmaOutput(rawText);
            console.log("\n[PARSED CURATION RESULTS]");
            console.log("Analysis:", parsed.analisis);
            console.log("Reply:", parsed.reply);
            return parsed.reply;
        } else {
            console.log("No content in response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Error calling Gemini API:", e.message);
    }
}

(async () => {
    console.log("--- TESTING GEMMA 4 31B WITH ROBUST PARSER ---");
    await testGenerateReply("El gobierno nacional anuncia un nuevo subsidio universal para todos los jóvenes desempleados financiados por una reforma tributaria.", false, "gemma-4-31b-it");
})();
