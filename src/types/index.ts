export type UserRole = 'super_admin' | 'usuario_privilegiado';

export type ProcessStatus = 'iniciado' | 'en_progreso' | 'evaluacion_pendiente' | 'certificado_emitido';

export type AffidavitStatus = 'firmada' | 'pendiente' | 'vencida';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  cargo: string;
  empresa: string;
  area: string;
  avatarInitials: string;
  assignedAreas?: string[]; // If usuario_privilegiado has a restricted area
}

export interface TraineeActivity {
  id: string;
  title: string;
  moduleName?: string;
  type: 'evaluacion' | 'simulador' | 'taller' | 'asistencia' | 'declaracion_jurada';
  date: string;
  score?: number;
  maxScore?: number;
  status: 'completada' | 'pendiente' | 'en_revision';
  hoursCredited?: number;
  notes?: string;
}

export interface TraineeCourseRecord {
  courseId: string;
  courseCode: string;
  courseName: string;
  category: string;
  hours: number;
  ht: number;
  hp: number;
  status: ProcessStatus;
  grade: number;
  attendanceRate: number; // e.g. 96
  startDate: string;
  completionDate?: string;
  certificateId?: string;
  certificateIssueDate?: string;
  affidavitStatus: AffidavitStatus;
  instructor?: string;
  activities?: TraineeActivity[];
}

export interface Trainee {
  id: string;
  rut: string;
  name: string;
  email: string;
  area: string;
  empresa: string; // Empresa filial del holding (e.g. Geotec Boyles Bros, Minera Centinela, Retail Andino)
  faena?: string; // Faena o centro de trabajo (e.g. Faena Centinela, Faena Pelambres, Taller Central Antofagasta, CD Lo Boza)
  cargo: string;
  avatarInitials: string;
  assignedCourseId: string;
  courseName: string;
  status: ProcessStatus;
  progress: number; // 0 to 100
  hoursCompleted: number;
  totalHours: number;
  grade: number; // 1.0 to 7.0
  lastAccess: string;
  affidavitStatus: AffidavitStatus;
  certificateId?: string;
  certificateIssueDate?: string;
  phone?: string;
  admissionDate?: string;
  accumulatedTotalHours?: number; // Total horas acumuladas en el holding
  coursesHistory?: TraineeCourseRecord[];
}

export interface MallaModuleDetail {
  id: string;
  moduleNumber: string; // e.g. 'MÓDULO 01', 'MÓDULO 04'
  actionVerb: string; // 'RECONOCER', 'DESCRIBIR', 'CALCULAR', 'PREPARAR'
  actionDescription: string;
  title: string;
  totalHours: number;
  ht: number; // Horas Teóricas
  hp: number; // Horas Prácticas
  ept: number; // Evaluación / Práctica en Terreno
  headerBgHex: string;
  headerColorClass: string;
  topics: string[];
  competencies?: string[];
  equipmentOrTool?: string;
}

export interface CurriculumMalla {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  category: string;
  institution: string;
  level: string;
  targetCompany: string;
  totalModules: number;
  totalHours: number;
  totalHT: number;
  totalHP: number;
  totalEPT: number;
  modules: MallaModuleDetail[];
  description: string;
  originalSlideUrl?: string;
  targetAudience?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  durationHours: number;
  enrolledCount: number;
  completedCount: number;
  averageScore: number;
  moodleUrl: string;
  instructor: string;
  description: string;
  modules: string[];
  bannerColor: string;
  curriculumMalla?: CurriculumMalla;
}

export interface KPIStats {
  totalTrained: number;
  totalTrainedDelta: string;
  activeCourses: number;
  activeCohorts: number;
  completionRate: number;
  completionRateDelta: string;
  targetCompletionRate: number;
  accumulatedHours: number;
  accumulatedHoursGoal: number;
  affidavitsSignedRate: number;
  certificatesIssuedCount: number;
}

export type ActiveTab = 
  | 'dashboard'
  | 'malla'
  | 'declaraciones'
  | 'diplomas'
  | 'moodle'
  | 'usuarios'
  | 'configuracion';
