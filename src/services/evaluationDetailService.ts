import { AppConfig } from '../config/AppConfig';
import { EvaluacionDetalle } from '../types';

const config = AppConfig.getInstance();

/**
 * Tipos para las operaciones del servicio de detalles de evaluación
 */
export interface CreateEvaluacionDetalleDto {
    evaluacion_id: number;
    criterio_id: number;
    nota: number;
    observacion?: string;
}

export interface UpdateEvaluacionDetalleDto extends Partial<CreateEvaluacionDetalleDto> { }

/**
 * Clase de servicio para manejar todas las operaciones CRUD de detalles de evaluación
 */
export class EvaluationDetailService {
    private baseUrl: string;
    private endpoint: string;

    constructor() {
        // Obtener URL base y normalizar (eliminar barra final si existe)
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
        this.endpoint = `${this.baseUrl}/evaluacion-detalle/`;
    }

    /**
     * Obtiene todos los detalles de evaluación
     * @returns Promise con array de detalles
     */
    async getAll(): Promise<EvaluacionDetalle[]> {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error(`Error al obtener detalles de evaluación: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene un detalle de evaluación por su ID
     * @param id - ID del detalle
     * @returns Promise con el detalle encontrado
     */
    async getById(id: number): Promise<EvaluacionDetalle> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Detalle de evaluación no encontrado');
                }
                throw new Error(`Error al obtener detalle de evaluación: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo detalle de evaluación
     * @param detalleData - Datos del detalle a crear
     * @returns Promise con el detalle creado
     */
    async create(detalleData: CreateEvaluacionDetalleDto): Promise<EvaluacionDetalle> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detalleData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al crear detalle de evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    /**
     * Actualiza un detalle de evaluación existente
     * @param id - ID del detalle a actualizar
     * @param detalleData - Datos parciales del detalle a actualizar
     * @returns Promise con el detalle actualizado
     */
    async update(id: number, detalleData: UpdateEvaluacionDetalleDto): Promise<EvaluacionDetalle> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detalleData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Detalle de evaluación no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar detalle de evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Actualiza parcialmente un detalle de evaluación existente
     * @param id - ID del detalle a actualizar
     * @param detalleData - Datos parciales del detalle a actualizar
     * @returns Promise con el detalle actualizado
     */
    async updatePartial(id: number, detalleData: UpdateEvaluacionDetalleDto): Promise<EvaluacionDetalle> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detalleData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Detalle de evaluación no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar parcialmente detalle de evaluación: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updatePartial:', error);
            throw error;
        }
    }

    /**
     * Elimina un detalle de evaluación
     * @param id - ID del detalle a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Detalle de evaluación no encontrado');
                }
                throw new Error(`Error al eliminar detalle de evaluación: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    /**
     * Obtiene detalles de una evaluación específica
     * @param evaluacionId - ID de la evaluación
     * @returns Promise con array de detalles de la evaluación
     */
    async getByEvaluacionId(evaluacionId: number): Promise<EvaluacionDetalle[]> {
        try {
            const response = await fetch(`${this.baseUrl}/evaluacion-detalle/evaluacion/${evaluacionId}/`);

            if (!response.ok) {
                throw new Error(`Error al obtener detalles de la evaluación: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getByEvaluacionId:', error);
            throw error;
        }
    }
}

// Instancia singleton del servicio
export const evaluationDetailService = new EvaluationDetailService();
