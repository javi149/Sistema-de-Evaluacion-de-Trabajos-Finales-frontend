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

// Interfaz basada en el modelo del backend
export interface Trabajo {
  id: number;
  titulo: string;
  resumen: string | null;
  estudiante_id: number;
  fecha_entrega: string; // ISO date string
  duracion_meses: number | null;
  nota_aprobacion: number | null;
  requisito_aprobacion: string | null;
}

export interface CreateTrabajoDto {
  titulo: string;
  resumen?: string;
  estudiante_id: number;
  fecha_entrega: string;
  duracion_meses?: number;
  nota_aprobacion?: number;
  requisito_aprobacion?: string;
}

export interface UpdateTrabajoDto extends Partial<CreateTrabajoDto> { }

export interface Evaluator {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  rol: string;
  created_at?: string;
}

export interface CreateEvaluatorDto {
  nombre: string;
  email: string;
  tipo: 'guia' | 'comision' | 'informante';
}

export interface UpdateEvaluatorDto extends Partial<CreateEvaluatorDto> { }

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
