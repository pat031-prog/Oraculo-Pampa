/**
 * Portable Configuration for Oráculo Pampa
 * Multi-API version supporting multiple AI providers
 */

window.PortableConfig = {
    // Storage keys for localStorage
    LEGACY_STORAGE_KEY: 'oraculo_pampa_api_key', // For backwards compatibility
    MULTI_API_STORAGE_KEY: 'oraculo_pampa_api_configs',

    /**
     * Get the legacy API key (Gemini) - for backwards compatibility
     * @returns {string} The API key
     */
    getApiKey: function() {
        // First check if multi-API configs exist
        const configs = this.getApiConfigs();
        if (configs.length > 0) {
            // Return first Gemini config
            const geminiConfig = configs.find(c => c.provider === 'gemini');
            if (geminiConfig) return geminiConfig.apiKey;
            // Fallback to first config
            return configs[0].apiKey;
        }

        // Try legacy storage
        let apiKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);

        // If not found, prompt the user
        if (!apiKey || apiKey === 'NO_API_KEY_CONFIGURED') {
            this.showConfigWizard();
            apiKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);
        }

        return apiKey || 'NO_API_KEY_CONFIGURED';
    },

    /**
     * Get all API configurations
     * @returns {Array} Array of API config objects
     */
    getApiConfigs: function() {
        try {
            const stored = localStorage.getItem(this.MULTI_API_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }

            // Check for legacy key and migrate
            const legacyKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);
            if (legacyKey && legacyKey !== 'NO_API_KEY_CONFIGURED') {
                const configs = [{
                    provider: 'gemini',
                    apiKey: legacyKey,
                    model: 'gemini-2.0-flash-exp'
                }];
                this.saveApiConfigs(configs);
                return configs;
            }

            return [];
        } catch (e) {
            console.error('Failed to get API configs:', e);
            return [];
        }
    },

    /**
     * Save API configurations
     * @param {Array} configs - Array of API config objects
     */
    saveApiConfigs: function(configs) {
        try {
            localStorage.setItem(this.MULTI_API_STORAGE_KEY, JSON.stringify(configs));
            console.log('✓ API configurations saved');
        } catch (e) {
            console.error('Failed to save API configs:', e);
        }
    },

    /**
     * Add a new API configuration
     * @param {string} provider - Provider name (gemini, groq, deepinfra, openai, anthropic, custom)
     * @param {string} apiKey - API key
     * @param {string} model - Model name (optional)
     * @param {string} baseUrl - Base URL for custom provider (optional)
     */
    addApiConfig: function(provider, apiKey, model, baseUrl) {
        const configs = this.getApiConfigs();

        const newConfig = {
            provider: provider,
            apiKey: apiKey
        };

        if (model) newConfig.model = model;
        if (baseUrl) newConfig.baseUrl = baseUrl;

        // Check if provider already exists
        const existingIndex = configs.findIndex(c => c.provider === provider);
        if (existingIndex >= 0) {
            configs[existingIndex] = newConfig;
        } else {
            configs.push(newConfig);
        }

        this.saveApiConfigs(configs);
        return configs;
    },

    /**
     * Remove an API configuration
     * @param {string} provider - Provider name to remove
     */
    removeApiConfig: function(provider) {
        const configs = this.getApiConfigs();
        const filtered = configs.filter(c => c.provider !== provider);
        this.saveApiConfigs(filtered);
        return filtered;
    },

    /**
     * Show configuration wizard
     */
    showConfigWizard: function() {
        const message =
            '🔑 Configuración de API Multi-Proveedor\n\n' +
            'Oráculo Pampa soporta múltiples proveedores de IA:\n\n' +
            '1. Google Gemini (https://aistudio.google.com/apikey)\n' +
            '2. Groq (https://console.groq.com/keys)\n' +
            '3. DeepInfra (https://deepinfra.com/dash/api_keys)\n' +
            '4. OpenAI (https://platform.openai.com/api-keys)\n' +
            '5. Anthropic Claude (https://console.anthropic.com/)\n\n' +
            'Para empezar rápido, configura Gemini (GRATIS):\n' +
            'Ve a https://aistudio.google.com/apikey\n\n' +
            'Luego usa configureApis() en la consola para más opciones.';

        alert(message);

        const quickSetup = confirm('¿Quieres configurar Gemini ahora?');
        if (quickSetup) {
            const apiKey = prompt('Ingresa tu API key de Google Gemini:');
            if (apiKey && apiKey.trim()) {
                this.addApiConfig('gemini', apiKey.trim(), 'gemini-2.0-flash-exp');
                // Also save to legacy for backwards compatibility
                localStorage.setItem(this.LEGACY_STORAGE_KEY, apiKey.trim());
                alert('✓ Gemini configurado correctamente!');
            }
        }
    },

    /**
     * Interactive configuration tool
     */
    configureApis: function() {
        const configs = this.getApiConfigs();

        console.log('\n📋 Configuraciones actuales:');
        if (configs.length === 0) {
            console.log('   (ninguna configurada)');
        } else {
            configs.forEach((c, i) => {
                console.log(`   ${i + 1}. ${c.provider} - ${c.model || 'default model'}`);
            });
        }

        console.log('\n💡 Comandos disponibles:');
        console.log('   addGemini("YOUR_API_KEY")');
        console.log('   addGroq("YOUR_API_KEY")');
        console.log('   addDeepInfra("YOUR_API_KEY")');
        console.log('   addOpenAI("YOUR_API_KEY")');
        console.log('   addAnthropic("YOUR_API_KEY")');
        console.log('   removeApi("provider_name")');
        console.log('   clearAllApis()');
        console.log('\n');

        const action = prompt(
            'Opciones:\n\n' +
            '1. Agregar Gemini\n' +
            '2. Agregar Groq\n' +
            '3. Agregar DeepInfra\n' +
            '4. Agregar OpenAI\n' +
            '5. Agregar Anthropic\n' +
            '6. Ver configuración actual\n' +
            '7. Limpiar todo\n\n' +
            'Elige una opción (1-7):'
        );

        switch(action) {
            case '1': {
                const key = prompt('API Key de Gemini:');
                if (key) this.addApiConfig('gemini', key, 'gemini-2.0-flash-exp');
                break;
            }
            case '2': {
                const key = prompt('API Key de Groq:');
                if (key) this.addApiConfig('groq', key, 'llama-3.3-70b-versatile');
                break;
            }
            case '3': {
                const key = prompt('API Key de DeepInfra:');
                if (key) this.addApiConfig('deepinfra', key, 'meta-llama/Llama-3.3-70B-Instruct');
                break;
            }
            case '4': {
                const key = prompt('API Key de OpenAI:');
                if (key) this.addApiConfig('openai', key, 'gpt-4o-mini');
                break;
            }
            case '5': {
                const key = prompt('API Key de Anthropic:');
                if (key) this.addApiConfig('anthropic', key, 'claude-3-5-sonnet-20241022');
                break;
            }
            case '6': {
                console.table(configs);
                break;
            }
            case '7': {
                if (confirm('¿Seguro que quieres eliminar TODAS las configuraciones?')) {
                    this.clearAllApis();
                }
                break;
            }
        }
    },

    /**
     * Clear all API configurations
     */
    clearAllApis: function() {
        localStorage.removeItem(this.MULTI_API_STORAGE_KEY);
        localStorage.removeItem(this.LEGACY_STORAGE_KEY);
        console.log('✓ Todas las API keys eliminadas');
    },

    /**
     * Legacy: Clear the stored API key
     */
    clearApiKey: function() {
        this.clearAllApis();
    },

    /**
     * Legacy: Update the API key
     */
    updateApiKey: function() {
        this.configureApis();
    }
};

// Expose convenient functions to window
window.configureApis = function() {
    window.PortableConfig.configureApis();
};

window.addGemini = function(apiKey, model) {
    return window.PortableConfig.addApiConfig('gemini', apiKey, model || 'gemini-2.0-flash-exp');
};

window.addGroq = function(apiKey, model) {
    return window.PortableConfig.addApiConfig('groq', apiKey, model || 'llama-3.3-70b-versatile');
};

window.addDeepInfra = function(apiKey, model) {
    return window.PortableConfig.addApiConfig('deepinfra', apiKey, model || 'meta-llama/Llama-3.3-70B-Instruct');
};

window.addOpenAI = function(apiKey, model) {
    return window.PortableConfig.addApiConfig('openai', apiKey, model || 'gpt-4o-mini');
};

window.addAnthropic = function(apiKey, model) {
    return window.PortableConfig.addApiConfig('anthropic', apiKey, model || 'claude-3-5-sonnet-20241022');
};

window.removeApi = function(provider) {
    return window.PortableConfig.removeApiConfig(provider);
};

window.clearAllApis = function() {
    if (confirm('¿Eliminar todas las configuraciones de API?')) {
        window.PortableConfig.clearAllApis();
        alert('Configuraciones eliminadas. Recarga la página.');
    }
};

// Legacy aliases
window.updateApiKey = window.configureApis;
window.clearApiKey = window.clearAllApis;

console.log('📦 Oráculo Pampa - Modo Multi-API Portable');
console.log('💡 Comandos disponibles:');
console.log('   - configureApis()           : Configurar proveedores de IA');
console.log('   - addGemini("key")          : Agregar Gemini');
console.log('   - addGroq("key")            : Agregar Groq');
console.log('   - addDeepInfra("key")       : Agregar DeepInfra');
console.log('   - addOpenAI("key")          : Agregar OpenAI');
console.log('   - addAnthropic("key")       : Agregar Anthropic');
console.log('   - removeApi("provider")     : Eliminar un proveedor');
console.log('   - clearAllApis()            : Eliminar todas las configuraciones');
console.log('');
