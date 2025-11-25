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
