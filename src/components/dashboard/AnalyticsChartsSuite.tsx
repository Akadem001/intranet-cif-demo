import React, { useState } from 'react';
import { 
  TrendingUp, 
  PieChart, 
  BarChart2, 
  Calendar, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Filter
} from 'lucide-react';
import { KPIStats, Trainee } from '../../types';

interface AnalyticsChartsSuiteProps {
  kpis: KPIStats;
  trainees: Trainee[];
  onFilterByCompany?: (company: string) => void;
  onFilterByStatus?: (status: string) => void;
  selectedArea: string;
  selectedStatus: string;
}

export const AnalyticsChartsSuite: React.FC<AnalyticsChartsSuiteProps> = ({
  kpis,
  trainees,
  onFilterByCompany,
  onFilterByStatus,
  selectedArea,
  selectedStatus,
}) => {
  const [activeChartPeriod, setActiveChartPeriod] = useState<'year' | 'q4'>('year');
  const [hoveredMonth, setHoveredMonth] = useState<{
    month: string;
    real: number;
    meta: number;
    variance: string;
  } | null>(null);

  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);

  // Monthly Hours Data for 2026 (Ene - Oct)
  const monthlyData = [
    { month: 'Ene', real: 1250, meta: 1200, variance: '+4.1%' },
    { month: 'Feb', real: 1420, meta: 1350, variance: '+5.2%' },
    { month: 'Mar', real: 1980, meta: 1800, variance: '+10.0%' },
    { month: 'Abr', real: 2150, meta: 2000, variance: '+7.5%' },
    { month: 'May', real: 2050, meta: 2000, variance: '+2.5%' },
    { month: 'Jun', real: 2320, meta: 2100, variance: '+10.4%' },
    { month: 'Jul', real: 1850, meta: 1900, variance: '-2.6%' },
    { month: 'Ago', real: 2400, meta: 2200, variance: '+9.1%' },
    { month: 'Sep', real: 2110, meta: 2000, variance: '+5.5%' },
    { month: 'Oct', real: 1120, meta: 1050, variance: '+6.6%' },
  ];

  // Max value for scaling SVG line chart
  const maxHours = 2600;
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;
  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingY * 2;

  // Calculate points for the real line & area
  const points = monthlyData.map((d, index) => {
    const x = paddingX + (index / (monthlyData.length - 1)) * chartInnerWidth;
    const y = svgHeight - paddingY - (d.real / maxHours) * chartInnerHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, index) => {
    return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Calculate points for meta line
  const metaPoints = monthlyData.map((d, index) => {
    const x = paddingX + (index / (monthlyData.length - 1)) * chartInnerWidth;
    const y = svgHeight - paddingY - (d.meta / maxHours) * chartInnerHeight;
    return { x, y };
  });

  const metaPathD = metaPoints.reduce((acc, curr, index) => {
    return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Subsidiary performance bars
  const companyData = [
    {
      name: 'Minera Centinela',
      label: 'Faenas y Concentradora',
      rate: 92,
      hours: '7.840 hrs',
      collaborators: 420,
      color: 'bg-blue-600',
    },
    {
      name: 'Banco Austral',
      label: 'Banca y Compliance',
      rate: 95,
      hours: '4.920 hrs',
      collaborators: 310,
      color: 'bg-emerald-600',
    },
    {
      name: 'Retail Andino',
      label: 'Centros Distribución',
      rate: 81,
      hours: '4.210 hrs',
      collaborators: 390,
      color: 'bg-amber-500',
    },
    {
      name: 'CIF EdTech Holding',
      label: 'Oficina Central & TI',
      rate: 96,
      hours: '1.680 hrs',
      collaborators: 300,
      color: 'bg-indigo-600',
    },
  ];

  // Pipeline status distribution
  const statusSegments = [
    {
      id: 'certificado_emitido',
      label: 'Certificado Emitido',
      count: 965,
      percent: 68,
      color: '#10b981', // emerald-500
      strokeClass: 'stroke-emerald-500',
      bgClass: 'bg-emerald-500',
    },
    {
      id: 'evaluacion_pendiente',
      label: 'Evaluación Pendiente',
      count: 227,
      percent: 16,
      color: '#3b82f6', // blue-500
      strokeClass: 'stroke-blue-500',
      bgClass: 'bg-blue-500',
    },
    {
      id: 'en_progreso',
      label: 'En Progreso',
      count: 171,
      percent: 12,
      color: '#f59e0b', // amber-500
      strokeClass: 'stroke-amber-500',
      bgClass: 'bg-amber-500',
    },
    {
      id: 'iniciado',
      label: 'Iniciado (Reciente)',
      count: 57,
      percent: 4,
      color: '#94a3b8', // slate-400
      strokeClass: 'stroke-slate-400',
      bgClass: 'bg-slate-400',
    },
  ];

  // Donut SVG circumference calculation
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~376.99
  let accumulatedPercent = 0;

  // Course programs metrics
  const programMetrics = [
    {
      code: 'PRR-2026',
      title: 'Prevención de Riesgos (Ley 16.744)',
      completion: 92.4,
      hours: 24,
      score: 6.4,
      senceCode: 'SENCE-2026-9901',
    },
    {
      code: 'CMP-2026',
      title: 'Compliance & Delitos Económicos',
      completion: 93.1,
      hours: 18,
      score: 6.8,
      senceCode: 'SENCE-2026-9902',
    },
    {
      code: 'SEC-2026',
      title: 'Ciberseguridad ISO 27001',
      completion: 91.9,
      hours: 20,
      score: 6.5,
      senceCode: 'SENCE-2026-9903',
    },
    {
      code: 'IND-2026',
      title: 'Inducción & Cultura Corporativa',
      completion: 90.8,
      hours: 16,
      score: 6.6,
      senceCode: 'SENCE-2026-9904',
    },
    {
      code: 'LID-2026',
      title: 'Liderazgo Ágil en Operaciones',
      completion: 77.9,
      hours: 32,
      score: 6.7,
      senceCode: 'SENCE-2026-9905',
    },
    {
      code: 'CAL-2026',
      title: 'Gestión Calidad ISO 9001',
      completion: 70.0,
      hours: 28,
      score: 6.3,
      senceCode: 'SENCE-2026-9906',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Visual Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Analítica Visual de Rendimiento y Franquicia SENCE
          </h2>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded font-semibold">
            BI CONECTADO
          </span>
        </div>

        {/* Quick chart period selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveChartPeriod('year')}
            className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer ${
              activeChartPeriod === 'year'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anual 2026 (Consolidado)
          </button>
          <button
            onClick={() => setActiveChartPeriod('q4')}
            className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer ${
              activeChartPeriod === 'q4'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Último Trimestre Q4
          </button>
        </div>
      </div>

      {/* Row 1: Area Chart (Hours Trend) + Donut Chart (Pipeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Curva de Horas SENCE (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Evolución Mensual de Horas Capacitadas SENCE (2026)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativa de horas cronológicas ejecutadas vs meta presupuestaria del Directorio.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-600 rounded-full" />
                <span className="text-slate-600 font-medium">Horas Reales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span className="text-slate-400 font-medium">Meta Directorio</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Area Chart */}
          <div className="relative w-full pt-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 sm:h-52 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                  <stop offset="80%" stopColor="#2563eb" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 650, 1300, 1950, 2600].map((val, idx) => {
                const y = svgHeight - paddingY - (val / maxHours) * chartInnerHeight;
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-slate-400 font-mono tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area fill under curve */}
              <path d={areaD} fill="url(#hoursGradient)" />

              {/* Target / Meta dashed line */}
              <path
                d={metaPathD}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Real curve path */}
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points on curve */}
              {points.map((pt, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredMonth(pt)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    className="fill-white stroke-blue-600 stroke-2 group-hover:r-6 group-hover:fill-blue-600 transition-all"
                  />
                  {/* Month Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-medium"
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredMonth ? (
              <div className="absolute top-2 right-4 bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs shadow-xl border border-slate-700 flex items-center gap-3 pointer-events-none animate-fadeIn">
                <div>
                  <span className="font-bold text-blue-400">{hoveredMonth.month} 2026:</span>
                  <span className="ml-1.5 tabular-nums font-mono">{hoveredMonth.real.toLocaleString('es-CL')} hrs</span>
                </div>
                <div className="text-slate-400 border-l border-slate-700 pl-3">
                  Meta: {hoveredMonth.meta} hrs ({hoveredMonth.variance})
                </div>
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 tabular-nums">18.650 hrs totales</span>
                  <span>acumuladas en el ejercicio</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  +6.8% sobre proyección presupuestaria
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Pipeline de Aprendizaje / Donut Chart (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Pipeline de Avance
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">1.420 alumnos</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Distribución por etapa del proceso formativo corporativo.
            </p>

            {/* Donut graphic */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="150" height="150" viewBox="0 0 160 160" className="transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  className="stroke-slate-100"
                  strokeWidth="18"
                  fill="none"
                />

                {statusSegments.map((seg) => {
                  const strokeDasharray = `${(seg.percent / 100) * donutCircumference} ${donutCircumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * donutCircumference);
                  accumulatedPercent += seg.percent;

                  return (
                    <circle
                      key={seg.id}
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      stroke={seg.color}
                      strokeWidth="18"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="none"
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      onMouseEnter={() => setHoveredDonutSegment(seg.label)}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                      onClick={() => onFilterByStatus && onFilterByStatus(seg.id)}
                    />
                  );
                })}
              </svg>

              {/* Center stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {kpis.completionRate}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {hoveredDonutSegment || 'Aprobados'}
                </span>
              </div>
            </div>

            {/* Legend with interactive click filter */}
            <div className="space-y-1.5 text-xs">
              {statusSegments.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => onFilterByStatus && onFilterByStatus(s.id)}
                  className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                    selectedStatus === s.id
                      ? 'bg-blue-50 font-semibold text-blue-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.bgClass}`} />
                    <span className="text-xs truncate">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-semibold text-slate-900">{s.percent}%</span>
                    <span className="text-[11px] text-slate-400">({s.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center italic border-t border-slate-100">
            Haga clic en un segmento para filtrar la tabla
          </div>
        </div>
      </div>

      {/* Row 2: Performance por Filial / Empresa (Horizontal Bars) + Program Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Horizontal Bars: Cumplimiento por Filial */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Cumplimiento y Horas por Filial Corporativa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Benchmark frente a la meta anual fijada por el Directorio (85%).
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Meta: 85%
            </span>
          </div>

          <div className="space-y-4">
            {companyData.map((comp) => {
              const isSelected = selectedArea.toLowerCase().includes(comp.name.toLowerCase().split(' ')[0]);

              return (
                <div
                  key={comp.name}
                  onClick={() => onFilterByCompany && onFilterByCompany(comp.name)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-sm'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div>
                      <span className="font-bold text-slate-900">{comp.name}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">({comp.label})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                        {comp.hours}
                      </span>
                      <span className="font-bold text-xs text-slate-900 tabular-nums">
                        {comp.rate}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with 85% Benchmark Marker */}
                  <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${comp.color} rounded-full transition-all duration-500`}
                      style={{ width: `${comp.rate}%` }}
                    />
                    {/* Benchmark dotted line at 85% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
                      style={{ left: '85%' }}
                      title="Meta Directorio: 85%"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{comp.collaborators} colaboradores</span>
                    <span className={comp.rate >= 85 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                      {comp.rate >= 85 ? 'Meta cumplida (+)' : 'En seguimiento (-)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Matrix Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Trazabilidad por Programa de Formación 2026
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Avance curricular y promedio de calificación en Campus Moodle.
              </p>
            </div>
            <Award className="w-4 h-4 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {programMetrics.map((prog) => (
              <div
                key={prog.code}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    {prog.code}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {prog.score.toFixed(1)}/7.0
                  </span>
                </div>
                <div className="font-semibold text-xs text-slate-800 line-clamp-1">
                  {prog.title}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Aprobación</span>
                  <strong className="text-slate-800 tabular-nums">{prog.completion}%</strong>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${prog.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% de cursos validados bajo código SENCE</span>
            </span>
            <span className="font-semibold text-slate-800">Sincronizado vía API REST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
