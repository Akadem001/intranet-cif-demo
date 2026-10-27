import React, { useState, useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ArrowUpDown, 
  Eye, 
  BellRing, 
  Award,
  AlertCircle,
  FileCheck2,
  RefreshCw,
  Sparkles,
  Building2,
  DollarSign,
  GraduationCap,
  Briefcase,
  User,
  ShieldCheck,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { AuthUser, KPIStats, ProcessStatus, Trainee } from '../../types';
import { AnalyticsChartsSuite } from '../dashboard/AnalyticsChartsSuite';
import { HOLDING_COMPANIES } from '../../data/mockData';

interface DashboardDirectorioProps {
  currentUser: AuthUser;
  trainees: Trainee[];
  kpis: KPIStats;
  onOpenReportModal: () => void;
  onSelectTrainee: (trainee: Trainee) => void;
  onOpenCertificate: (certificateId: string, trainee: Trainee) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigateToMalla?: () => void;
  onOpenConsultaAlumnos?: () => void;
  onOpenConsultaCursos?: () => void;
}

export const DashboardDirectorio: React.FC<DashboardDirectorioProps> = ({
  currentUser,
  trainees,
  kpis,
  onOpenReportModal,
  onSelectTrainee,
  onOpenCertificate,
  searchTerm,
  onSearchChange,
  onNavigateToMalla,
  onOpenConsultaAlumnos,
  onOpenConsultaCursos,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedHoldingCompany, setSelectedHoldingCompany] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'docencia' | 'operaciones' | 'comercial' | 'finanzas'>('all');
  const [sortField, setSortField] = useState<keyof Trainee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If user is usuario_privilegiado with restricted areas, filter their default view
  const isPrivilegedUser = currentUser.role === 'usuario_privilegiado';
  const userAllowedAreas = currentUser.assignedAreas || [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFilterByCompany = (companyName: string) => {
    if (selectedArea === companyName) {
      setSelectedArea('all');
    } else {
      setSelectedArea(companyName);
    }
  };

  const handleFilterByStatus = (statusId: string) => {
    if (selectedStatus === statusId) {
      setSelectedStatus('all');
    } else {
      setSelectedStatus(statusId);
    }
  };

  // Unique lists for filter dropdowns
  const availableAreas = useMemo(() => {
    const areas = Array.from(new Set(trainees.map((t) => t.area)));
    return areas;
  }, [trainees]);

  const availableCourses = useMemo(() => {
    const courses = Array.from(new Set(trainees.map((t) => t.courseName)));
    return courses;
  }, [trainees]);

  // Filtered and sorted trainees
  const filteredTrainees = useMemo(() => {
    return trainees
      .filter((t) => {
        // If privileged user has assigned areas, restrict
        if (isPrivilegedUser && userAllowedAreas.length > 0) {
          if (!userAllowedAreas.includes(t.area)) return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = t.name.toLowerCase().includes(q);
          const matchRut = t.rut.toLowerCase().includes(q);
          const matchCourse = t.courseName.toLowerCase().includes(q);
          const matchEmpresa = t.empresa.toLowerCase().includes(q);
          const matchArea = t.area.toLowerCase().includes(q);
          if (!matchName && !matchRut && !matchCourse && !matchEmpresa && !matchArea) {
            return false;
          }
        }

        // Holding Company filter
        if (selectedHoldingCompany !== 'all' && t.empresa !== selectedHoldingCompany) return false;

        // Area or Company filter
        if (selectedArea !== 'all' && t.area !== selectedArea && t.empresa !== selectedArea) return false;

        // Status filter
        if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;

        // Course filter
        if (selectedCourse !== 'all' && t.courseName !== selectedCourse) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
      });
  }, [
    trainees,
    isPrivilegedUser,
    userAllowedAreas,
    searchTerm,
    selectedArea,
    selectedStatus,
    selectedCourse,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: keyof Trainee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'RUT',
      'Nombre',
      'Empresa',
      'Área',
      'Cargo',
      'Curso',
      'Estado',
      'Progreso (%)',
      'Horas Completadas',
      'Horas Totales',
      'Calificación',
      'Declaración Jurada',
      'Folio Certificado',
    ];

    const rows = filteredTrainees.map((t) => [
      `"${t.rut}"`,
      `"${t.name}"`,
      `"${t.empresa}"`,
      `"${t.area}"`,
      `"${t.cargo}"`,
      `"${t.courseName}"`,
      `"${t.status}"`,
      t.progress,
      t.hoursCompleted,
      t.totalHours,
      t.grade,
      `"${t.affidavitStatus}"`,
      `"${t.certificateId || 'N/A'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Informe_Capacitacion_CIF_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Archivo CSV generado y descargado exitosamente');
  };

  const handleSendReminder = (t: Trainee) => {
    showToast(`Recordatorio de avance enviado a ${t.email}`);
  };

  const getStatusBadge = (status: ProcessStatus) => {
    switch (status) {
      case 'iniciado':
        return (
          <span className="text-xs text-slate-600 font-medium">
            Iniciado
          </span>
        );
      case 'en_progreso':
        return (
          <span className="text-xs text-blue-700 font-semibold">
            En Progreso
          </span>
        );
      case 'evaluacion_pendiente':
        return (
          <span className="text-xs text-amber-700 font-semibold">
            Evaluación Pendiente
          </span>
        );
      case 'certificado_emitido':
        return (
          <span className="text-xs text-emerald-700 font-semibold">
            Certificado Emitido
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dashboard de Seguimiento y Reportería
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisión gerencial en tiempo real, trazabilidad de horas SENCE y avance por área corporativa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenConsultaAlumnos && (
            <button
              onClick={onOpenConsultaAlumnos}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Abrir buscador y ficha rápida de alumnos"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Consulta Alumnos ({trainees.length})</span>
            </button>
          )}

          {onOpenConsultaCursos && (
            <button
              onClick={onOpenConsultaCursos}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Abrir catálogo y consulta de cursos y mallas"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Consulta Cursos</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Informe para el Directorio</span>
          </button>
        </div>
      </div>

      {/* HOLDING CORPORATIVO: 3 EMPRESAS CLIENTES - COMPARATIVO ESTRATÉGICO */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Control Consolidado Holding · 3 Clientes Corporativos
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Filtrar vista por empresa del grupo:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card All Holding */}
          <div
            onClick={() => setSelectedHoldingCompany('all')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedHoldingCompany === 'all'
                ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                selectedHoldingCompany === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Consolidado
              </span>
              <span className="text-xs font-mono font-semibold">3 Filiales</span>
            </div>
            <div className="text-sm font-bold mt-2 truncate">
              Holding Corporativo
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              2,350 dotación total
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200/40 text-[11px]">
              <div>
                <span className="opacity-70 block text-[10px]">Capacitados</span>
                <span className="font-bold tabular-nums">711 (30.3%)</span>
              </div>
              <div>
                <span className="opacity-70 block text-[10px]">Franquicia 1%</span>
                <span className="font-bold text-emerald-400 tabular-nums">87.4%</span>
              </div>
            </div>
          </div>

          {/* 3 Companies Cards */}
          {HOLDING_COMPANIES.map((comp) => {
            const isSelected = selectedHoldingCompany === comp.name;

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedHoldingCompany(isSelected ? 'all' : comp.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${comp.badgeColor}`}>
                    {comp.shortName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {comp.alumnosCapacitados}/{comp.dotacionTotal} pers.
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-2 truncate">
                  {comp.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {comp.industry}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Horas SENCE</span>
                    <span className="font-bold text-slate-900 tabular-nums">{comp.horasEjecutadas.toLocaleString('es-CL')} h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Franquicia</span>
                    <span className="font-bold text-emerald-600 tabular-nums">{comp.franquiciaUtilizadaPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 PILARES ESTRATÉGICOS: GESTIÓN OTEC (DOCENCIA, OPERACIONES, COMERCIAL, FINANZAS) */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedPillar === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Todos los Indicadores</span>
          </button>

          <button
            onClick={() => setSelectedPillar('docencia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedPillar === 'docencia'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>1. Docencia & Alumnos 360°</span>
          </button>

          <button
            onClick={() => setSelectedPillar('operaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedPillar === 'operaciones'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Operaciones & LCE SENCE</span>
          </button>

          <button
            onClick={() => setSelectedPillar('comercial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedPillar === 'comercial'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. Comercial & Franquicia 1%</span>
          </button>

          <button
            onClick={() => setSelectedPillar('finanzas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedPillar === 'finanzas'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. Finanzas & Liquidación OTIC</span>
          </button>
        </div>

        {selectedHoldingCompany !== 'all' && (
          <button
            onClick={() => setSelectedHoldingCompany('all')}
            className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Restablecer a Holding Completo
          </button>
        )}
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Colaboradores Capacitados
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {kpis.totalTrained.toLocaleString('es-CL')}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {kpis.totalTrainedDelta}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Padrón activo en 4 filiales corporativas
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Programas & Cursos en Curso
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {kpis.activeCourses} Programas
            </span>
            <span className="text-xs text-slate-500">
              ({kpis.activeCohorts} cohortes)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Moodle LMS sincronizado hoy
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Tasa de Finalización Global
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {kpis.completionRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Meta: {kpis.targetCompletionRate}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {kpis.completionRateDelta}
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Horas Acumuladas SENCE
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {kpis.accumulatedHours.toLocaleString('es-CL')} hrs
            </span>
            <span className="text-xs text-slate-500">
              de {kpis.accumulatedHoursGoal.toLocaleString('es-CL')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            93.2% de franquicia tributaria ejecutada
          </p>
        </div>
      </div>

      {/* Secondary Strategic Ribbon */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              Cumplimiento Legal & Auditoría 2026
            </div>
            <div className="text-[11px] text-slate-400">
              Declaraciones Juradas firmadas: <span className="text-white font-medium">{kpis.affidavitsSignedRate}%</span> · Certificados oficiales emitidos: <span className="text-white font-medium">{kpis.certificatesIssuedCount}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span>Dirección de Capacitación al día para Directorio</span>
        </div>
      </div>

      {/* Malla Curricular Geotec Highlight Ribbon */}
      <div className="bg-gradient-to-r from-[#0e253e] via-[#1a5585] to-[#4d7da8] text-white rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 px-2 py-0.5 rounded text-white shadow-xs">
                Malla Curricular
              </span>
              <span className="text-xs font-semibold text-white">
                Ruta técnica · 4 módulos · 52 horas: Introducción al sondaje y a la industria de la exploración minera
              </span>
            </div>
            <div className="text-[11px] text-white/80 mt-1">
              Centro Internacional de Formación CIF &middot; Nivel A0 Aprendiz &middot; Geotec (24 HT / 28 HP / 0 EPT)
            </div>
          </div>
        </div>

        {onNavigateToMalla && (
          <button
            onClick={onNavigateToMalla}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Ver Malla Completa</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visual Analytics Suite (Charts) */}
      <AnalyticsChartsSuite
        kpis={kpis}
        trainees={trainees}
        selectedArea={selectedArea}
        selectedStatus={selectedStatus}
        onFilterByCompany={handleFilterByCompany}
        onFilterByStatus={handleFilterByStatus}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Quick Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrar por nombre, RUT, empresa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Area / Company Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todas las Áreas / Gerencias</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="iniciado">Iniciado</option>
              <option value="en_progreso">En Progreso</option>
              <option value="evaluacion_pendiente">Evaluación Pendiente</option>
              <option value="certificado_emitido">Certificado Emitido</option>
            </select>

            {/* Course Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer max-w-xs truncate"
            >
              <option value="all">Todos los Cursos</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {(selectedArea !== 'all' || selectedStatus !== 'all' || selectedCourse !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedArea('all');
                  setSelectedStatus('all');
                  setSelectedCourse('all');
                  onSearchChange('');
                }}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Limpiar filtros"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Mostrando <span className="font-semibold text-slate-800">{filteredTrainees.length}</span> colaboradores de <span className="font-semibold text-slate-800">{trainees.length}</span> en registro activo
          </div>
          {isPrivilegedUser && userAllowedAreas.length > 0 && (
            <div className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Vista filtrada por su rol: {userAllowedAreas.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Colaborador / RUT</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('empresa')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Empresa & Área</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('courseName')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Curso Asignado</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('progress')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Avance & Horas</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Estado del Proceso</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('grade')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Nota</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">
                      No se encontraron colaboradores con los filtros seleccionados
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Intente modificar el criterio de búsqueda o reiniciar los filtros.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTrainees.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* User and RUT */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {t.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-slate-500 tabular-nums">
                            RUT: {t.rut}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company and Area */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{t.empresa}</div>
                      <div className="text-[11px] text-slate-500">{t.area}</div>
                      {t.faena && (
                        <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{t.faena}</span>
                        </div>
                      )}
                    </td>

                    {/* Assigned Course */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-800 font-medium truncate" title={t.courseName}>
                        {t.courseName}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Último acceso: {t.lastAccess}</span>
                        <span>·</span>
                        <span className={t.affidavitStatus === 'firmada' ? 'text-emerald-600' : 'text-amber-600'}>
                          DJ: {t.affidavitStatus}
                        </span>
                      </div>
                    </td>

                    {/* Progress Bar & Hours */}
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-800 tabular-nums">
                          {t.progress}%
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          {t.hoursCompleted}/{t.totalHours} hrs
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            t.progress === 100
                              ? 'bg-emerald-500'
                              : t.progress >= 70
                              ? 'bg-blue-600'
                              : t.progress >= 40
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono text-xs font-semibold tabular-nums text-slate-800">
                        {t.grade.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/7.0</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectTrainee(t)}
                          title="Ver Hoja de Vida completa, historial de cursos y actividades"
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] border border-blue-200/80 shadow-xs"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Hoja de Vida</span>
                        </button>

                        <button
                          onClick={() => handleSendReminder(t)}
                          title="Enviar recordatorio automático de avance"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <BellRing className="w-4 h-4" />
                        </button>

                        {t.certificateId && (
                          <button
                            onClick={() => onOpenCertificate(t.certificateId!, t)}
                            title={`Ver Certificado Oficial (${t.certificateId})`}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
