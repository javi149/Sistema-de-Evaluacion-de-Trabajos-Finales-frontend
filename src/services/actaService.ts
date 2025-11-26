import { AppConfig } from '../config/AppConfig';
import { Acta } from '../types';

const config = AppConfig.getInstance();

/**
 * Tipos para las operaciones del servicio de actas
 */
export interface CreateActaDto {
  trabajo_id?: number;
  estudiante_id?: number;
  fecha?: string;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  calificacion_final?: number;
  evaluadores?: string;
  observaciones?: string;
  [key: string]: unknown;
}

export interface UpdateActaDto extends Partial<CreateActaDto> { }

/**
 * Clase de servicio para manejar todas las operaciones CRUD de actas
 */
export class ActaService {
  private baseUrl: string;
  private endpoint: string;

  constructor() {
    // Obtener URL base y normalizar (eliminar barra final si existe)
    const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
    this.baseUrl = baseUrl;
    this.endpoint = `${this.baseUrl}/actas/`;
  }

  /**
   * Obtiene todas las actas
   * @returns Promise con array de actas
   */
  async getAll(): Promise<Acta[]> {
    try {
      const response = await fetch(this.endpoint);

      if (!response.ok) {
        throw new Error(`Error al obtener actas: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  /**
   * Obtiene un acta por su ID
   * @param id - ID del acta
   * @returns Promise con el acta encontrado
   */
  async getById(id: number): Promise<Acta> {
    try {
      const response = await fetch(`${this.endpoint}${id}/`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acta no encontrada');
        }
        throw new Error(`Error al obtener acta: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo acta
   * @param actaData - Datos del acta a crear
   * @returns Promise con el acta creado
   */
  async create(actaData: CreateActaDto): Promise<Acta> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actaData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al crear acta: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  /**
   * Actualiza un acta existente
   * @param id - ID del acta a actualizar
   * @param actaData - Datos parciales del acta a actualizar
   * @returns Promise con el acta actualizado
   */
  async update(id: number, actaData: UpdateActaDto): Promise<Acta> {
    try {
      const response = await fetch(`${this.endpoint}${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actaData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acta no encontrada');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al actualizar acta: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  /**
   * Elimina un acta
   * @param id - ID del acta a eliminar
   * @returns Promise que se resuelve cuando la eliminación es exitosa
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acta no encontrada');
        }
        throw new Error(`Error al eliminar acta: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  /**
   * Busca actas por criterios
   * @param searchTerm - Término de búsqueda (puede buscar por título, descripción, etc.)
   * @returns Promise con array de actas que coinciden
   */
  async search(searchTerm: string): Promise<Acta[]> {
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
   * Obtiene actas por trabajo ID
   * @param trabajoId - ID del trabajo
   * @returns Promise con array de actas del trabajo
   */
  async getByTrabajoId(trabajoId: number): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.endpoint}?trabajo_id=${trabajoId}`);

      if (!response.ok) {
        throw new Error(`Error al obtener actas del trabajo: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getByTrabajoId:', error);
      throw error;
    }
  }

  /**
   * Obtiene actas por estudiante ID
   * @param estudianteId - ID del estudiante
   * @returns Promise con array de actas del estudiante
   */
  async getByEstudianteId(estudianteId: number): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.endpoint}?estudiante_id=${estudianteId}`);

      if (!response.ok) {
        throw new Error(`Error al obtener actas del estudiante: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getByEstudianteId:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const actaService = new ActaService();

