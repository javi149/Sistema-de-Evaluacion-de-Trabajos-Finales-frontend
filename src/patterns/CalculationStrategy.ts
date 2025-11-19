import { Grade, EvaluationCriteria } from '../types';

export interface ICalculationStrategy {
  calculate(grades: Grade[], criteria: EvaluationCriteria[]): number;
}

export class WeightedAverageStrategy implements ICalculationStrategy {
  calculate(grades: Grade[], criteria: EvaluationCriteria[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach((criterion) => {
      const criterionGrades = grades.filter((g) => g.criteriaId === criterion.id);
      if (criterionGrades.length > 0) {
        const avgScore =
          criterionGrades.reduce((sum, g) => sum + g.score, 0) / criterionGrades.length;
        totalScore += avgScore * criterion.weight;
        totalWeight += criterion.weight;
      }
    });

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

  calculate(grades: Grade[], criteria: EvaluationCriteria[]): number {
    const strategy = new WeightedAverageStrategy();
    const finalScore = strategy.calculate(grades, criteria);
    return finalScore >= this.minimumScore ? finalScore : 0;
  }
}
