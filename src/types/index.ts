export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  carrera: string;
  email: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  studentId: string;
  workType: 'thesis' | 'project' | 'monograph';
  status: 'pending' | 'in-progress' | 'evaluated';
  createdAt: string;
}

export interface Evaluator {
  id: string;
  name: string;
  email: string;
  specialty: string;
  role: 'director' | 'juror' | 'external';
  createdAt: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface Criterio {
  id: number;
  nombre: string;
  descripcion: string | null;
  ponderacion: number; // Valor decimal (float) que representa el peso del criterio (ej: 0.4 = 40%)
}

export interface Grade {
  id: string;
  workId: string;
  evaluatorId: string;
  criteriaId: string;
  score: number;
  comments?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  workId: string;
  finalGrade: number;
  status: 'approved' | 'rejected' | 'needs-revision';
  generatedAt: string;
  grades: Grade[];
}

export interface Acta {
  id: number;
  trabajo_id?: number;
  estudiante_id?: number;
  fecha?: string;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  calificacion_final?: number;
  evaluadores?: string;
  observaciones?: string;
  [key: string]: unknown; // Permite campos adicionales del backend
}

export interface Evaluacion {
  id: number;
  acta_id?: number;
  criterio_id?: number;
  nota?: number;
  observacion?: string;
  // Campos adicionales del backend
  evaluador_id?: number;
  trabajo_id?: number;
  fecha_evaluacion?: string;
  nota_final?: number | null;
  comentarios?: string;
  [key: string]: unknown;
}
