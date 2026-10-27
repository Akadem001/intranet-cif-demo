import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  BookOpen, 
  Clock, 
  Award, 
  FileCheck2, 
  AlertCircle,
  CheckCircle2,
  Send,
  Printer,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
  MapPin,
  Cpu,
  BadgeCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Trainee, TraineeCourseRecord, TraineeActivity } from '../../types';

interface TraineeDetailModalProps {
  trainee: Trainee | null;
  onClose: () => void;
  onOpenCertificate: (certificateId: string, trainee: Trainee) => void;
  onSendReminder: (trainee: Trainee) => void;
  onOpenSyllabus?: (courseId: string) => void;
}

export const TraineeDetailModal: React.FC<TraineeDetailModalProps> = ({
  trainee,
  onClose,
  onOpenCertificate,
  onSendReminder,
  onOpenSyllabus,
}) => {
  if (!trainee) return null;

  // Courses history from trainee
  const coursesHistory = trainee.coursesHistory && trainee.coursesHistory.length > 0
    ? trainee.coursesHistory
    : [
        {
          courseId: trainee.assignedCourseId,
          courseCode: 'CURSO-ACTIVO',
          courseName: trainee.courseName,
          category: trainee.area,
          hours: trainee.totalHours,
          ht: Math.round(trainee.totalHours * 0.5),
          hp: Math.round(trainee.totalHours * 0.5),
          status: trainee.status,
          grade: trainee.grade,
          attendanceRate: 95,
          startDate: '01/10/2026',
          completionDate: trainee.status === 'certificado_emitido' ? '25/10/2026' : undefined,
          certificateId: trainee.certificateId,
          certificateIssueDate: trainee.certificateIssueDate,
          affidavitStatus: trainee.affidavitStatus,
        },
      ];

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'historial' | 'actividades' | 'sence'>('historial');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedCourse: TraineeCourseRecord = coursesHistory[selectedCourseIndex] || coursesHistory[0];

  const completedCoursesCount = coursesHistory.filter(
    (c) => c.status === 'certificado_emitido'
  ).length;

  const totalAccumulatedHours = coursesHistory.reduce((acc, curr) => acc + curr.hours, 0);

  const averageGrade = (
    coursesHistory.reduce((acc, curr) => acc + curr.grade, 0) / coursesHistory.length
  ).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  // Holding company badge color helper
  const getCompanyColor = (empresa: string) => {
    if (empresa.includes('Geotec')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (empresa.includes('Centinela')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
        {/* Top Header / Identity Strip */}
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-base shadow-md">
              {trainee.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-tight">{trainee.name}</h2>
                <span className="text-xs font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                  {trainee.rut}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCompanyColor(trainee.empresa)}`}>
                  {trainee.empresa}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span>{trainee.cargo}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {trainee.faena || 'Faena Central Operaciones'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Imprimir Hoja de Vida oficial del colaborador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Expediente</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Summary KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] text-slate-500 block">Horas Acumuladas Holding</span>
            <div className="text-sm font-bold text-blue-700 mt-0.5 tabular-nums">
              {trainee.accumulatedTotalHours || totalAccumulatedHours} hrs
            </div>
            <span className="text-[10px] text-slate-400">En {coursesHistory.length} programas</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] text-slate-500 block">Cursos Realizados</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">
              {completedCoursesCount} <span className="text-[11px] font-normal text-slate-500">aprobados de {coursesHistory.length}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {Math.round((completedCoursesCount / coursesHistory.length) * 100)}% de titulación
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] text-slate-500 block">Promedio Calificaciones</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5 font-mono tabular-nums">
              {averageGrade} / 7.0
            </div>
            <span className="text-[10px] text-slate-400">Escala Nacional SENCE</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] text-slate-500 block">Declaración Jurada Ley 16.744</span>
            <div className="text-xs font-semibold mt-1 flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Suscrita (SHA-256)</span>
            </div>
            <span className="text-[10px] text-slate-400">Al día para faena</span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'historial'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hoja de Vida & Historial de Cursos ({coursesHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('actividades')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'actividades'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bitácora de Actividades & Simulador</span>
            </button>

            <button
              onClick={() => setActiveTab('sence')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sence'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Ficha Laboral & SENCE</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden md:inline">
            Expediente ID: <strong className="font-mono text-slate-700">{trainee.id}</strong>
          </span>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* TAB 1: HOJA DE VIDA & HISTORIAL DE CURSOS */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Programas y Cursos Realizados en el Holding
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Selecciona cualquier curso para navegar a su ficha, inspeccionar calificaciones o abrir diplomas.
                  </p>
                </div>
                <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  {coursesHistory.length} Cursos Registrados
                </span>
              </div>

              {/* Course history cards list */}
              <div className="space-y-3">
                {coursesHistory.map((courseItem, idx) => {
                  const isSelected = selectedCourseIndex === idx;
                  const isCertified = courseItem.status === 'certificado_emitido';

                  return (
                    <div
                      key={courseItem.courseId || idx}
                      onClick={() => setSelectedCourseIndex(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCertified
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                                {courseItem.courseCode}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                {courseItem.category}
                              </span>
                              {courseItem.startDate && (
                                <span className="text-[10px] text-slate-400">
                                  Inicio: {courseItem.startDate}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                              {courseItem.courseName}
                            </h4>
                            {courseItem.instructor && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Docente: {courseItem.instructor}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status, Grade and Actions */}
                        <div className="flex items-center gap-4 shrink-0 text-right self-end sm:self-auto">
                          <div>
                            <div className="text-[10px] text-slate-400">Calificación</div>
                            <div className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                              {courseItem.grade.toFixed(1)} / 7.0
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-slate-400">Horas</div>
                            <div className="font-bold text-xs text-slate-800 tabular-nums">
                              {courseItem.hours} hrs
                            </div>
                          </div>

                          <div>
                            {isCertified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Award className="w-3 h-3 text-emerald-600" />
                                Certificado
                              </span>
                            ) : courseItem.status === 'evaluacion_pendiente' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Evaluación Pendiente
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                En Progreso
                              </span>
                            )}
                          </div>

                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Course Detailed Sub-card if selected */}
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-center">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Horas Teóricas</span>
                              <span className="font-bold text-slate-800">{courseItem.ht} HT</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Horas Prácticas</span>
                              <span className="font-bold text-emerald-700">{courseItem.hp} HP</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Asistencia SENCE</span>
                              <span className="font-bold text-slate-800 font-mono">{courseItem.attendanceRate}%</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Folio Diploma</span>
                              <span className="font-mono font-semibold text-slate-700 text-[11px]">
                                {courseItem.certificateId || 'En trámite'}
                              </span>
                            </div>
                          </div>

                          {/* Quick action buttons for this specific course */}
                          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                            <span className="text-[11px] text-slate-500">
                              {courseItem.completionDate
                                ? `Programa finalizado exitosamente el ${courseItem.completionDate}`
                                : 'Curso actualmente en fase de ejecución activa'}
                            </span>

                            <div className="flex items-center gap-2">
                              {onOpenSyllabus && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenSyllabus(courseItem.courseId);
                                  }}
                                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Ver Malla / Syllabus</span>
                                </button>
                              )}

                              {courseItem.certificateId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenCertificate(courseItem.certificateId!, trainee);
                                  }}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Award className="w-3.5 h-3.5 text-white" />
                                  <span>Ver Diploma Oficial</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BITÁCORA DE ACTIVIDADES & SIMULADOR */}
          {activeTab === 'actividades' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Bitácora de Evaluaciones, Prácticas y Simulador
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Registro de calificaciones, talleres litológicos, sesiones de simulador CT-20 y entregas del curso: <strong className="text-slate-800">{selectedCourse.courseName}</strong>.
                  </p>
                </div>

                <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono">
                  {selectedCourse.courseCode}
                </div>
              </div>

              {selectedCourse.activities && selectedCourse.activities.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedCourse.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            act.type === 'simulador'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : act.type === 'taller'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : act.type === 'declaracion_jurada'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {act.type === 'simulador' ? (
                            <Cpu className="w-4 h-4" />
                          ) : act.type === 'declaracion_jurada' ? (
                            <FileCheck2 className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-xs">{act.title}</h4>
                            {act.moduleName && (
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {act.moduleName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="capitalize">Tipo: {act.type.replace('_', ' ')}</span>
                            <span>&middot;</span>
                            <span>Fecha: {act.date}</span>
                            {act.hoursCredited && (
                              <>
                                <span>&middot;</span>
                                <span className="text-slate-600 font-medium">{act.hoursCredited} hrs acreditadas</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {act.score !== undefined && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Puntaje</span>
                            <span className="font-mono font-bold text-emerald-700 text-xs tabular-nums">
                              {act.score.toFixed(1)} / 7.0
                            </span>
                          </div>
                        )}

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Todas las evaluaciones de este programa han sido completadas y aprobadas en plataforma Moodle LMS.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calificación final consolidada: <strong className="text-slate-800">{selectedCourse.grade.toFixed(1)}/7.0</strong> con asistencia de <strong className="text-slate-800">{selectedCourse.attendanceRate}%</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FICHA LABORAL & SENCE */}
          {activeTab === 'sence' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* General Info */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    Datos del Colaborador & Contrato
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Empresa Filial:</span>
                      <strong className="text-slate-800">{trainee.empresa}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cargo Oficial:</span>
                      <strong className="text-slate-800">{trainee.cargo}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Área / Departamento:</span>
                      <strong className="text-slate-800">{trainee.area}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Faena / Localidad:</span>
                      <strong className="text-slate-800">{trainee.faena || 'Faena Central'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fecha de Ingreso OTEC:</span>
                      <strong className="text-slate-800">{trainee.admissionDate || '01/01/2026'}</strong>
                    </div>
                  </div>
                </div>

                {/* SENCE and Compliance */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    Cumplimiento SENCE & Normativa 16.744
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registro Asistencia LCE:</span>
                      <strong className="text-emerald-700 font-mono">100% Conforme</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Declaración Jurada:</span>
                      <strong className="text-emerald-700">Firmada (Token Activo)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Franquicia Tributaria:</span>
                      <strong className="text-slate-800">100% Imputable</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Auditoría SENCE:</span>
                      <strong className="text-blue-700">Carpeta Aprobada</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Habilitación para Faena:</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        ACTIVO / HABILITADO
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact strip */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email Corporativo</span>
                    <strong className="text-slate-800 font-mono">{trainee.email}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Teléfono de Contacto</span>
                    <strong className="text-slate-800 font-mono">{trainee.phone || '+56 9 8412 9901'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendReminder(trainee)}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Enviar Notificación al Colaborador</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {trainee.certificateId && (
              <button
                onClick={() => onOpenCertificate(trainee.certificateId!, trainee)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4" />
                <span>Ver Diploma Oficial Actual</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-semibold text-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
