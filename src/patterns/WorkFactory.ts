import { Work } from '../types';

export interface IWork {
  getId(): string;
  getTitle(): string;
  getType(): string;
  getRequirements(): string[];
}

export class ThesisWork implements IWork {
  constructor(private work: Work) {}

  getId(): string {
    return this.work.id;
  }

  getTitle(): string {
    return this.work.title;
  }

  getType(): string {
    return 'Tesis';
  }

  getRequirements(): string[] {
    return [
      'Propuesta de investigación',
      'Marco teórico completo',
      'Metodología detallada',
      'Análisis de resultados',
      'Conclusiones y recomendaciones',
    ];
  }
}

export class ProjectWork implements IWork {
  constructor(private work: Work) {}

  getId(): string {
    return this.work.id;
  }

  getTitle(): string {
    return this.work.title;
  }

  getType(): string {
    return 'Proyecto';
  }

  getRequirements(): string[] {
    return [
      'Planteamiento del problema',
      'Objetivos claros',
      'Desarrollo técnico',
      'Implementación práctica',
      'Resultados y evaluación',
    ];
  }
}

export class MonographWork implements IWork {
  constructor(private work: Work) {}

  getId(): string {
    return this.work.id;
  }

  getTitle(): string {
    return this.work.title;
  }

  getType(): string {
    return 'Monografía';
  }

  getRequirements(): string[] {
    return [
      'Introducción',
      'Revisión bibliográfica',
      'Análisis crítico',
      'Síntesis',
      'Conclusiones',
    ];
  }
}

export class WorkFactory {
  static createWork(work: Work): IWork {
    switch (work.workType) {
      case 'thesis':
        return new ThesisWork(work);
      case 'project':
        return new ProjectWork(work);
      case 'monograph':
        return new MonographWork(work);
      default:
        throw new Error(`Unknown work type: ${work.workType}`);
    }
  }
}
