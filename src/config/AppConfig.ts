export class AppConfig {
  private static instance: AppConfig;
  private apiBaseUrl: string;
  private institutionName: string;
  private evaluationCriteria: Array<{ name: string; weight: number; maxScore: number }>;

  private constructor() {
    // URL base del API - se puede configurar mediante variable de entorno VITE_API_URL
    const envUrl = import.meta.env.VITE_API_URL;

    // En desarrollo, usar el proxy local. En producción, usar la URL directa
    const isDevelopment = import.meta.env.DEV;
    const defaultUrl = isDevelopment
      ? '/api'  // Proxy local configurado en vite.config.ts
      : 'https://sistema-de-evaluacion-de-trabajos-finales-production.up.railway.app';

    // Normalizar URL: eliminar barra final si existe
    const baseUrl = (envUrl || defaultUrl).replace(/\/$/, '');
    this.apiBaseUrl = baseUrl;

    this.institutionName = 'Universidad Example';
    this.evaluationCriteria = [
      { name: 'Contenido', weight: 0.4, maxScore: 5 },
      { name: 'Metodología', weight: 0.3, maxScore: 5 },
      { name: 'Presentación', weight: 0.2, maxScore: 5 },
      { name: 'Defensa', weight: 0.1, maxScore: 5 },
    ];
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  public getInstitutionName(): string {
    return this.institutionName;
  }

  public getEvaluationCriteria() {
    return this.evaluationCriteria;
  }

  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  public setInstitutionName(name: string): void {
    this.institutionName = name;
  }
}
