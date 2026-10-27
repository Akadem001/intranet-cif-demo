import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  GraduationCap, 
  ExternalLink, 
  Printer, 
  CheckCircle2, 
  Users, 
  Award, 
  FileSpreadsheet, 
  Sparkles, 
  Sliders, 
  Maximize2, 
  Eye, 
  Compass, 
  Cpu, 
  Target,
  ArrowRight,
  Info,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CURRICULUM_MALLA_SONDAJE } from '../../data/mockData';
import { MallaModuleDetail, Trainee, Course } from '../../types';

interface MallaCurricularModuleProps {
  trainees: Trainee[];
  course?: Course;
  onSelectTrainee?: (trainee: Trainee) => void;
  onOpenSyllabus?: () => void;
}

export const MallaCurricularModule: React.FC<MallaCurricularModuleProps> = ({
  trainees,
  course,
  onSelectTrainee,
  onOpenSyllabus,
}) => {
  const malla = CURRICULUM_MALLA_SONDAJE;
  const [selectedModule, setSelectedModule] = useState<MallaModuleDetail | null>(null);
  const [activeView, setActiveView] = useState<'slide' | 'competencies' | 'trainees' | 'original'>('slide');
  const [copiedCode, setCopiedCode] = useState(false);

  // Trainees enrolled in this specific Malla
  const enrolledTrainees = trainees.filter(
    (t) => t.assignedCourseId === 'crs-sond-a0' || t.courseName.includes('sondaje')
  );

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(malla.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              Malla Curricular Oficial
            </span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {malla.code}
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {malla.level}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Malla Curricular · Ruta Técnica de Sondaje
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {malla.institution} &middot; En convenio estratégico de formación técnica con <strong className="text-slate-700">{malla.targetCompany}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            title="Imprimir o guardar como PDF la Malla Curricular oficial"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir Malla</span>
          </button>

          <a
            href="https://campus.cif.cl/course/view.php?id=201"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Campus Moodle LMS</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* KPI & Hours Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Horas</span>
          <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
            {malla.totalHours} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[10px] text-blue-600 font-medium">4 módulos oficiales</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Horas Teóricas (HT)</span>
          <div className="text-xl font-bold text-blue-700 mt-0.5 tabular-nums">
            {malla.totalHT} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {((malla.totalHT / malla.totalHours) * 100).toFixed(1)}% del programa
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Horas Prácticas (HP)</span>
          <div className="text-xl font-bold text-emerald-700 mt-0.5 tabular-nums">
            {malla.totalHP} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium font-mono">
            {((malla.totalHP / malla.totalHours) * 100).toFixed(1)}% práctica intensiva
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">En Terreno (EPT)</span>
          <div className="text-xl font-bold text-slate-700 mt-0.5 tabular-nums">
            {malla.totalEPT} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[10px] text-slate-400">Nivel introductorio</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Simulador Central</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            CT-20 (Simulador)
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">Módulo 06 (16h HP)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Aprendices Inscritos</span>
          <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
            {enrolledTrainees.length} <span className="text-xs font-normal text-slate-500">en faena</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Geotec Boyles Bros</span>
        </div>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveView('slide')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeView === 'slide'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Malla Curricular (Diseño Oficial de la Diapositiva)</span>
          </button>

          <button
            onClick={() => setActiveView('competencies')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeView === 'competencies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Matriz de Competencias & Taxonomía</span>
          </button>

          <button
            onClick={() => setActiveView('trainees')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeView === 'trainees'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Aprendices en Formación ({enrolledTrainees.length})</span>
          </button>

          <button
            onClick={() => setActiveView('original')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeView === 'original'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Diapositiva Original (PowerPoint)</span>
          </button>
        </div>

        <button
          onClick={handleCopyCode}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono cursor-pointer"
        >
          {copiedCode ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Copiado
            </span>
          ) : (
            <span>Copiar Código: {malla.code}</span>
          )}
        </button>
      </div>

      {/* VIEW 1: OFFICIAL SLIDE CANVAS (FAITHFUL REPLICATION) */}
      {activeView === 'slide' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-10 transition-all print-break-inside-avoid">
            {/* Slide Title Header */}
            <div className="mb-8">
              <span className="text-[11px] font-bold text-[#b43422] uppercase tracking-[0.25em] block mb-1">
                MALLA CURRICULAR
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Ruta técnica · 4 módulos · 52 horas: <span className="font-semibold text-slate-800">Introducción al sondaje y a la industria de la exploración minera</span>
              </h2>
            </div>

            {/* 4-Columns Grid (Exact reproduction of the PowerPoint slide) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {malla.modules.map((mod, index) => {
                // Header background matching slide:
                // Mod 01: #6b92b6
                // Mod 04: #4d7da8
                // Mod 05: #1a5585
                // Mod 06: #0e253e
                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModule(mod)}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div>
                      {/* Module Top Header Strip */}
                      <div
                        className="px-4 py-3.5 text-white flex items-center justify-between"
                        style={{ backgroundColor: mod.headerBgHex }}
                      >
                        <div>
                          <div className="text-[11px] font-extrabold tracking-wider uppercase opacity-95">
                            {mod.moduleNumber}
                          </div>
                          <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                            {mod.actionVerb}
                          </div>
                        </div>
                        <div className="text-xl font-bold tracking-tight tabular-nums">
                          {mod.totalHours} h
                        </div>
                      </div>

                      {/* Module Title & Body */}
                      <div className="p-4 space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm leading-snug min-h-[40px] group-hover:text-blue-700 transition-colors">
                          {mod.title}
                        </h3>

                        {/* Bullet points */}
                        <ul className="space-y-2 text-xs text-slate-600">
                          {mod.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Metric Boxes: [ HT | HP | EPT ] */}
                    <div className="p-4 pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        {/* HT */}
                        <div className="border border-blue-100 bg-[#f8fbfe] rounded-lg py-2 text-center">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            {mod.ht}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            HT
                          </div>
                        </div>

                        {/* HP */}
                        <div className="border border-blue-100 bg-[#f8fbfe] rounded-lg py-2 text-center">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            {mod.hp}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            HP
                          </div>
                        </div>

                        {/* EPT */}
                        <div className="border border-blue-100 bg-[#f8fbfe] rounded-lg py-2 text-center">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            {mod.ept}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            EPT
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span>Ver detalles y competencias</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slide Footer */}
            <div className="mt-10 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div>
                {malla.institution} &middot; {malla.level}
              </div>
              <div className="font-mono text-slate-400">
                Página 1
              </div>
            </div>
          </div>

          {/* Interactive Tool Legend & Hours explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-600 no-print">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="font-semibold text-slate-800">Nomenclatura horaria SENCE:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-700 bg-white border border-blue-200 px-1.5 py-0.5 rounded text-[11px]">HT</span>
                <span>Horas Teóricas (Conceptos, normativas, geología)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]">HP</span>
                <span>Horas Prácticas (Talleres, cálculos, simulador CT-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">EPT</span>
                <span>Evaluación / Práctica en Terreno</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400">
              Haz clic en cualquier módulo para abrir la ficha pedagógica
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPETENCIES & TAXONOMY MATRIX */}
      {activeView === 'competencies' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Taxonomía de Aprendizaje & Desarrollo de Competencias
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La ruta formativa A0 articula la progresión cognitiva de Bloom: desde el reconocimiento del marco operacional hasta la preparación física y simulación en consola.
              </p>
            </div>

            <div className="space-y-4">
              {malla.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs uppercase shrink-0"
                        style={{ backgroundColor: mod.headerBgHex }}
                      >
                        {mod.actionVerb}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">{mod.moduleNumber}</span>
                          <span className="text-slate-300">&middot;</span>
                          <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {mod.actionDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {mod.totalHours} hrs totales
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {mod.ht} HT / {mod.hp} HP
                      </span>
                    </div>
                  </div>

                  {/* Competencies bullets */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Competencias Adquiridas:</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {mod.competencies?.map((comp, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>Recursos & Herramientas de Faena:</span>
                      </h4>
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                        {mod.equipmentOrTool}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TRAINEES ENROLLED IN THE SONDAGE MALLA */}
      {activeView === 'trainees' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Colaboradores y Aprendices en la Ruta Técnica ({enrolledTrainees.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seguimiento individual de avance en horas, notas, declaraciones juradas y estatus de certificación en Sondaje.
                </p>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                Cohorte: <strong className="text-slate-800">Geotec Nivel A0 - 2026</strong>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-4">
              {enrolledTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {trainee.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm truncate">
                          {trainee.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {trainee.rut}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {trainee.cargo} &middot; <strong className="text-slate-700">{trainee.empresa}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs shrink-0 flex-wrap">
                    {/* Hours progress */}
                    <div className="w-32">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Horas Malla</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                          {trainee.hoursCompleted}/{trainee.totalHours} hrs
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(trainee.hoursCompleted / trainee.totalHours) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Grade */}
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">Calificación</span>
                      <span className="font-bold text-emerald-700 font-mono text-sm">
                        {trainee.grade.toFixed(1)}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div>
                      {trainee.status === 'certificado_emitido' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Certificado Emitido
                        </span>
                      ) : trainee.status === 'evaluacion_pendiente' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Evaluación Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          En Progreso ({trainee.progress}%)
                        </span>
                      )}
                    </div>

                    {/* Detail action */}
                    {onSelectTrainee && (
                      <button
                        onClick={() => onSelectTrainee(trainee)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Ver Ficha
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: ORIGINAL SLIDE REFERENCE */}
      {activeView === 'original' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Archivo Fuente Original (PowerPoint Malla_A0_Ruta_Tecnica)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Captura de pantalla de la diapositiva cargada por el usuario para referencia de diseño y contenidos.
                </p>
              </div>

              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                100% de contenidos incorporados en el sistema
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-950 p-2 flex items-center justify-center">
              <img
                src="/assets/aistudio/para_prueba_b52c13d3.jpeg"
                alt="Diapositiva original de la Malla Curricular"
                className="max-h-[600px] w-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Module Detail Modal / Drawer */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div
              className="p-6 text-white"
              style={{ backgroundColor: selectedModule.headerBgHex }}
            >
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2 opacity-90">
                <span>{selectedModule.moduleNumber} &middot; Taxonomía: {selectedModule.actionVerb}</span>
                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-white font-bold">
                  {selectedModule.totalHours} Horas Totales
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">
                {selectedModule.title}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                {selectedModule.actionDescription}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Desglose de horas */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Horas Teóricas (HT)</span>
                  <span className="font-bold text-sm text-slate-900 tabular-nums">
                    {selectedModule.ht} hrs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Horas Prácticas (HP)</span>
                  <span className="font-bold text-sm text-slate-900 tabular-nums">
                    {selectedModule.hp} hrs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">En Terreno (EPT)</span>
                  <span className="font-bold text-sm text-slate-900 tabular-nums">
                    {selectedModule.ept} hrs
                  </span>
                </div>
              </div>

              {/* Temas oficiales de la diapositiva */}
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Unidades Temáticas Oficiales
                </h3>
                <div className="space-y-2">
                  {selectedModule.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipamiento o Simulador */}
              {selectedModule.equipmentOrTool && (
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <span className="font-semibold text-blue-900 block mb-1">
                    Equipamiento & Herramientas:
                  </span>
                  <p className="text-blue-800 text-xs">
                    {selectedModule.equipmentOrTool}
                  </p>
                </div>
              )}

              {/* Footer buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cerrar
                </button>

                <a
                  href="https://campus.cif.cl/course/view.php?id=201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs"
                >
                  <span>Abrir Aula de Sondaje</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
