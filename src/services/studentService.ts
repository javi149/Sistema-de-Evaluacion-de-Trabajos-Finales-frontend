import { AppConfig } from '../config/AppConfig';
import { Student } from '../types';

const config = AppConfig.getInstance();

/**
 * Tipos para las operaciones del servicio de estudiantes
 */
// Una "interface" en TypeScript es una estructura que define la forma de un objeto, es decir,
// especifica qué propiedades y tipos debe tener ese objeto. No genera código en JavaScript,
// pero ayuda a asegurar que los objetos tengan la forma correcta durante el desarrollo.

export interface CreateStudentDto {
  nombre: string;
  apellido: string;
  rut: string;
  carrera: string;
  email: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

/**
 * Clase de servicio para manejar todas las operaciones CRUD de estudiantes
 */
export class StudentService {
  private baseUrl: string;
  private endpoint: string;

  constructor() {
    // Obtener URL base y normalizar (eliminar barra final si existe)
    const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
    this.baseUrl = baseUrl;
    this.endpoint = `${this.baseUrl}/estudiantes`;
  }

  /**
   * Obtiene todos los estudiantes
   * @returns Promise con array de estudiantes
   */
  async getAll(): Promise<Student[]> {
    try {
      const response = await fetch(this.endpoint);
      
      if (!response.ok) {
        throw new Error(`Error al obtener estudiantes: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  /**
   * Obtiene un estudiante por su ID
   * @param id - ID del estudiante
   * @returns Promise con el estudiante encontrado
   */
  async getById(id: number): Promise<Student> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Estudiante no encontrado');
        }
        throw new Error(`Error al obtener estudiante: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo estudiante
   * @param studentData - Datos del estudiante a crear
   * @returns Promise con el estudiante creado
   */
  async create(studentData: CreateStudentDto): Promise<Student> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al crear estudiante: ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  /**
   * Actualiza un estudiante existente
   * @param id - ID del estudiante a actualizar
   * @param studentData - Datos parciales del estudiante a actualizar
   * @returns Promise con el estudiante actualizado
   */
  async update(id: number, studentData: UpdateStudentDto): Promise<Student> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Estudiante no encontrado');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al actualizar estudiante: ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  /**
   * Elimina un estudiante
   * @param id - ID del estudiante a eliminar
   * @returns Promise que se resuelve cuando la eliminación es exitosa
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Estudiante no encontrado');
        }
        throw new Error(`Error al eliminar estudiante: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  /**
   * Busca estudiantes por criterios
   * @param searchTerm - Término de búsqueda (puede buscar por nombre, apellido, rut, email)
   * @returns Promise con array de estudiantes que coinciden
   */
  async search(searchTerm: string): Promise<Student[]> {
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
export const studentService = new StudentService();

