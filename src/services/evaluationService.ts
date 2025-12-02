import { AppConfig } from '../config/AppConfig';
import { Evaluacion } from '../types';

const config = AppConfig.getInstance();

/**
 * Tipos para las operaciones del servicio de evaluaciones
 */
export interface CreateEvaluacionDto {
    acta_id?: number;
    criterio_id?: number;
    nota?: number;
    observacion?: string;
    // Campos adicionales del backend
    evaluador_id?: number;
    trabajo_id?: number;
    fecha_evaluacion?: string;
    nota_final?: number | null;
    comentarios?: string;
    [key: string]: unknown;
}

export interface UpdateEvaluacionDto extends Partial<CreateEvaluacionDto> { }

/**
 * Clase de servicio para manejar todas las operaciones CRUD de evaluaciones
 */
export class EvaluationService {
    private baseUrl: string;
    private endpoint: string;

    constructor() {
        // Obtener URL base y normalizar (eliminar barra final si existe)
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
        this.endpoint = `${this.baseUrl}/evaluaciones/`;
    }

    /**
     * Obtiene todas las evaluaciones
     * @returns Promise con array de evaluaciones
     */
    async getAll(): Promise<Evaluacion[]> {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error(`Error al obtener evaluaciones: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene una evaluación por su ID
     * @param id - ID de la evaluación
     * @returns Promise con la evaluación encontrada
     */
    async getById(id: number): Promise<Evaluacion> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluación no encontrada');
                }
                throw new Error(`Error al obtener evaluación: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva evaluación
     * @param evaluacionData - Datos de la evaluación a crear
     * @returns Promise con la evaluación creada
     */
    async create(evaluacionData: CreateEvaluacionDto): Promise<Evaluacion> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluacionData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al crear evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    /**
     * Actualiza una evaluación existente
     * @param id - ID de la evaluación a actualizar
     * @param evaluacionData - Datos parciales de la evaluación a actualizar
     * @returns Promise con la evaluación actualizada
     */
    async update(id: number, evaluacionData: UpdateEvaluacionDto): Promise<Evaluacion> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluacionData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluación no encontrada');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Actualiza parcialmente una evaluación existente
     * @param id - ID de la evaluación a actualizar
     * @param evaluacionData - Datos parciales de la evaluación a actualizar
     * @returns Promise con la evaluación actualizada
     */
    async updatePartial(id: number, evaluacionData: UpdateEvaluacionDto): Promise<Evaluacion> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluacionData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluación no encontrada');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar parcialmente la evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updatePartial:', error);
            throw error;
        }
    }

    /**
     * Elimina una evaluación
     * @param id - ID de la evaluación a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Evaluación no encontrada');
                }
                throw new Error(`Error al eliminar evaluación: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    /**
     * Busca evaluaciones por término de búsqueda
     * @param searchTerm - Término de búsqueda
     * @returns Promise con array de evaluaciones que coinciden
     */
    async search(searchTerm: string): Promise<Evaluacion[]> {
        try {
            const response = await fetch(`${this.endpoint}?search=${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en search:', error);
            throw error;
        }
    }

    /**
     * Obtiene evaluaciones por acta ID
     * @param actaId - ID del acta
     * @returns Promise con array de evaluaciones del acta
     */
    async getByActaId(actaId: number): Promise<Evaluacion[]> {
        try {
            const response = await fetch(`${this.endpoint}?acta_id=${actaId}`);

            if (!response.ok) {
                throw new Error(`Error al obtener evaluaciones del acta: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getByActaId:', error);
            throw error;
        }
    }

    /**
     * Obtiene evaluaciones de un trabajo específico
     * @param trabajoId - ID del trabajo
     * @returns Promise con array de evaluaciones del trabajo
     */
    async getByTrabajo(trabajoId: number): Promise<Evaluacion[]> {
        try {
            const response = await fetch(`${this.baseUrl}/evaluaciones/trabajo/${trabajoId}/`);

            if (!response.ok) {
                throw new Error(`Error al obtener evaluaciones del trabajo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getByTrabajo:', error);
            throw error;
        }
    }

    /**
     * Obtiene evaluaciones de un evaluador específico
     * @param evaluadorId - ID del evaluador
     * @returns Promise con array de evaluaciones del evaluador
     */
    async getByEvaluador(evaluadorId: number): Promise<Evaluacion[]> {
        try {
            const response = await fetch(`${this.baseUrl}/evaluaciones/evaluador/${evaluadorId}/`);

            if (!response.ok) {
                throw new Error(`Error al obtener evaluaciones del evaluador: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getByEvaluador:', error);
            throw error;
        }
    }
}

// Instancia singleton del servicio
export const evaluationService = new EvaluationService();
