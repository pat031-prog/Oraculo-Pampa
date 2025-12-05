/**
 * Simple Cache Service
 *
 * Almacena resultados de análisis en localStorage para evitar
 * regenerarlos cada vez que se cambia de sección.
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresIn: number; // milliseconds
}

export class CacheService {
    private readonly prefix = 'oraculo_cache_';

    /**
     * Store data in cache with expiration time
     */
    set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                expiresIn
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(entry));
        } catch (error) {
            console.warn('Cache write failed:', error);
        }
    }

    /**
     * Get data from cache if not expired
     */
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;

            const entry: CacheEntry<T> = JSON.parse(item);
            const now = Date.now();

            // Check if expired
            if (now - entry.timestamp > entry.expiresIn) {
                this.delete(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.warn('Cache read failed:', error);
            return null;
        }
    }

    /**
     * Delete specific cache entry
     */
    delete(key: string): void {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.warn('Cache delete failed:', error);
        }
    }

    /**
     * Clear all cache entries for this app
     */
    clear(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }

    /**
     * Check if cache has valid entry for key
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Get cache statistics
     */
    getStats(): { total: number; size: number } {
        try {
            const keys = Object.keys(localStorage);
            const cacheKeys = keys.filter(key => key.startsWith(this.prefix));

            let totalSize = 0;
            cacheKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) {
                    totalSize += value.length;
                }
            });

            return {
                total: cacheKeys.length,
                size: totalSize
            };
        } catch (error) {
            return { total: 0, size: 0 };
        }
    }
}

// Singleton instance
export const cacheService = new CacheService();
