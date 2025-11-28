import { AppConfig } from '../config/AppConfig';

const config = AppConfig.getInstance();

export interface CalculatedGrade {
    trabajo_id: number;
    nota_final: number;
    estado: string;
    detalles: {
        criterio: string;
        ponderacion: number;
        promedio: number;
        nota_ponderada: number;
    }[];
}

export class ApiService {
    private baseUrl: string;

    constructor() {
        const baseUrl = config.getApiBaseUrl().replace(/\/$/, '');
        this.baseUrl = baseUrl;
    }

    /**
     * Calcula la nota final de un trabajo
     * @param trabajoId - ID del trabajo
     * @returns Promise con el detalle del cálculo de la nota
     */
    async calcularNota(trabajoId: number): Promise<CalculatedGrade> {
        try {
            const response = await fetch(`${this.baseUrl}/api/calcular-nota/${trabajoId}`);

            if (!response.ok) {
                throw new Error(`Error al calcular nota: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en calcularNota:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService();
