import { AppConfig } from '../config/AppConfig';
import { Student, Work, Evaluator, Grade } from '../types';

const config = AppConfig.getInstance();

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.getApiBaseUrl();
  }

  async fetchStudents(): Promise<Student[]> {
    const response = await fetch(`${this.baseUrl}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  }

  async createStudent(student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
    const response = await fetch(`${this.baseUrl}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  }

  async fetchWorks(): Promise<Work[]> {
    const response = await fetch(`${this.baseUrl}/works`);
    if (!response.ok) throw new Error('Failed to fetch works');
    return response.json();
  }

  async createWork(work: Omit<Work, 'id' | 'createdAt'>): Promise<Work> {
    const response = await fetch(`${this.baseUrl}/works`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
    });
    if (!response.ok) throw new Error('Failed to create work');
    return response.json();
  }

  async fetchEvaluators(): Promise<Evaluator[]> {
    const response = await fetch(`${this.baseUrl}/evaluators`);
    if (!response.ok) throw new Error('Failed to fetch evaluators');
    return response.json();
  }

  async createEvaluator(evaluator: Omit<Evaluator, 'id' | 'createdAt'>): Promise<Evaluator> {
    const response = await fetch(`${this.baseUrl}/evaluators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluator),
    });
    if (!response.ok) throw new Error('Failed to create evaluator');
    return response.json();
  }

  async fetchGrades(workId?: string): Promise<Grade[]> {
    const url = workId ? `${this.baseUrl}/grades?workId=${workId}` : `${this.baseUrl}/grades`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch grades');
    return response.json();
  }

  async createGrade(grade: Omit<Grade, 'id' | 'createdAt'>): Promise<Grade> {
    const response = await fetch(`${this.baseUrl}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade),
    });
    if (!response.ok) throw new Error('Failed to create grade');
    return response.json();
  }

  async generateReport(workId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/reports/${workId}`);
    if (!response.ok) throw new Error('Failed to generate report');
    const data = await response.json();
    return data.report;
  }
}

export const apiService = new ApiService();
