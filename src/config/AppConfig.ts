export class AppConfig {
  private static instance: AppConfig;
  private apiBaseUrl: string;
  private institutionName: string;
  private evaluationCriteria: Array<{ name: string; weight: number; maxScore: number }>;

  private constructor() {
    // --- CAMBIO: Forzamos la URL de Railway directa ---
    // Eliminamos la dependencia de variables de entorno por ahora para asegurar que funcione.

    this.apiBaseUrl = 'https://sistema-de-evaluacion-de-trabajos-finales-production.up.railway.app/api';

    // --------------------------------------------------

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
