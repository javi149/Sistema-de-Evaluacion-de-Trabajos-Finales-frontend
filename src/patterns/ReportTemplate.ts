import { Work, Student, Grade, Evaluator, Criterio } from '../types';
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
    evaluators: Evaluator[],
    criterios: Criterio[]
  ): string {
    let report = '';
    report += this.addHeader();
    report += this.addStudentInfo(student);
    report += this.addWorkInfo(work);
    report += this.addEvaluatorsInfo(evaluators);
    report += this.addGradesInfo(grades, criterios);
    report += this.addFinalGrade(grades, criterios);
    report += this.addFooter();
    return report;
  }

  protected abstract addHeader(): string;
  protected abstract addStudentInfo(student: Student): string;
  protected abstract addWorkInfo(work: Work): string;
  protected abstract addEvaluatorsInfo(evaluators: Evaluator[]): string;
  protected abstract addGradesInfo(grades: Grade[], criterios: Criterio[]): string;
  protected abstract addFinalGrade(grades: Grade[], criterios: Criterio[]): string;
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
Nombre: ${student.nombre} ${student.apellido}
RUT: ${student.rut}
Carrera: ${student.carrera}
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

  protected addGradesInfo(grades: Grade[], criterios: Criterio[]): string {
    let info = `
CALIFICACIONES
--------------
`;
    grades.forEach((grade) => {
      const criterio = criterios.find((c) => c.id.toString() === grade.criteriaId);
      const criterioNombre = criterio ? criterio.nombre : `Criterio ID: ${grade.criteriaId}`;
      info += `Criterio: ${criterioNombre} - Puntuación: ${grade.score}\n`;
      if (grade.comments) {
        info += `  Comentarios: ${grade.comments}\n`;
      }
    });
    return info + '\n';
  }

  protected addFinalGrade(grades: Grade[], criterios: Criterio[]): string {
    const finalGrade = this.strategy.calculate(grades, criterios);
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
