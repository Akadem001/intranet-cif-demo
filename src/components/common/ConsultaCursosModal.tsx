import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Layers, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Building2, 
  FileText, 
  Sparkles,
  RotateCcw,
  GraduationCap,
  HardHat
} from 'lucide-react';
import { Course, Trainee } from '../../types';

interface ConsultaCursosModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  trainees: Trainee[];
  onOpenSyllabus: (course: Course) => void;
  onViewCourseTrainees: (courseTitle: string) => void;
  onNavigateToMoodle?: () => void;
}

export const ConsultaCursosModal: React.FC<ConsultaCursosModalProps> = ({
  isOpen,
  onClose,
  courses,
  trainees,
  onOpenSyllabus,
  onViewCourseTrainees,
  onNavigateToMoodle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');

  if (!isOpen) return null;

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  const filteredCourses = courses.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterCategory !== 'all' && c.category !== filterCategory) return false;

    if (filterCompany !== 'all') {
      if (filterCompany === 'Geotec' && !c.code.includes('SOND') && !c.description.includes('Geotec')) return false;
      if (filterCompany === 'Centinela' && !c.code.includes('PRR') && !c.description.includes('Seguridad')) return false;
      if (filterCompany === 'Retail' && !c.code.includes('LID') && !c.code.includes('IND')) return false;
    }

    return true;
  });

  const totalCourses = filteredCourses.length;
  const totalHours = filteredCourses.reduce((acc, curr) => acc + curr.durationHours, 0);
  const totalEnrolled = filteredCourses.reduce((acc, curr) => acc + curr.enrolledCount, 0);
  const avgCompletion = totalCourses > 0
    ? Math.round(
        (filteredCourses.reduce((acc, curr) => acc + (curr.completedCount / curr.enrolledCount) * 100, 0)) /
          totalCourses
      )
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Centro de Consulta de Cursos y Mallas Curriculares
                </h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                  Catálogo Oficial SENCE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Programas técnicos, horas HT/HP/EPT, vinculación con Moodle LMS y seguimiento de cohortes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nombre del curso, Código (ej. RT-SOND-A0, PRR-2026), Relator o Temas..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
              >
                <option value="all">Todas las Empresas Holding</option>
                <option value="Geotec">Geotec Boyles Bros (Sondaje)</option>
                <option value="Centinela">Minera Centinela (Operación)</option>
                <option value="Retail">Retail Andino (Logística)</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterCompany('all');
                }}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Limpiar filtros"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Summary */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500">Cursos Mostrados:</span>{' '}
              <strong className="text-slate-900 font-bold">{totalCourses}</strong> programas
            </div>
            <div>
              <span className="text-slate-500">Horas Pedagógicas Totales:</span>{' '}
              <strong className="text-indigo-900 font-bold tabular-nums">{totalHours} hrs</strong>
            </div>
            <div>
              <span className="text-slate-500">Matrícula Acumulada:</span>{' '}
              <strong className="text-slate-900 font-bold tabular-nums">{totalEnrolled.toLocaleString('es-CL')} cupos</strong>
            </div>
            <div>
              <span className="text-slate-500">Tasa de Aprobación Global:</span>{' '}
              <strong className="text-emerald-700 font-bold">{avgCompletion}%</strong>
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 font-medium hidden md:block">
            Haz clic en "Ver Malla Curricular" para examinar el syllabus oficial y competencias
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">No se encontraron cursos con los filtros actuales</div>
              <p className="text-xs text-slate-500 mt-1">
                Intenta buscar por otro término o restablece los filtros.
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => {
              // Count how many trainees in mock are currently taking this course
              const enrolledTraineesCount = trainees.filter((t) => t.courseName === course.title).length;
              const hasCurriculumMalla = !!course.curriculumMalla;
              const isGeotecCourse = course.code.includes('SOND');

              return (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-2xl p-5 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-5 group"
                >
                  {/* Left Side: Course Info & Badges */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {course.category}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {course.durationHours} horas cronológicas
                      </span>
                      {isGeotecCourse && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <HardHat className="w-3 h-3 text-amber-600" />
                          Simulador CT-20 · Geotec
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed text-justify">
                        {course.description}
                      </p>
                    </div>

                    {/* Modular breakdown preview */}
                    {course.modules && course.modules.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          <span>Estructura de Módulos Formativos:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {course.modules.map((mod, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5"
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="truncate">{mod}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span><strong>Docente / Relator:</strong> {course.instructor}</span>
                      <span><strong>Plataforma:</strong> Campus Moodle LMS CIF</span>
                    </div>
                  </div>

                  {/* Right Side: KPIs and Action Buttons */}
                  <div className="w-full lg:w-72 shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
                    {/* Metrics */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Matriculados OTEC:</span>
                        <strong className="text-slate-900 font-bold tabular-nums">{course.enrolledCount} alumnos</strong>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Aprobados / Certificados:</span>
                        <strong className="text-emerald-700 font-bold tabular-nums">{course.completedCount} alumnos</strong>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                          <span>Tasa de Aprobación:</span>
                          <span className="font-bold tabular-nums text-slate-800">
                            {Math.round((course.completedCount / course.enrolledCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.round((course.completedCount / course.enrolledCount) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                        <span className="text-slate-500">Calificación Promedio:</span>
                        <strong className="text-slate-900 font-mono font-bold">{course.averageScore.toFixed(1)} / 7.0</strong>
                      </div>

                      {enrolledTraineesCount > 0 && (
                        <div className="text-[11px] bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-2 text-center">
                          <strong>{enrolledTraineesCount} alumnos</strong> de la muestra activa cursan este programa actualmente
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          onOpenSyllabus(course);
                          onClose();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ver Malla Curricular / Syllabus</span>
                      </button>

                      <button
                        onClick={() => {
                          onViewCourseTrainees(course.title);
                          onClose();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-600" />
                        <span>Consultar Alumnos de este Curso</span>
                      </button>

                      {onNavigateToMoodle && (
                        <button
                          onClick={() => {
                            onNavigateToMoodle();
                            onClose();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1 text-slate-500 hover:text-slate-800 text-[11px] transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ir al Aula en Campus Moodle</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 px-5">
          <span>
            Catálogo Corporativo OTEC Holding · <strong>{courses.length}</strong> programas vigentes homologados SENCE
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};
