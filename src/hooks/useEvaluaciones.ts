import { useState, useEffect, useCallback } from 'react';
import { Evaluacion } from '../types';
import { evaluationService, CreateEvaluacionDto, UpdateEvaluacionDto } from '../services/evaluationService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseEvaluacionesState {
    evaluaciones: Evaluacion[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook personalizado para gestionar evaluaciones
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useEvaluaciones() {
    const [state, setState] = useState<UseEvaluacionesState>({
        evaluaciones: [],
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
     * Carga todas las evaluaciones
     */
    const fetchEvaluaciones = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await evaluationService.getAll();
            setState({
                evaluaciones: Array.isArray(data) ? data : [],
                loading: false,
                error: null,
            });
        } catch (error) {
            handleError(error, 'fetchEvaluaciones');
        }
    }, [handleError]);

    /**
     * Obtiene una evaluación por ID
     */
    const getEvaluacionById = useCallback(async (id: number): Promise<Evaluacion | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluacion = await evaluationService.getById(id);
            setState((prev) => ({ ...prev, loading: false }));
            return evaluacion;
        } catch (error) {
            handleError(error, 'getEvaluacionById');
            return null;
        }
    }, [handleError]);

    /**
     * Obtiene evaluaciones por acta ID
     */
    const getEvaluacionesByActaId = useCallback(async (actaId: number): Promise<Evaluacion[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluaciones = await evaluationService.getByActaId(actaId);
            setState((prev) => ({
                ...prev,
                evaluaciones,
                loading: false,
                error: null,
            }));
            return evaluaciones;
        } catch (error) {
            handleError(error, 'getEvaluacionesByActaId');
            return [];
        }
    }, [handleError]);

    /**
     * Crea una nueva evaluación
     */
    const createEvaluacion = useCallback(async (evaluacionData: CreateEvaluacionDto): Promise<Evaluacion | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const newEvaluacion = await evaluationService.create(evaluacionData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluaciones();
            return newEvaluacion;
        } catch (error) {
            handleError(error, 'createEvaluacion');
            return null;
        }
    }, [fetchEvaluaciones, handleError]);

    /**
     * Actualiza una evaluación existente
     */
    const updateEvaluacion = useCallback(async (
        id: number,
        evaluacionData: UpdateEvaluacionDto
    ): Promise<Evaluacion | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedEvaluacion = await evaluationService.update(id, evaluacionData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluaciones();
            return updatedEvaluacion;
        } catch (error) {
            handleError(error, 'updateEvaluacion');
            return null;
        }
    }, [fetchEvaluaciones, handleError]);

    /**
     * Actualiza parcialmente una evaluación existente
     */
    const updatePartialEvaluacion = useCallback(async (
        id: number,
        evaluacionData: UpdateEvaluacionDto
    ): Promise<Evaluacion | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedEvaluacion = await evaluationService.updatePartial(id, evaluacionData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluaciones();
            return updatedEvaluacion;
        } catch (error) {
            handleError(error, 'updatePartialEvaluacion');
            return null;
        }
    }, [fetchEvaluaciones, handleError]);

    /**
     * Elimina una evaluación
     */
    const deleteEvaluacion = useCallback(async (id: number): Promise<boolean> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            await evaluationService.delete(id);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluaciones();
            return true;
        } catch (error) {
            handleError(error, 'deleteEvaluacion');
            return false;
        }
    }, [fetchEvaluaciones, handleError]);

    /**
     * Busca evaluaciones por término de búsqueda
     */
    const searchEvaluaciones = useCallback(async (searchTerm: string): Promise<Evaluacion[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const results = await evaluationService.search(searchTerm);
            setState((prev) => ({
                ...prev,
                evaluaciones: results,
                loading: false,
                error: null,
            }));
            return results;
        } catch (error) {
            handleError(error, 'searchEvaluaciones');
            return [];
        }
    }, [handleError]);

    /**
     * Obtiene evaluaciones por trabajo ID
     */
    const getEvaluacionesByTrabajo = useCallback(async (trabajoId: number): Promise<Evaluacion[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluaciones = await evaluationService.getByTrabajo(trabajoId);
            setState((prev) => ({
                ...prev,
                evaluaciones,
                loading: false,
                error: null,
            }));
            return evaluaciones;
        } catch (error) {
            handleError(error, 'getEvaluacionesByTrabajo');
            return [];
        }
    }, [handleError]);

    /**
     * Obtiene evaluaciones por evaluador ID
     */
    const getEvaluacionesByEvaluador = useCallback(async (evaluadorId: number): Promise<Evaluacion[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluaciones = await evaluationService.getByEvaluador(evaluadorId);
            setState((prev) => ({
                ...prev,
                evaluaciones,
                loading: false,
                error: null,
            }));
            return evaluaciones;
        } catch (error) {
            handleError(error, 'getEvaluacionesByEvaluador');
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
     * Recarga las evaluaciones
     */
    const refresh = useCallback(() => {
        fetchEvaluaciones();
    }, [fetchEvaluaciones]);

    // Cargar evaluaciones al montar el componente
    useEffect(() => {
        fetchEvaluaciones();
    }, [fetchEvaluaciones]);

    return {
        // Estado
        evaluaciones: state.evaluaciones,
        loading: state.loading,
        error: state.error,

        // Operaciones
        fetchEvaluaciones,
        getEvaluacionById,
        getEvaluacionesByActaId,
        createEvaluacion,
        updateEvaluacion,
        updatePartialEvaluacion,
        deleteEvaluacion,
        searchEvaluaciones,
        getEvaluacionesByTrabajo,
        getEvaluacionesByEvaluador,
        clearError,
        refresh,
    };
}

/**
 * Hook simplificado para obtener solo la lista de evaluaciones
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useEvaluacionesList() {
    const { evaluaciones, loading, error, refresh } = useEvaluaciones();

    return {
        evaluaciones,
        loading,
        error,
        refresh,
    };
}
