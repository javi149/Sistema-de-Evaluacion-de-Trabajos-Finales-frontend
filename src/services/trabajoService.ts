import { AppConfig } from '../config/AppConfig';
import { Trabajo, CreateTrabajoDto, UpdateTrabajoDto } from '../types';

// Re-exportar los tipos para que estén disponibles desde este módulo
export type { CreateTrabajoDto, UpdateTrabajoDto };

const config = AppConfig.getInstance();

/**
 * Clase de servicio para manejar todas las operaciones CRUD de trabajos
 */
export class TrabajoService {
    private baseUrl: string;
    private endpoint: string;

    constructor() {
        // Obtener URL base y normalizar (eliminar barra final si existe)
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
        this.endpoint = `${this.baseUrl}/trabajos/`;
    }

    /**
     * Obtiene todos los trabajos
     * @returns Promise con array de trabajos
     */
    async getAll(): Promise<Trabajo[]> {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error(`Error al obtener trabajos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene un trabajo por su ID
     * @param id - ID del trabajo
     * @returns Promise con el trabajo encontrado
     */
    async getById(id: number): Promise<Trabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Trabajo no encontrado');
                }
                throw new Error(`Error al obtener trabajo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo trabajo
     * @param trabajoData - Datos del trabajo a crear
     * @returns Promise con el trabajo creado
     */
    async create(trabajoData: CreateTrabajoDto): Promise<Trabajo> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trabajoData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al crear trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    /**
     * Actualiza un trabajo existente (PUT - actualización completa)
     * @param id - ID del trabajo a actualizar
     * @param trabajoData - Datos del trabajo a actualizar
     * @returns Promise con el trabajo actualizado
     */
    async update(id: number, trabajoData: UpdateTrabajoDto): Promise<Trabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trabajoData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Trabajo no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Actualiza parcialmente un trabajo existente (PATCH)
     * @param id - ID del trabajo a actualizar
     * @param trabajoData - Datos parciales del trabajo a actualizar
     * @returns Promise con el trabajo actualizado
     */
    async partialUpdate(id: number, trabajoData: UpdateTrabajoDto): Promise<Trabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trabajoData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Trabajo no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en partialUpdate:', error);
            throw error;
        }
    }

    /**
     * Elimina un trabajo
     * @param id - ID del trabajo a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Trabajo no encontrado');
                }
                throw new Error(`Error al eliminar trabajo: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    /**
     * Obtiene los trabajos de un estudiante específico
     * @param estudianteId - ID del estudiante
     * @returns Promise con array de trabajos del estudiante
     */
    async getByEstudiante(estudianteId: number): Promise<Trabajo[]> {
        try {
            const response = await fetch(`${this.baseUrl}/trabajos/estudiante/${estudianteId}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Estudiante no encontrado');
                }
                throw new Error(`Error al obtener trabajos del estudiante: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getByEstudiante:', error);
            throw error;
        }
    }

    /**
     * Obtiene las evaluaciones de un trabajo específico
     * @param id - ID del trabajo
     * @returns Promise con array de evaluaciones del trabajo
     */
    async getEvaluaciones(id: number): Promise<any[]> {
        try {
            const response = await fetch(`${this.endpoint}${id}/evaluaciones/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Trabajo no encontrado');
                }
                throw new Error(`Error al obtener evaluaciones: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getEvaluaciones:', error);
            throw error;
        }
    }
}

// Instancia singleton del servicio
export const trabajoService = new TrabajoService();
