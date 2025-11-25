import { AppConfig } from '../config/AppConfig';
import { Criterio } from '../types';

const config = AppConfig.getInstance();

/**
 * Tipos para las operaciones del servicio de criterios
 */
export interface CreateCriterioDto {
  nombre: string;
  descripcion?: string | null;
  ponderacion: number; // Valor decimal (float) que representa el peso del criterio (ej: 0.4 = 40%, 0.35 = 35%)
}

export interface UpdateCriterioDto extends Partial<CreateCriterioDto> {}

/**
 * Clase de servicio para manejar todas las operaciones CRUD de criterios
 */
export class CriterioService {
  private baseUrl: string;
  private endpoint: string;

  constructor() {
    // Obtener URL base y normalizar (eliminar barra final si existe)
    const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
    this.baseUrl = baseUrl;
    this.endpoint = `${this.baseUrl}/criterios`;
  }

  /**
   * Obtiene todos los criterios
   * @returns Promise con array de criterios
   */
  async getAll(): Promise<Criterio[]> {
    try {
      const response = await fetch(this.endpoint);
      
      if (!response.ok) {
        throw new Error(`Error al obtener criterios: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  /**
   * Obtiene un criterio por su ID
   * @param id - ID del criterio
   * @returns Promise con el criterio encontrado
   */
  async getById(id: number): Promise<Criterio> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Criterio no encontrado');
        }
        throw new Error(`Error al obtener criterio: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo criterio
   * @param criterioData - Datos del criterio a crear
   * @returns Promise con el criterio creado
   */
  async create(criterioData: CreateCriterioDto): Promise<Criterio> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criterioData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al crear criterio: ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  /**
   * Actualiza un criterio existente
   * @param id - ID del criterio a actualizar
   * @param criterioData - Datos parciales del criterio a actualizar
   * @returns Promise con el criterio actualizado
   */
  async update(id: number, criterioData: UpdateCriterioDto): Promise<Criterio> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criterioData),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Criterio no encontrado');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al actualizar criterio: ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  /**
   * Elimina un criterio
   * @param id - ID del criterio a eliminar
   * @returns Promise que se resuelve cuando la eliminación es exitosa
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Criterio no encontrado');
        }
        throw new Error(`Error al eliminar criterio: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  /**
   * Busca criterios por término de búsqueda
   * @param searchTerm - Término de búsqueda (puede buscar por nombre, descripción)
   * @returns Promise con array de criterios que coinciden
   */
  async search(searchTerm: string): Promise<Criterio[]> {
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

}

// Instancia singleton del servicio
export const criterioService = new CriterioService();

