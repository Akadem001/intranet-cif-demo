import React, { useState } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Users, 
  Clock, 
  BookOpen, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Check, 
  Download,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { Course } from '../../types';

interface MoodleLmsModuleProps {
  courses: Course[];
  onSelectCourseSyllabus: (course: Course) => void;
  onNavigateToMalla?: () => void;
}

export const MoodleLmsModule: React.FC<MoodleLmsModuleProps> = ({
  courses,
  onSelectCourseSyllabus,
  onNavigateToMalla,
}) => {
  const [syncingCourseId, setSyncingCourseId] = useState<string | null>(null);
  const [syncSuccessId, setSyncSuccessId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [globalSyncing, setGlobalSyncing] = useState(false);
  const [globalSyncSuccess, setGlobalSyncSuccess] = useState(false);

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const handleSyncCourse = (courseId: string) => {
    setSyncingCourseId(courseId);
    setTimeout(() => {
      setSyncingCourseId(null);
      setSyncSuccessId(courseId);
      setTimeout(() => setSyncSuccessId(null), 3000);
    }, 800);
  };

  const handleGlobalSync = () => {
    setGlobalSyncing(true);
    setTimeout(() => {
      setGlobalSyncing(false);
      setGlobalSyncSuccess(true);
      setTimeout(() => setGlobalSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Módulo 3
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Campus Virtual Moodle Corporativo
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión visual y enlace directo a las aulas interactivas, foros, evaluaciones y materiales de estudio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGlobalSync}
            disabled={globalSyncing}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${globalSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{globalSyncing ? 'Sincronizando Moodle...' : 'Sincronizar Calificaciones'}</span>
          </button>

          <a
            href="https://campus.cif.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Ingresar al Aula Virtual (SSO)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Global Sync Feedback Toast */}
      {globalSyncSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Sincronización Moodle exitosa: 6 cursos y 1,765 registros de actividad actualizados en tiempo real.
            </span>
          </div>
        </div>
      )}

      {/* Corporate Server Status & Integration Metrics */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Moodle LMS Core 4.3 Enterprise
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-2 py-0.5 rounded-full">
                En Línea
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Servidor dedicado con autenticación centralizada (Single Sign-On SAML 2.0).
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-3">
              <span>Dominio: <strong className="text-white font-mono text-[11px]">campus.cif.cl</strong></span>
              <span>·</span>
              <span>Latencia API: <strong className="text-emerald-400">18 ms</strong></span>
              <span>·</span>
              <span>Disponibilidad SLA: <strong className="text-white">99.98%</strong></span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center gap-4 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Capacidad Activa</div>
            <div className="text-sm font-bold text-white mt-0.5">2,500 Usuarios Simultáneos</div>
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos los Cursos ({courses.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Mostrando {filteredCourses.length} cursos corporativos
        </span>
      </div>

      {/* Active Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isSyncing = syncingCourseId === course.id;
          const isSuccess = syncSuccessId === course.id;
          const completionPercentage = Math.round(
            (course.completedCount / course.enrolledCount) * 100
          );

          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Course Banner Strip */}
                <div className={`h-24 bg-gradient-to-r ${course.bannerColor} p-4 flex flex-col justify-between text-white relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-[11px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                      {course.category}
                    </span>
                  </div>
                  <div className="text-xs text-white/80">
                    Docente: {course.instructor}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <div className="text-[10px] text-slate-500">Duración</div>
                      <div className="font-bold text-xs text-slate-800 tabular-nums">
                        {course.durationHours} hrs
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <div className="text-[10px] text-slate-500">Inscritos</div>
                      <div className="font-bold text-xs text-slate-800 tabular-nums">
                        {course.enrolledCount}
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <div className="text-[10px] text-slate-500">Promedio</div>
                      <div className="font-bold text-xs text-emerald-700 font-mono tabular-nums">
                        {course.averageScore.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Tasa de Finalización</span>
                      <span className="font-semibold text-slate-800">{completionPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectCourseSyllabus(course)}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ver Módulos</span>
                  </button>

                  <button
                    onClick={() => handleSyncCourse(course.id)}
                    disabled={isSyncing}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Al día</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                        <span>{isSyncing ? 'Sincronizando' : 'Sincronizar'}</span>
                      </>
                    )}
                  </button>
                </div>

                {course.curriculumMalla && onNavigateToMalla && (
                  <button
                    onClick={onNavigateToMalla}
                    className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-rose-600" />
                    <span>Ver Malla Curricular (52 hrs · 4 Módulos)</span>
                  </button>
                )}

                <a
                  href={course.moodleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Ingresar al Aula de este Curso</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
