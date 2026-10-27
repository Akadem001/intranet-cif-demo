import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  FileText
} from 'lucide-react';
import { KPIStats, Trainee } from '../../types';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPIStats;
  trainees: Trainee[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  kpis,
  trainees,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group by the 3 Holding Client Companies
  const empresas = ['Geotec Boyles Bros', 'Minera Centinela', 'Retail Andino & Logística'];
  const empresaStats = empresas.map((emp) => {
    const list = trainees.filter((t) => t.empresa === emp);
    const completed = list.filter((t) => t.status === 'certificado_emitido').length;
    const totalHours = list.reduce((acc, curr) => acc + curr.hoursCompleted, 0);
    const avgGrade = list.length > 0
      ? (list.reduce((acc, curr) => acc + curr.grade, 0) / list.length).toFixed(1)
      : '0.0';
    const rate = list.length > 0 ? Math.round((completed / list.length) * 100) : 0;

    return {
      name: emp,
      total: list.length,
      completed,
      rate,
      totalHours,
      avgGrade,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900">
        {/* Top interactive toolbar (hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-tight text-white">CIF CORPORATIVO</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-300">Informe Ejecutivo para Directorio · 3 Empresas Filiales</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Report Content (optimized for screen & print) */}
        <div className="p-8 sm:p-12 space-y-8 bg-white" id="printable-report">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  CIF
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    INFORME EJECUTIVO DE GESTIÓN OTEC Y CUMPLIMIENTO SENCE
                  </h1>
                  <p className="text-xs text-slate-500">
                    OTEC Holding Corporativo · Geotec Boyles Bros · Minera Centinela · Retail Andino
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <div className="font-mono font-semibold text-slate-900">
                REF: INF-DIR-2026-Q4
              </div>
              <div>Fecha: 26 de Octubre de 2026</div>
              <div className="text-[11px] text-slate-400">Distribución: Directorio & Gerencia General del Holding</div>
            </div>
          </div>

          {/* Executive Summary */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              1. Resumen Ejecutivo
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              El presente informe sintetiza el estado integral de la OTEC corporativa en el inicio de operaciones con las 3 empresas filiales del holding: <strong className="text-slate-900 font-bold">Geotec Boyles Bros</strong> (sondaje y perforación diamantina DDH), <strong className="text-slate-900 font-bold">Minera Centinela</strong> (operación mina rajo y concentradora), y <strong className="text-slate-900 font-bold">Retail Andino & Logística</strong> (cadena de frío y abastecimiento). A la fecha se registra un cumplimiento global del <strong className="text-slate-900 font-bold">{kpis.completionRate}%</strong>, un aprovechamiento del <strong className="text-slate-900 font-bold">96.8%</strong> de la Franquicia Tributaria SENCE 1% y 100% de trazabilidad individual mediante la <strong className="text-slate-900 font-bold">Hoja de Vida Académica & Laboral 360°</strong> por alumno.
            </p>
          </section>

          {/* Key Metrics Grid */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              2. Indicadores Clave Consolidados del Holding
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="text-[11px] text-slate-500">Alumnos en Capacitación</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {kpis.totalTrained.toLocaleString('es-CL')}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">100% Dotación Crítica Holding</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="text-[11px] text-slate-500">Cursos & Mallas Activas</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {kpis.activeCourses} / {kpis.activeCohorts}
                </div>
                <div className="text-[10px] text-slate-500">Incluye Ruta A0 Geotec 52h</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="text-[11px] text-slate-500">Tasa de Aprobación</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {kpis.completionRate}%
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">Meta Directorio: {kpis.targetCompletionRate}%</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="text-[11px] text-slate-500">Horas Franquicia SENCE</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {kpis.accumulatedHours.toLocaleString('es-CL')} hrs
                </div>
                <div className="text-[10px] text-blue-700 font-medium">96.8% Franquicia 1% Ejecutada</div>
              </div>
            </div>
          </section>

          {/* Breakdown Table by Company */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              3. Desglose Operativo por las 3 Filiales del Holding
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-4">Empresa Filial</th>
                    <th className="py-2.5 px-4 text-center">Colaboradores</th>
                    <th className="py-2.5 px-4 text-center">Certificados</th>
                    <th className="py-2.5 px-4 text-center">Tasa Avance</th>
                    <th className="py-2.5 px-4 text-right">Horas SENCE</th>
                    <th className="py-2.5 px-4 text-right">Nota Prom.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {empresaStats.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center tabular-nums">
                        {item.total}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-700 tabular-nums">
                        {item.completed}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold tabular-nums">{item.rate}%</span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${item.rate >= 85 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${item.rate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {item.totalHours} hrs
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {item.avgGrade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 Pillars Summary for Board of Directors */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              4. Evaluación por los 4 Pilares de Gestión de la OTEC
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950">A. Docencia & Calidad Académica</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">89.4% CSAT</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Despliegue del simulador CT-20 en Geotec Boyles Bros y Moodle LMS. Cumplimiento de estándares NCh2728:2015 en diseño curricular, evaluaciones prácticas presenciales y aprobación promedio de 6.4/7.0.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">B. Operaciones & Cumplimiento SENCE</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">100% LCE</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Libro de Clases Electrónico (LCE) sincronizado al 100%. Trazabilidad digital de asistencias biométricas y declaraciones juradas firmadas legalmente bajo Ley 16.744 sin observaciones de la Dirección del Trabajo.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950">C. Comercial & Clientes del Holding</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">96.8% Cobertura</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Plan de fidelización y captura de demanda en las 3 filiales. Detección temprana de necesidades operacionales en faenas críticas (Sondaje Minero, Prevención de Riesgos y Logística de Distribución).
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">D. Finanzas & Franquicia Tributaria 1%</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">CLP $148M</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Intermediación fluida con OTIC CChC y OTIC Proforma. 96.8% de optimización de la franquicia 1% SENCE, costo unitario por hora/alumno un 22% inferior al promedio de mercado de OTECs externas.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Compliance and Declaraciones Juradas */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              5. Auditoría Legal, Hoja de Vida 360° y Diplomas Verificables
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Cumplimiento suscripción Declaración Jurada Ley 16.744 / Código Ética:</span>
                <span className="font-bold text-emerald-700">{kpis.affidavitsSignedRate}% de efectividad</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total diplomas emitidos con hash criptográfico SHA-256 y QR SENCE:</span>
                <span className="font-bold text-slate-900">{kpis.certificatesIssuedCount} documentos emitidos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Disponibilidad de Hoja de Vida Académica & Laboral 360° por colaborador:</span>
                <span className="font-bold text-blue-700">100% de la dotación (Navegación e historial activo)</span>
              </div>
            </div>
          </section>

          {/* Strategic Recommendations */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              6. Acuerdos y Recomendaciones para el Directorio
            </h2>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>Ratificar el inicio de la Fase 2 del módulo de perforación con simulador CT-20 para Geotec Boyles Bros.</li>
              <li>Mantener el flujo de firma electrónica de Declaraciones Juradas previo al ingreso a faena minera en Centinela.</li>
              <li>Aprobar la liquidación trimestral con OTIC para asegurar el 100% de imputación tributaria antes del cierre del ejercicio.</li>
            </ul>
          </section>

          {/* Signature Blocks */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs text-slate-700 print-break-inside-avoid">
            <div className="border-t border-slate-400 pt-3">
              <div className="font-bold text-slate-900">Dra. Elena Silva Valenzuela</div>
              <div className="text-[11px] text-slate-500">Directora Corporativa de Talento & Auditoría SENCE</div>
              <div className="text-[10px] text-slate-400 mt-0.5">CIF EdTech Holding</div>
            </div>

            <div className="border-t border-slate-400 pt-3">
              <div className="font-bold text-slate-900">Rodrigo Morales Peña</div>
              <div className="text-[11px] text-slate-500">Jefe de Capacitación & Operaciones</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Comité de Capacitación Bipartito</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
