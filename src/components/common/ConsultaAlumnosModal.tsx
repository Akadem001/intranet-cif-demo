import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Users, 
  Award, 
  FileCheck2, 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Download, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Course, ProcessStatus, Trainee } from '../../types';

interface ConsultaAlumnosModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainees: Trainee[];
  courses: Course[];
  initialCourseFilter?: string;
  onSelectTrainee: (trainee: Trainee) => void;
  onOpenCertificate: (certificateId: string, trainee: Trainee) => void;
  onOpenSyllabus?: (course: Course) => void;
}

export const ConsultaAlumnosModal: React.FC<ConsultaAlumnosModalProps> = ({
  isOpen,
  onClose,
  trainees,
  courses,
  initialCourseFilter = 'all',
  onSelectTrainee,
  onOpenCertificate,
  onOpenSyllabus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [filterCourse, setFilterCourse] = useState(initialCourseFilter);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAffidavit, setFilterAffidavit] = useState('all');

  // Sync if initialCourseFilter changes when modal opens
  React.useEffect(() => {
    if (initialCourseFilter) {
      setFilterCourse(initialCourseFilter);
    }
  }, [initialCourseFilter]);

  if (!isOpen) return null;

  const resetFilters = () => {
    setSearchTerm('');
    setFilterEmpresa('all');
    setFilterArea('all');
    setFilterCourse('all');
    setFilterStatus('all');
    setFilterAffidavit('all');
  };

  const availableAreas = Array.from(new Set(trainees.map((t) => t.area)));

  const filteredTrainees = trainees.filter((t) => {
    // Search term in name, rut, email, cargo
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.rut.toLowerCase().replace(/\./g, '').includes(q.replace(/\./g, '')) ||
        t.email.toLowerCase().includes(q) ||
        t.cargo.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Filter Empresa
    if (filterEmpresa !== 'all' && t.empresa !== filterEmpresa) return false;

    // Filter Area
    if (filterArea !== 'all' && t.area !== filterArea) return false;

    // Filter Course
    if (filterCourse !== 'all' && t.courseName !== filterCourse) return false;

    // Filter Status
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;

    // Filter Affidavit
    if (filterAffidavit !== 'all' && t.affidavitStatus !== filterAffidavit) return false;

    return true;
  });

  // Calculate live stats for filtered set
  const totalCount = filteredTrainees.length;
  const certifiedCount = filteredTrainees.filter((t) => t.status === 'certificado_emitido').length;
  const totalHours = filteredTrainees.reduce((acc, curr) => acc + curr.hoursCompleted, 0);
  const avgGrade = totalCount > 0
    ? (filteredTrainees.reduce((acc, curr) => acc + curr.grade, 0) / totalCount).toFixed(1)
    : '0.0';

  const handleExportCSV = () => {
    const headers = ['RUT', 'Nombre', 'Empresa', 'Faena', 'Área', 'Cargo', 'Curso', 'Avance %', 'Horas', 'Nota', 'Declaración Jurada', 'Folio Certificado'];
    const rows = filteredTrainees.map((t) => [
      `"${t.rut}"`,
      `"${t.name}"`,
      `"${t.empresa}"`,
      `"${t.faena || 'Casa Central'}"`,
      `"${t.area}"`,
      `"${t.cargo}"`,
      `"${t.courseName}"`,
      t.progress,
      t.hoursCompleted,
      t.grade,
      `"${t.affidavitStatus}"`,
      `"${t.certificateId || 'Pendiente'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Consulta_Alumnos_CIF_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCompanyBadgeClass = (emp: string) => {
    if (emp.includes('Geotec')) return 'bg-amber-100 text-amber-900 border-amber-200';
    if (emp.includes('Centinela')) return 'bg-blue-100 text-blue-900 border-blue-200';
    return 'bg-emerald-100 text-emerald-900 border-emerald-200';
  };

  const getStatusBadge = (st: ProcessStatus) => {
    switch (st) {
      case 'certificado_emitido':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Certificado Emitido</span>;
      case 'en_progreso':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"><Clock className="w-3 h-3" /> En Progreso</span>;
      case 'evaluacion_pendiente':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"><AlertTriangle className="w-3 h-3" /> Evaluación Pendiente</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Iniciado</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Centro de Consulta por Alumnos y Colaboradores
                </h2>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-2 py-0.5 rounded-full">
                  Holding Corporativo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Búsqueda avanzada, historial académico, trazabilidad SENCE y acceso a Hoja de Vida 360°
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-slate-700"
              title="Exportar listado actual a formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar ({totalCount})</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {/* Main search and reset */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nombre, RUT (ej. 18.904.512-3), Cargo o Correo..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
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
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          {/* Granular dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {/* Empresa */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Empresa Filial</label>
              <select
                value={filterEmpresa}
                onChange={(e) => setFilterEmpresa(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">Todas las Empresas (3)</option>
                <option value="Geotec Boyles Bros">Geotec Boyles Bros</option>
                <option value="Minera Centinela">Minera Centinela</option>
                <option value="Retail Andino & Logística">Retail Andino & Logística</option>
              </select>
            </div>

            {/* Curso */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Curso Asignado</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm truncate"
              >
                <option value="all">Todos los Cursos</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.code} · {c.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Área / Gerencia</label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">Todas las Áreas</option>
                {availableAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado Académico */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Estado de Avance</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">Todos los Estados</option>
                <option value="certificado_emitido">Certificado Emitido</option>
                <option value="en_progreso">En Progreso</option>
                <option value="evaluacion_pendiente">Evaluación Pendiente</option>
                <option value="iniciado">Iniciado</option>
              </select>
            </div>

            {/* Declaración Jurada */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Declaración Jurada</label>
              <select
                value={filterAffidavit}
                onChange={(e) => setFilterAffidavit(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">Cualquier Estado DJ</option>
                <option value="firmada">Firmada (Vigente)</option>
                <option value="pendiente">Pendiente de Firma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip for Current Query */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500">Resultados:</span>{' '}
              <strong className="text-slate-900 font-bold">{totalCount}</strong> colaboradores
            </div>
            <div>
              <span className="text-slate-500">Certificados:</span>{' '}
              <strong className="text-emerald-700 font-bold">{certifiedCount}</strong> ({totalCount > 0 ? Math.round((certifiedCount / totalCount) * 100) : 0}%)
            </div>
            <div>
              <span className="text-slate-500">Horas Acumuladas SENCE:</span>{' '}
              <strong className="text-blue-900 font-bold tabular-nums">{totalHours.toLocaleString('es-CL')} hrs</strong>
            </div>
            <div>
              <span className="text-slate-500">Nota Promedio:</span>{' '}
              <strong className="text-slate-900 font-bold font-mono">{avgGrade}/7.0</strong>
            </div>
          </div>

          <div className="text-[11px] text-blue-700 font-medium hidden md:block">
            Haz clic en "Hoja de Vida 360°" para inspeccionar la trayectoria completa del alumno
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredTrainees.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">No se encontraron colaboradores</div>
              <p className="text-xs text-slate-500 mt-1">
                Prueba ajustando los términos de búsqueda o limpiando los filtros seleccionados.
              </p>
              <button
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 bg-white border border-slate-200 text-xs text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            filteredTrainees.map((trainee) => {
              const assignedCourseObj = courses.find((c) => c.title === trainee.courseName);

              return (
                <div
                  key={trainee.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Identity and Company */}
                  <div className="flex items-start gap-3 min-w-[280px]">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shrink-0">
                      {trainee.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{trainee.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getCompanyBadgeClass(trainee.empresa)}`}>
                          {trainee.empresa.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-mono text-slate-700 font-medium">RUT: {trainee.rut}</span>
                        <span className="mx-1.5">·</span>
                        <span>{trainee.cargo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {trainee.faena || 'Faena Central'}
                        </span>
                        <span>·</span>
                        <span>{trainee.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Course & Academic Progress */}
                  <div className="flex-1 min-w-[240px] px-0 md:px-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 truncate max-w-[260px]" title={trainee.courseName}>
                        {trainee.courseName}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{trainee.progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          trainee.progress >= 85 ? 'bg-emerald-500' : trainee.progress >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${trainee.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{trainee.hoursCompleted} / {trainee.totalHours} hrs SENCE</span>
                      <span className="font-mono font-bold text-slate-800">Nota: {trainee.grade.toFixed(1)}</span>
                      {getStatusBadge(trainee.status)}
                    </div>
                  </div>

                  {/* Right: Actions and Certificates */}
                  <div className="flex items-center md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 pl-0 md:pl-3">
                    <button
                      onClick={() => {
                        onSelectTrainee(trainee);
                        onClose();
                      }}
                      className="flex-1 md:w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hoja de Vida 360°</span>
                    </button>

                    <div className="flex items-center gap-1.5 w-full">
                      {trainee.certificateId ? (
                        <button
                          onClick={() => {
                            onOpenCertificate(trainee.certificateId!, trainee);
                            onClose();
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          title={`Ver Diploma Oficial ${trainee.certificateId}`}
                        >
                          <Award className="w-3 h-3 text-emerald-600" />
                          <span>Diploma QR</span>
                        </button>
                      ) : (
                        <span className="flex-1 text-center text-[10px] text-slate-400 py-1 bg-slate-50 rounded border border-slate-200">
                          Sin Diploma
                        </span>
                      )}

                      {assignedCourseObj && onOpenSyllabus && (
                        <button
                          onClick={() => {
                            onOpenSyllabus(assignedCourseObj);
                            onClose();
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Ver Malla Curricular / Syllabus del Curso"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
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
            Mostrando <strong>{filteredTrainees.length}</strong> de <strong>{trainees.length}</strong> colaboradores registrados en el Holding
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
