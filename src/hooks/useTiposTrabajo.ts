import { useState, useEffect, useCallback } from 'react';
import { TipoTrabajo, CreateTipoTrabajoDto, UpdateTipoTrabajoDto } from '../types';
import { tipoTrabajoService } from '../services/tipoTrabajoService';

interface UseTiposTrabajoState {
    tiposTrabajo: TipoTrabajo[];
    loading: boolean;
    error: string | null;
}

export function useTiposTrabajo() {
    const [state, setState] = useState<UseTiposTrabajoState>({
        tiposTrabajo: [],
        loading: false,
        error: null,
    });

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

    const fetchTiposTrabajo = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await tipoTrabajoService.getAll();
            setState({
                tiposTrabajo: Array.isArray(data) ? data : [],
                loading: false,
                error: null,
            });
        } catch (error) {
            handleError(error, 'fetchTiposTrabajo');
        }
    }, [handleError]);

    const getTipoTrabajoById = useCallback(async (id: number): Promise<TipoTrabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const tipo = await tipoTrabajoService.getById(id);
            setState((prev) => ({ ...prev, loading: false }));
            return tipo;
        } catch (error) {
            handleError(error, 'getTipoTrabajoById');
            return null;
        }
    }, [handleError]);

    const createTipoTrabajo = useCallback(async (data: CreateTipoTrabajoDto): Promise<TipoTrabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const newTipo = await tipoTrabajoService.create(data);
            await fetchTiposTrabajo();
            return newTipo;
        } catch (error) {
            handleError(error, 'createTipoTrabajo');
            return null;
        }
    }, [fetchTiposTrabajo, handleError]);

    const updateTipoTrabajo = useCallback(async (
        id: number,
        data: UpdateTipoTrabajoDto
    ): Promise<TipoTrabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedTipo = await tipoTrabajoService.update(id, data);
            await fetchTiposTrabajo();
            return updatedTipo;
        } catch (error) {
            handleError(error, 'updateTipoTrabajo');
            return null;
        }
    }, [fetchTiposTrabajo, handleError]);

    const partialUpdateTipoTrabajo = useCallback(async (
        id: number,
        data: UpdateTipoTrabajoDto
    ): Promise<TipoTrabajo | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedTipo = await tipoTrabajoService.partialUpdate(id, data);
            await fetchTiposTrabajo();
            return updatedTipo;
        } catch (error) {
            handleError(error, 'partialUpdateTipoTrabajo');
            return null;
        }
    }, [fetchTiposTrabajo, handleError]);

    const deleteTipoTrabajo = useCallback(async (id: number): Promise<boolean> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            await tipoTrabajoService.delete(id);
            await fetchTiposTrabajo();
            return true;
        } catch (error) {
            handleError(error, 'deleteTipoTrabajo');
            return false;
        }
    }, [fetchTiposTrabajo, handleError]);

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    const refresh = useCallback(() => {
        fetchTiposTrabajo();
    }, [fetchTiposTrabajo]);

    useEffect(() => {
        fetchTiposTrabajo();
    }, [fetchTiposTrabajo]);

    return {
        tiposTrabajo: state.tiposTrabajo,
        loading: state.loading,
        error: state.error,
        fetchTiposTrabajo,
        getTipoTrabajoById,
        createTipoTrabajo,
        updateTipoTrabajo,
        partialUpdateTipoTrabajo,
        deleteTipoTrabajo,
        clearError,
        refresh,
    };
}
