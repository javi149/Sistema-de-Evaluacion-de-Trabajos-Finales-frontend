import { Grade, Criterio } from '../types';

export interface ICalculationStrategy {
  calculate(grades: Grade[], criteria: Criterio[]): number;
}

export class WeightedAverageStrategy implements ICalculationStrategy {
  /**
   * Normaliza la ponderación a formato decimal (0-1)
   * Si el valor es > 1, asumimos que está en formato porcentaje y lo convertimos
   * Si el valor es <= 1, asumimos que ya está en formato decimal
   */
  private normalizePonderacion(ponderacion: number): number {
    return ponderacion > 1 ? ponderacion / 100 : ponderacion;
  }

  /**
   * Calcula el promedio ponderado de las calificaciones
   * @param grades - Array de calificaciones
   * @param criteria - Array de criterios con sus ponderaciones
   *   (puede venir como decimal 0.6 o como porcentaje 60)
   * @returns Nota final calculada con precisión decimal
   */
  calculate(grades: Grade[], criteria: Criterio[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach((criterion) => {
      const criterionGrades = grades.filter((g) => g.criteriaId === criterion.id.toString());
      if (criterionGrades.length > 0) {
        // Calcular promedio de calificaciones para este criterio
        const avgScore =
          criterionGrades.reduce((sum, g) => sum + g.score, 0) / criterionGrades.length;
        // Normalizar ponderación a formato decimal y multiplicar
        const normalizedPonderacion = this.normalizePonderacion(criterion.ponderacion);
        totalScore += avgScore * normalizedPonderacion;
        totalWeight += normalizedPonderacion;
      }
    });

    // Retornar promedio ponderado con precisión decimal
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
}

export class SimpleAverageStrategy implements ICalculationStrategy {
  calculate(grades: Grade[]): number {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
  }
}

export class MinimumPassStrategy implements ICalculationStrategy {
  private minimumScore: number;

  constructor(minimumScore: number = 3.0) {
    this.minimumScore = minimumScore;
  }

  calculate(grades: Grade[], criteria: Criterio[]): number {
    const strategy = new WeightedAverageStrategy();
    const finalScore = strategy.calculate(grades, criteria);
    return finalScore >= this.minimumScore ? finalScore : 0;
  }
}
