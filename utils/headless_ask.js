const readline = require('readline');

/**
 * Pregunta al usuario de manera interactiva si desea iniciar el navegador
 * de forma invisible (headless) o mostrando la interfaz gráfica para auditar el proceso.
 * 
 * @param {string} [customPrompt] - Mensaje personalizado para el prompt
 * @returns {Promise<boolean>} - Promesa que resuelve a true para headless y false para mostrar navegador
 */
function askHeadlessMode(customPrompt) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Mensaje descriptivo indicando que el modo visible permite la auditoría del proceso
        const promptText = customPrompt || "¿Desea ejecutar el navegador de forma invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ";
        
        rl.question(promptText, (answer) => {
            rl.close();
            const lower = answer.trim().toLowerCase();
            // Si el usuario responde 's', 'si', 'y' o 'yes', se ejecuta headless.
            // Cualquier otra opción o Enter por defecto será 'n' (mostrar el navegador).
            resolve(lower === 's' || lower === 'si' || lower === 'y' || lower === 'yes');
        });
    });
}

/**
 * Obtiene la opción de visualización del navegador comprobando argumentos de CLI o
 * preguntando al usuario interactivamente.
 * 
 * @param {string} [customPrompt] - Mensaje personalizado para el prompt
 * @returns {Promise<boolean>}
 */
async function getHeadlessOption(customPrompt) {
    if (process.argv.includes('--headless')) {
        return true;
    } else if (process.argv.includes('--headful')) {
        return false;
    } else {
        return await askHeadlessMode(customPrompt);
    }
}

module.exports = { getHeadlessOption };
