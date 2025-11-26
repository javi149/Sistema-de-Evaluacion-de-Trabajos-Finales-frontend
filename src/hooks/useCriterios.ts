import { useState, useEffect, useCallback } from 'react';
import { Criterio } from '../types';
import { criterioService, CreateCriterioDto, UpdateCriterioDto } from '../services/criterioService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseCriteriosState {
  criterios: Criterio[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado para gestionar criterios
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useCriterios() {
  const [state, setState] = useState<UseCriteriosState>({
    criterios: [],
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
   * Carga todos los criterios
   */
  const fetchCriterios = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await criterioService.getAll();
      setState({
        criterios: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      handleError(error, 'fetchCriterios');
    }
  }, [handleError]);

  /**
   * Obtiene un criterio por ID
   */
  const getCriterioById = useCallback(async (id: number): Promise<Criterio | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const criterio = await criterioService.getById(id);
      setState((prev) => ({ ...prev, loading: false }));
      return criterio;
    } catch (error) {
      handleError(error, 'getCriterioById');
      return null;
    }
  }, [handleError]);

  /**
   * Crea un nuevo criterio
   */
  const createCriterio = useCallback(async (criterioData: CreateCriterioDto): Promise<Criterio | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const newCriterio = await criterioService.create(criterioData);
      // Recargar la lista completa para asegurar datos correctos
      await fetchCriterios();
      return newCriterio;
    } catch (error) {
      handleError(error, 'createCriterio');
      return null;
    }
  }, [fetchCriterios, handleError]);

  /**
   * Actualiza un criterio existente
   */
  const updateCriterio = useCallback(async (
    id: number,
    criterioData: UpdateCriterioDto
  ): Promise<Criterio | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const updatedCriterio = await criterioService.update(id, criterioData);
      // Recargar la lista completa para asegurar datos correctos
      await fetchCriterios();
      return updatedCriterio;
    } catch (error) {
      handleError(error, 'updateCriterio');
      return null;
    }
  }, [fetchCriterios, handleError]);

  /**
   * Elimina un criterio
   */
  const deleteCriterio = useCallback(async (id: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await criterioService.delete(id);
      // Recargar la lista completa para asegurar datos correctos
      await fetchCriterios();
      return true;
    } catch (error) {
      handleError(error, 'deleteCriterio');
      return false;
    }
  }, [fetchCriterios, handleError]);

  /**
   * Busca criterios por término de búsqueda
   */
  const searchCriterios = useCallback(async (searchTerm: string): Promise<Criterio[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const results = await criterioService.search(searchTerm);
      setState((prev) => ({
        ...prev,
        criterios: results,
        loading: false,
        error: null,
      }));
      return results;
    } catch (error) {
      handleError(error, 'searchCriterios');
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
   * Recarga los criterios
   */
  const refresh = useCallback(() => {
    fetchCriterios();
  }, [fetchCriterios]);

  // Cargar criterios al montar el componente
  useEffect(() => {
    fetchCriterios();
  }, [fetchCriterios]);

  return {
    // Estado
    criterios: state.criterios,
    loading: state.loading,
    error: state.error,

    // Operaciones
    fetchCriterios,
    getCriterioById,
    createCriterio,
    updateCriterio,
    deleteCriterio,
    searchCriterios,
    clearError,
    refresh,
  };
}

/**
 * Hook simplificado para obtener solo la lista de criterios
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useCriteriosList() {
  const { criterios, loading, error, refresh } = useCriterios();

  return {
    criterios,
    loading,
    error,
    refresh,
  };
}

