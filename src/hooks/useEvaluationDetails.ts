import { useState, useCallback } from 'react';
import { EvaluacionDetalle } from '../types';
import { evaluationDetailService, CreateEvaluacionDetalleDto, UpdateEvaluacionDetalleDto } from '../services/evaluationDetailService';

/**
 * Estado de carga y error para las operaciones
 */
interface UseEvaluationDetailsState {
    detalles: EvaluacionDetalle[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook personalizado para gestionar detalles de evaluación
 */
export function useEvaluationDetails() {
    const [state, setState] = useState<UseEvaluationDetailsState>({
        detalles: [],
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
     * Carga todos los detalles
     */
    const fetchAllDetails = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await evaluationDetailService.getAll();
            setState({
                detalles: Array.isArray(data) ? data : [],
                loading: false,
                error: null,
            });
        } catch (error) {
            handleError(error, 'fetchAllDetails');
        }
    }, [handleError]);

    /**
     * Obtiene detalles por evaluación ID
     */
    const getDetailsByEvaluacionId = useCallback(async (evaluacionId: number): Promise<EvaluacionDetalle[]> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const detalles = await evaluationDetailService.getByEvaluacionId(evaluacionId);
            setState((prev) => ({
                ...prev,
                detalles,
                loading: false,
                error: null,
            }));
            return detalles;
        } catch (error) {
            handleError(error, 'getDetailsByEvaluacionId');
            return [];
        }
    }, [handleError]);

    /**
     * Crea un nuevo detalle
     */
    const createDetail = useCallback(async (detalleData: CreateEvaluacionDetalleDto): Promise<EvaluacionDetalle | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const newDetail = await evaluationDetailService.create(detalleData);
            // Actualizar el estado local si es necesario, o recargar
            setState((prev) => ({
                ...prev,
                detalles: [...prev.detalles, newDetail],
                loading: false,
                error: null,
            }));
            return newDetail;
        } catch (error) {
            handleError(error, 'createDetail');
            return null;
        }
    }, [handleError]);

    /**
     * Actualiza un detalle existente
     */
    const updateDetail = useCallback(async (
        id: number,
        detalleData: UpdateEvaluacionDetalleDto
    ): Promise<EvaluacionDetalle | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedDetail = await evaluationDetailService.update(id, detalleData);
            setState((prev) => ({
                ...prev,
                detalles: prev.detalles.map(d => d.id === id ? updatedDetail : d),
                loading: false,
                error: null,
            }));
            return updatedDetail;
        } catch (error) {
            handleError(error, 'updateDetail');
            return null;
        }
    }, [handleError]);

    /**
     * Actualiza parcialmente un detalle existente
     */
    const updatePartialDetail = useCallback(async (
        id: number,
        detalleData: UpdateEvaluacionDetalleDto
    ): Promise<EvaluacionDetalle | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const updatedDetail = await evaluationDetailService.updatePartial(id, detalleData);
            setState((prev) => ({
                ...prev,
                detalles: prev.detalles.map(d => d.id === id ? updatedDetail : d),
                loading: false,
                error: null,
            }));
            return updatedDetail;
        } catch (error) {
            handleError(error, 'updatePartialDetail');
            return null;
        }
    }, [handleError]);

    /**
     * Elimina un detalle
     */
    const deleteDetail = useCallback(async (id: number): Promise<boolean> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            await evaluationDetailService.delete(id);
            setState((prev) => ({
                ...prev,
                detalles: prev.detalles.filter(d => d.id !== id),
                loading: false,
                error: null,
            }));
            return true;
        } catch (error) {
            handleError(error, 'deleteDetail');
            return false;
        }
    }, [handleError]);

    /**
     * Limpia el error del estado
     */
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        // Estado
        detalles: state.detalles,
        loading: state.loading,
        error: state.error,

        // Operaciones
        fetchAllDetails,
        getDetailsByEvaluacionId,
        createDetail,
        updateDetail,
        updatePartialDetail,
        deleteDetail,
        clearError,
    };
}
