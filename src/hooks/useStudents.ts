import { useState, useEffect, useCallback } from 'react';
import { Student } from '../types';
import { studentService, CreateStudentDto, UpdateStudentDto } from '../services/studentService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado para gestionar estudiantes
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useStudents() {
  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: false,
    error: null,
  });

  /**
   * Función auxiliar para manejar errores
   */
  const handleError = useCallback((error: unknown, operation: string) => {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Error desconocido en ${operation}`;
    
    setState((prev) => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }));
    
    console.error(`Error en ${operation}:`, error);
  }, []);

  /**
   * Carga todos los estudiantes
   */
  const fetchStudents = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await studentService.getAll();
      setState({
        students: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      handleError(error, 'fetchStudents');
    }
  }, [handleError]);

  /**
   * Obtiene un estudiante por ID
   */
  const getStudentById = useCallback(async (id: number): Promise<Student | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const student = await studentService.getById(id);
      setState((prev) => ({ ...prev, loading: false }));
      return student;
    } catch (error) {
      handleError(error, 'getStudentById');
      return null;
    }
  }, [handleError]);

  /**
   * Crea un nuevo estudiante
   */
  const createStudent = useCallback(async (studentData: CreateStudentDto): Promise<Student | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const newStudent = await studentService.create(studentData);
      setState((prev) => ({
        students: [...prev.students, newStudent],
        loading: false,
        error: null,
      }));
      return newStudent;
    } catch (error) {
      handleError(error, 'createStudent');
      return null;
    }
  }, [handleError]);

  /**
   * Actualiza un estudiante existente
   */
  const updateStudent = useCallback(async (
    id: number,
    studentData: UpdateStudentDto
  ): Promise<Student | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedStudent = await studentService.update(id, studentData);
      setState((prev) => ({
        students: prev.students.map((s) =>
          s.id === id ? updatedStudent : s
        ),
        loading: false,
        error: null,
      }));
      return updatedStudent;
    } catch (error) {
      handleError(error, 'updateStudent');
      return null;
    }
  }, [handleError]);

  /**
   * Elimina un estudiante
   */
  const deleteStudent = useCallback(async (id: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      await studentService.delete(id);
      setState((prev) => ({
        students: prev.students.filter((s) => s.id !== id),
        loading: false,
        error: null,
      }));
      return true;
    } catch (error) {
      handleError(error, 'deleteStudent');
      return false;
    }
  }, [handleError]);

  /**
   * Busca estudiantes por término de búsqueda
   */
  const searchStudents = useCallback(async (searchTerm: string): Promise<Student[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await studentService.search(searchTerm);
      setState((prev) => ({
        ...prev,
        students: results,
        loading: false,
        error: null,
      }));
      return results;
    } catch (error) {
      handleError(error, 'searchStudents');
      return [];
    }
  }, [handleError]);

  /**
   * Limpia el error del estado
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Recarga los estudiantes
   */
  const refresh = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    // Estado
    students: state.students,
    loading: state.loading,
    error: state.error,
    
    // Operaciones
    fetchStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    clearError,
    refresh,
  };
}

/**
 * Hook simplificado para obtener solo la lista de estudiantes
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useStudentsList() {
  const { students, loading, error, refresh } = useStudents();
  
  return {
    students,
    loading,
    error,
    refresh,
  };
}

