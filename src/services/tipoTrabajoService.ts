import { AppConfig } from '../config/AppConfig';
import { TipoTrabajo, CreateTipoTrabajoDto, UpdateTipoTrabajoDto } from '../types';

const config = AppConfig.getInstance();

/**
 * Clase de servicio para manejar todas las operaciones CRUD de tipos de trabajo
 */
export class TipoTrabajoService {
    private baseUrl: string;
    private endpoint: string;

    constructor() {
        // Obtener URL base y normalizar (eliminar barra final si existe)
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
        this.endpoint = `${this.baseUrl}/tipos-trabajo/`;
    }

    /**
     * Obtiene todos los tipos de trabajo
     * @returns Promise con array de tipos de trabajo
     */
    async getAll(): Promise<TipoTrabajo[]> {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error(`Error al obtener tipos de trabajo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene un tipo de trabajo por su ID
     * @param id - ID del tipo de trabajo
     * @returns Promise con el tipo de trabajo encontrado
     */
    async getById(id: number): Promise<TipoTrabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Tipo de trabajo no encontrado');
                }
                throw new Error(`Error al obtener tipo de trabajo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo tipo de trabajo
     * @param data - Datos del tipo de trabajo a crear
     * @returns Promise con el tipo de trabajo creado
     */
    async create(data: CreateTipoTrabajoDto): Promise<TipoTrabajo> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al crear tipo de trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    /**
     * Actualiza un tipo de trabajo existente
     * @param id - ID del tipo de trabajo a actualizar
     * @param data - Datos del tipo de trabajo a actualizar
     * @returns Promise con el tipo de trabajo actualizado
     */
    async update(id: number, data: UpdateTipoTrabajoDto): Promise<TipoTrabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Tipo de trabajo no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar tipo de trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Actualiza parcialmente un tipo de trabajo existente
     * @param id - ID del tipo de trabajo a actualizar
     * @param data - Datos parciales del tipo de trabajo a actualizar
     * @returns Promise con el tipo de trabajo actualizado
     */
    async partialUpdate(id: number, data: UpdateTipoTrabajoDto): Promise<TipoTrabajo> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Tipo de trabajo no encontrado');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error al actualizar parcialmente tipo de trabajo: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Error en partialUpdate:', error);
            throw error;
        }
    }

    /**
     * Elimina un tipo de trabajo
     * @param id - ID del tipo de trabajo a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.endpoint}${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Tipo de trabajo no encontrado');
                }
                throw new Error(`Error al eliminar tipo de trabajo: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
}

// Instancia singleton del servicio
export const tipoTrabajoService = new TipoTrabajoService();
