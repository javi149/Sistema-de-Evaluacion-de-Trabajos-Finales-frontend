import { useState, useEffect, useCallback } from 'react';
import { Trabajo } from '../types';
import { trabajoService, CreateTrabajoDto, UpdateTrabajoDto } from '../services/trabajoService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseTrabajosState {
    trabajos: Trabajo[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook personalizado para gestionar trabajos
 * Proporciona operaciones CRUD completas con manejo de estado
 */
export function useTrabajos() {
    const [state, setState] = useState<UseTrabajosState>({
        trabajos: [],
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
     * Carga todos los trabajos
     */
    const fetchTrabajos = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await trabajoService.getAll();
            setState({
                trabajos: Array.isArray(data) ? data : [],
                loading: false,
                error: null,
            });
        } catch (error) {
            handleError(error, 'fetchTrabajos');
        }
    }, [handleError]);

    /**
     * Obtiene un trabajo por ID
     */
    const getTrabajoById = useCallback(async (id: number): Promise<Trabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const trabajo = await trabajoService.getById(id);
            setState((prev) => ({ ...prev, loading: false }));
            return trabajo;
        } catch (error) {
            handleError(error, 'getTrabajoById');
            return null;
        }
    }, [handleError]);

    /**
     * Crea un nuevo trabajo
     */
    const createTrabajo = useCallback(async (trabajoData: CreateTrabajoDto): Promise<Trabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const newTrabajo = await trabajoService.create(trabajoData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchTrabajos();
            return newTrabajo;
        } catch (error) {
            handleError(error, 'createTrabajo');
            return null;
        }
    }, [fetchTrabajos, handleError]);

    /**
     * Actualiza un trabajo existente
     */
    const updateTrabajo = useCallback(async (
        id: number,
        trabajoData: UpdateTrabajoDto
    ): Promise<Trabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedTrabajo = await trabajoService.update(id, trabajoData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchTrabajos();
            return updatedTrabajo;
        } catch (error) {
            handleError(error, 'updateTrabajo');
            return null;
        }
    }, [fetchTrabajos, handleError]);

    /**
     * Actualiza parcialmente un trabajo existente (PATCH)
     */
    const partialUpdateTrabajo = useCallback(async (
        id: number,
        trabajoData: UpdateTrabajoDto
    ): Promise<Trabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedTrabajo = await trabajoService.partialUpdate(id, trabajoData);
            // Recargar la lista completa para asegurar datos correctos
            await fetchTrabajos();
            return updatedTrabajo;
        } catch (error) {
            handleError(error, 'partialUpdateTrabajo');
            return null;
        }
    }, [fetchTrabajos, handleError]);

    /**
     * Elimina un trabajo
     */
    const deleteTrabajo = useCallback(async (id: number): Promise<boolean> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            await trabajoService.delete(id);
            // Recargar la lista completa para asegurar datos correctos
            await fetchTrabajos();
            return true;
        } catch (error) {
            handleError(error, 'deleteTrabajo');
            return false;
        }
    }, [fetchTrabajos, handleError]);

    /**
     * Obtiene los trabajos de un estudiante específico
     */
    const getTrabajosByEstudiante = useCallback(async (estudianteId: number): Promise<Trabajo[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const trabajos = await trabajoService.getByEstudiante(estudianteId);
            setState((prev) => ({
                ...prev,
                loading: false,
                error: null,
            }));
            return trabajos;
        } catch (error) {
            handleError(error, 'getTrabajosByEstudiante');
            return [];
        }
    }, [handleError]);

    /**
     * Obtiene las evaluaciones de un trabajo específico
     */
    const getEvaluaciones = useCallback(async (trabajoId: number): Promise<any[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const evaluaciones = await trabajoService.getEvaluaciones(trabajoId);
            setState((prev) => ({ ...prev, loading: false }));
            return evaluaciones;
        } catch (error) {
            handleError(error, 'getEvaluaciones');
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
     * Recarga los trabajos
     */
    const refresh = useCallback(() => {
        fetchTrabajos();
    }, [fetchTrabajos]);

    // Cargar trabajos al montar el componente
    useEffect(() => {
        fetchTrabajos();
    }, [fetchTrabajos]);

    return {
        // Estado
        trabajos: state.trabajos,
        loading: state.loading,
        error: state.error,

        // Operaciones
        fetchTrabajos,
        getTrabajoById,
        createTrabajo,
        updateTrabajo,
        partialUpdateTrabajo,
        deleteTrabajo,
        getTrabajosByEstudiante,
        getEvaluaciones,
        clearError,
        refresh,
    };
}

/**
 * Hook simplificado para obtener solo la lista de trabajos
 * Útil cuando solo necesitas leer datos sin operaciones de escritura
 */
export function useTrabajosList() {
    const { trabajos, loading, error, refresh } = useTrabajos();

    return {
        trabajos,
        loading,
        error,
        refresh,
    };
}
