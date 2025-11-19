import { Work, Student, Grade, Evaluator } from '../types';
import { ICalculationStrategy } from './CalculationStrategy';

export abstract class ReportTemplate {
  protected strategy: ICalculationStrategy;

  constructor(strategy: ICalculationStrategy) {
    this.strategy = strategy;
  }

  public generateReport(
    work: Work,
    student: Student,
    grades: Grade[],
    evaluators: Evaluator[]
  ): string {
    let report = '';
    report += this.addHeader();
    report += this.addStudentInfo(student);
    report += this.addWorkInfo(work);
    report += this.addEvaluatorsInfo(evaluators);
    report += this.addGradesInfo(grades);
    report += this.addFinalGrade(grades);
    report += this.addFooter();
    return report;
  }

  protected abstract addHeader(): string;
  protected abstract addStudentInfo(student: Student): string;
  protected abstract addWorkInfo(work: Work): string;
  protected abstract addEvaluatorsInfo(evaluators: Evaluator[]): string;
  protected abstract addGradesInfo(grades: Grade[]): string;
  protected abstract addFinalGrade(grades: Grade[]): string;
  protected abstract addFooter(): string;
}

export class StandardReport extends ReportTemplate {
  protected addHeader(): string {
    return `
==============================================
           ACTA DE EVALUACIÓN
           TRABAJO FINAL DE GRADO
==============================================

`;
  }

  protected addStudentInfo(student: Student): string {
    return `
INFORMACIÓN DEL ESTUDIANTE
--------------------------
Nombre: ${student.name}
Código: ${student.studentId}
Email: ${student.email}

`;
  }

  protected addWorkInfo(work: Work): string {
    return `
INFORMACIÓN DEL TRABAJO
-----------------------
Título: ${work.title}
Tipo: ${work.workType.toUpperCase()}
Descripción: ${work.description}

`;
  }

  protected addEvaluatorsInfo(evaluators: Evaluator[]): string {
    let info = `
JURADO EVALUADOR
----------------
`;
    evaluators.forEach((evaluator) => {
      info += `- ${evaluator.name} (${evaluator.role})\n`;
    });
    return info + '\n';
  }

  protected addGradesInfo(grades: Grade[]): string {
    let info = `
CALIFICACIONES
--------------
`;
    grades.forEach((grade) => {
      info += `Criterio: ${grade.criteriaId} - Puntuación: ${grade.score}\n`;
      if (grade.comments) {
        info += `  Comentarios: ${grade.comments}\n`;
      }
    });
    return info + '\n';
  }

  protected addFinalGrade(grades: Grade[]): string {
    const finalGrade = this.strategy.calculate(grades, []);
    const status = finalGrade >= 3.0 ? 'APROBADO' : 'NO APROBADO';
    return `
CALIFICACIÓN FINAL
------------------
Nota: ${finalGrade.toFixed(2)}
Estado: ${status}

`;
  }

  protected addFooter(): string {
    const date = new Date().toLocaleDateString('es-ES');
    return `
==============================================
Fecha de generación: ${date}
==============================================
`;
  }
}
