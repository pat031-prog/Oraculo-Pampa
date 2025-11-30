/**
 * Portable Configuration for Oráculo Pampa
 * This file handles API key configuration for the portable version
 */

window.PortableConfig = {
    // Storage key for localStorage
    STORAGE_KEY: 'oraculo_pampa_api_key',

    /**
     * Get the API key from localStorage or prompt the user
     * @returns {string} The API key
     */
    getApiKey: function() {
        // Try to get from localStorage first
        let apiKey = localStorage.getItem(this.STORAGE_KEY);

        // If not found, prompt the user
        if (!apiKey || apiKey === 'NO_API_KEY_CONFIGURED') {
            apiKey = this.promptForApiKey();
        }

        return apiKey || 'NO_API_KEY_CONFIGURED';
    },

    /**
     * Prompt the user to enter their API key
     * @returns {string|null} The API key or null if cancelled
     */
    promptForApiKey: function() {
        const message =
            '🔑 Configuración de API Key de Google Gemini\n\n' +
            'Para usar Oráculo Pampa, necesitas una API key de Google Gemini.\n\n' +
            'Pasos:\n' +
            '1. Ve a https://aistudio.google.com/apikey\n' +
            '2. Crea una nueva API key (o usa una existente)\n' +
            '3. Copia la key y pégala abajo\n\n' +
            'La key se guardará en tu navegador para futuras sesiones.';

        const apiKey = prompt(message);

        if (apiKey && apiKey.trim() !== '') {
            this.saveApiKey(apiKey.trim());
            return apiKey.trim();
        }

        return null;
    },

    /**
     * Save the API key to localStorage
     * @param {string} apiKey - The API key to save
     */
    saveApiKey: function(apiKey) {
        localStorage.setItem(this.STORAGE_KEY, apiKey);
        console.log('✓ API key guardada en localStorage');
    },

    /**
     * Clear the stored API key
     */
    clearApiKey: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('✓ API key eliminada');
    },

    /**
     * Update the API key (prompts for a new one)
     */
    updateApiKey: function() {
        this.clearApiKey();
        const newKey = this.promptForApiKey();
        if (newKey) {
            alert('✓ API key actualizada correctamente. Recarga la página para que los cambios surtan efecto.');
        }
    }
};

// Expose functions to window for easy console access
window.updateApiKey = function() {
    window.PortableConfig.updateApiKey();
};

window.clearApiKey = function() {
    window.PortableConfig.clearApiKey();
    alert('API key eliminada. Recarga la página.');
};

console.log('📦 Oráculo Pampa - Modo Portable');
console.log('💡 Comandos disponibles:');
console.log('   - updateApiKey()  : Actualizar API key');
console.log('   - clearApiKey()   : Eliminar API key guardada');
