import { useState, useEffect, useCallback } from 'react';
import { Evaluator, CreateEvaluatorDto, UpdateEvaluatorDto } from '../types';
import { evaluatorService } from '../services/evaluatorService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseEvaluatorsState {
    evaluators: Evaluator[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook personalizado para gestionar evaluadores
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useEvaluators() {
    const [state, setState] = useState<UseEvaluatorsState>({
        evaluators: [],
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
     * Carga todos los evaluadores
     */
    const fetchEvaluators = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await evaluatorService.getAll();
            setState({
                evaluators: Array.isArray(data) ? data : [],
                loading: false,
                error: null,
            });
        } catch (error) {
            handleError(error, 'fetchEvaluators');
        }
    }, [handleError]);

    /**
     * Obtiene un evaluador por ID
     */
    const getEvaluatorById = useCallback(async (id: number): Promise<Evaluator | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluator = await evaluatorService.getById(id);
            setState((prev) => ({ ...prev, loading: false }));
            return evaluator;
        } catch (error) {
            handleError(error, 'getEvaluatorById');
            return null;
        }
    }, [handleError]);

    /**
     * Crea un nuevo evaluador
     */
    const createEvaluator = useCallback(async (evaluatorData: CreateEvaluatorDto): Promise<Evaluator | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const newEvaluator = await evaluatorService.create(evaluatorData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluators();
            return newEvaluator;
        } catch (error) {
            handleError(error, 'createEvaluator');
            return null;
        }
    }, [fetchEvaluators, handleError]);

    /**
     * Actualiza un evaluador existente (PUT)
     */
    const updateEvaluator = useCallback(async (
        id: number,
        evaluatorData: UpdateEvaluatorDto
    ): Promise<Evaluator | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedEvaluator = await evaluatorService.update(id, evaluatorData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluators();
            return updatedEvaluator;
        } catch (error) {
            handleError(error, 'updateEvaluator');
            return null;
        }
    }, [fetchEvaluators, handleError]);

    /**
     * Actualiza parcialmente un evaluador existente (PATCH)
     */
    const partialUpdateEvaluator = useCallback(async (
        id: number,
        evaluatorData: UpdateEvaluatorDto
    ): Promise<Evaluator | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedEvaluator = await evaluatorService.partialUpdate(id, evaluatorData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluators();
            return updatedEvaluator;
        } catch (error) {
            handleError(error, 'partialUpdateEvaluator');
            return null;
        }
    }, [fetchEvaluators, handleError]);

    /**
     * Elimina un evaluador
     */
    const deleteEvaluator = useCallback(async (id: number): Promise<boolean> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            await evaluatorService.delete(id);
            // Recargar la lista completa para asegurar datos correctos
            await fetchEvaluators();
            return true;
        } catch (error) {
            handleError(error, 'deleteEvaluator');
            return false;
        }
    }, [fetchEvaluators, handleError]);

    /**
     * Obtiene las evaluaciones realizadas por un evaluador
     */
    const getEvaluatorEvaluaciones = useCallback(async (id: number): Promise<any[] | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluaciones = await evaluatorService.getEvaluaciones(id);
            setState((prev) => ({ ...prev, loading: false }));
            return evaluaciones;
        } catch (error) {
            handleError(error, 'getEvaluatorEvaluaciones');
            return null;
        }
    }, [handleError]);

    /**
     * Limpia el error del estado
     */
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    /**
     * Recarga los evaluadores
     */
    const refresh = useCallback(() => {
        fetchEvaluators();
    }, [fetchEvaluators]);

    // Cargar evaluadores al montar el componente
    useEffect(() => {
        fetchEvaluators();
    }, [fetchEvaluators]);

    return {
        // Estado
        evaluators: state.evaluators,
        loading: state.loading,
        error: state.error,

        // Operaciones
        fetchEvaluators,
        getEvaluatorById,
        createEvaluator,
        updateEvaluator,
        partialUpdateEvaluator,
        deleteEvaluator,
        getEvaluatorEvaluaciones,
        clearError,
        refresh,
    };
}

/**
 * Hook simplificado para obtener solo la lista de evaluadores
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useEvaluatorsList() {
    const { evaluators, loading, error, refresh } = useEvaluators();

    return {
        evaluators,
        loading,
        error,
        refresh,
    };
}
