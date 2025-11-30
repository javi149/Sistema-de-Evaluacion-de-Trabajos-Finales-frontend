import { useState, useEffect, useCallback } from 'react';
import { Acta } from '../types';
import { actaService, CreateActaDto, UpdateActaDto } from '../services/actaService';
import { generatePdfFromHtml } from '../utils/pdfGenerator';

/**
 * Estado de carga y error para las operaciones
 */
interface UseActasState {
  actas: Acta[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado para gestionar actas
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useActas() {
  const [state, setState] = useState<UseActasState>({
    actas: [],
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
   * Carga todas las actas
   */
  const fetchActas = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await actaService.getAll();
      setState({
        actas: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      handleError(error, 'fetchActas');
    }
  }, [handleError]);

  /**
   * Obtiene un acta por ID
   */
  const getActaById = useCallback(async (id: number): Promise<Acta | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const acta = await actaService.getById(id);
      setState((prev) => ({ ...prev, loading: false }));
      return acta;
    } catch (error) {
      handleError(error, 'getActaById');
      return null;
    }
  }, [handleError]);

  /**
   * Crea un nuevo acta
   */
  const createActa = useCallback(async (actaData: CreateActaDto): Promise<Acta | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const newActa = await actaService.create(actaData);
      // Recargar la lista completa para asegurar datos correctos
      await fetchActas();
      return newActa;
    } catch (error) {
      handleError(error, 'createActa');
      return null;
    }
  }, [fetchActas, handleError]);

  /**
   * Actualiza un acta existente
   */
  const updateActa = useCallback(async (
    id: number,
    actaData: UpdateActaDto
  ): Promise<Acta | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const updatedActa = await actaService.update(id, actaData);
      // Recargar la lista completa para asegurar datos correctos
      await fetchActas();
      return updatedActa;
    } catch (error) {
      handleError(error, 'updateActa');
      return null;
    }
  }, [fetchActas, handleError]);

  /**
   * Elimina un acta
   */
  const deleteActa = useCallback(async (id: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await actaService.delete(id);
      // Recargar la lista completa para asegurar datos correctos
      await fetchActas();
      return true;
    } catch (error) {
      handleError(error, 'deleteActa');
      return false;
    }
  }, [fetchActas, handleError]);

  /**
   * Busca actas por término de búsqueda
   */
  const searchActas = useCallback(async (searchTerm: string): Promise<Acta[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const results = await actaService.search(searchTerm);
      setState((prev) => ({
        ...prev,
        actas: results,
        loading: false,
        error: null,
      }));
      return results;
    } catch (error) {
      handleError(error, 'searchActas');
      return [];
    }
  }, [handleError]);

  /**
   * Obtiene actas por trabajo ID
   */
  const getActasByTrabajoId = useCallback(async (trabajoId: number): Promise<Acta[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const results = await actaService.getByTrabajoId(trabajoId);
      setState((prev) => ({
        ...prev,
        actas: results,
        loading: false,
        error: null,
      }));
      return results;
    } catch (error) {
      handleError(error, 'getActasByTrabajoId');
      return [];
    }
  }, [handleError]);

  /**
   * Obtiene actas por estudiante ID
   */
  const getActasByEstudianteId = useCallback(async (estudianteId: number): Promise<Acta[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const results = await actaService.getByEstudianteId(estudianteId);
      setState((prev) => ({
        ...prev,
        actas: results,
        loading: false,
        error: null,
      }));
      return results;
    } catch (error) {
      handleError(error, 'getActasByEstudianteId');
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
   * Recarga las actas
   */
  const refresh = useCallback(() => {
    fetchActas();
  }, [fetchActas]);

  // Cargar actas al montar el componente
  useEffect(() => {
    fetchActas();
  }, [fetchActas]);

  /**
   * Genera el acta en HTML
   */
  const generateActaHtml = useCallback(async (trabajoId: number): Promise<string | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const html = await actaService.generateHtml(trabajoId);
      setState((prev) => ({ ...prev, loading: false }));
      return html;
    } catch (error) {
      handleError(error, 'generateActaHtml');
      return null;
    }
  }, [handleError]);

  /**
   * Genera el acta en Texto
   */
  const generateActaText = useCallback(async (trabajoId: number): Promise<string | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const text = await actaService.generateText(trabajoId);
      setState((prev) => ({ ...prev, loading: false }));
      return text;
    } catch (error) {
      handleError(error, 'generateActaText');
      return null;
    }
  }, [handleError]);

  /**
   * Genera y descarga el acta en PDF
   */
  const downloadActaPdf = useCallback(async (trabajoId: number, filename?: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const html = await actaService.generateHtml(trabajoId);
      const name = filename || `Acta_Trabajo_${trabajoId}.pdf`;
      generatePdfFromHtml(html, name);
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      handleError(error, 'downloadActaPdf');
      return false;
    }
  }, [handleError]);

  return {
    // Estado
    actas: state.actas,
    loading: state.loading,
    error: state.error,

    // Operaciones
    fetchActas,
    getActaById,
    createActa,
    updateActa,
    deleteActa,
    searchActas,
    getActasByTrabajoId,
    getActasByEstudianteId,
    generateActaHtml,
    generateActaText,
    downloadActaPdf,
    clearError,
    refresh,
  };
}

/**
 * Hook simplificado para obtener solo la lista de actas
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useActasList() {
  const { actas, loading, error, refresh } = useActas();

  return {
    actas,
    loading,
    error,
    refresh,
  };
}

