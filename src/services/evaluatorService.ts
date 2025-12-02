import { AppConfig } from '../config/AppConfig';
import { Evaluator, CreateEvaluatorDto, UpdateEvaluatorDto } from '../types';

const config = AppConfig.getInstance();

/**
 * Clase de servicio para manejar todas las operaciones CRUD de evaluadores
 */
export class EvaluatorService {
    private baseUrl: string;
    private endpoint: string;

    constructor() {
        // Obtener URL base y normalizar (eliminar barra final si existe)
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
        this.endpoint = `${this.baseUrl}/evaluadores/`;
    }

    /**
     * Obtiene todos los evaluadores
     * @returns Promise con array de evaluadores
     */
    async getAll(): Promise<Evaluator[]> {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error(`Error al obtener evaluadores: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene un evaluador por su ID
     * @param id - ID del evaluador
     * @returns Promise con el evaluador encontrado
     */
    async getById(id: number): Promise<Evaluator> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluador no encontrado');
                }
                throw new Error(`Error al obtener evaluador: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo evaluador
     * @param evaluatorData - Datos del evaluador a crear
     * @returns Promise con el evaluador creado
     */
    async create(evaluatorData: CreateEvaluatorDto): Promise<Evaluator> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluatorData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al crear evaluador: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    /**
     * Actualiza un evaluador existente (PUT - actualización completa)
     * @param id - ID del evaluador a actualizar
     * @param evaluatorData - Datos del evaluador a actualizar
     * @returns Promise con el evaluador actualizado
     */
    async update(id: number, evaluatorData: UpdateEvaluatorDto): Promise<Evaluator> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluatorData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluador no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar evaluador: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Actualiza parcialmente un evaluador existente (PATCH)
     * @param id - ID del evaluador a actualizar
     * @param evaluatorData - Datos parciales del evaluador a actualizar
     * @returns Promise con el evaluador actualizado
     */
    async partialUpdate(id: number, evaluatorData: UpdateEvaluatorDto): Promise<Evaluator> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluatorData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluador no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar evaluador: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en partialUpdate:', error);
            throw error;
        }
    }

    /**
     * Elimina un evaluador
     * @param id - ID del evaluador a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluador no encontrado');
                }
                throw new Error(`Error al eliminar evaluador: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    /**
     * Obtiene las evaluaciones realizadas por un evaluador
     * @param id - ID del evaluador
     * @returns Promise con array de evaluaciones
     */
    async getEvaluaciones(id: number): Promise<any[]> {
        try {
            const response = await fetch(`${this.endpoint}${id}/evaluaciones/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluador no encontrado');
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
export const evaluatorService = new EvaluatorService();
