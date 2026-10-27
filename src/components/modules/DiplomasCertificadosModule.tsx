import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Search, 
  CheckCircle2, 
  Download, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  FileBadge,
  Sparkles,
  Copy,
  Check,
  Plus,
  Send,
  Eye,
  Building,
  GraduationCap,
  Layers,
  Filter
} from 'lucide-react';
import { Trainee } from '../../types';

interface DiplomasCertificadosModuleProps {
  trainees: Trainee[];
  onOpenCertificate: (certificateId: string, trainee: Trainee) => void;
  onIssueCertificate?: (traineeId: string, certId: string) => void;
}

export const DiplomasCertificadosModule: React.FC<DiplomasCertificadosModuleProps> = ({
  trainees,
  onOpenCertificate,
  onIssueCertificate,
}) => {
  const EMBED_URL = 'https://akadem-diplomas-certificados.vercel.app/';
  const [activeSubTab, setActiveSubTab] = useState<'galeria' | 'emision' | 'validador' | 'legacy'>('galeria');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Verification state
  const [verifyFolio, setVerifyFolio] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<Trainee | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  // Legacy iframe state
  const [iframeKey, setIframeKey] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const certifiedTrainees = trainees.filter((t) => t.certificateId);
  const eligibleTrainees = trainees.filter((t) => !t.certificateId && t.progress >= 70);

  const handleIssueSingle = (t: Trainee) => {
    const newFolio = `CIF-2026-CERT-${Math.floor(9000 + Math.random() * 999)}`;
    if (onIssueCertificate) {
      onIssueCertificate(t.id, newFolio);
    } else {
      t.certificateId = newFolio;
      t.certificateIssueDate = 'Hoy';
      t.status = 'certificado_emitido';
    }
    showToast(`Diploma emitido exitosamente para ${t.name} con Folio ${newFolio}`);
  };

  const handleBatchIssue = () => {
    eligibleTrainees.forEach((t, idx) => {
      const newFolio = `CIF-2026-CERT-${9200 + idx}`;
      t.certificateId = newFolio;
      t.certificateIssueDate = 'Hoy';
      t.status = 'certificado_emitido';
    });
    showToast(`Se emitieron ${eligibleTrainees.length} diplomas en lote.`);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasVerified(true);
    const clean = verifyFolio.trim().toUpperCase();
    const found = trainees.find(
      (t) =>
        (t.certificateId && t.certificateId.toUpperCase() === clean) ||
        t.rut.replace(/\./g, '').toUpperCase() === clean.replace(/\./g, '')
    );
    setVerifiedResult(found || null);
  };

  const filteredCertified = certifiedTrainees.filter((t) => {
    if (filterEmpresa !== 'all' && t.empresa !== filterEmpresa) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.rut.toLowerCase().includes(q) ||
        (t.certificateId && t.certificateId.toLowerCase().includes(q)) ||
        t.courseName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar aligned to Intranet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Módulo 2
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Diplomas y Certificados Oficiales
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Emisión de credenciales con firma digital avanzada, validación mediante código QR y trazabilidad de horas SENCE.
          </p>
        </div>

        {/* Sub-navigation tabs aligned to Intranet */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('galeria')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeSubTab === 'galeria'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diplomas Emitidos ({certifiedTrainees.length})
          </button>

          <button
            onClick={() => setActiveSubTab('emision')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'emision'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emisión ({eligibleTrainees.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('validador')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeSubTab === 'validador'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Validador QR & Folio
          </button>

          <button
            onClick={() => setActiveSubTab('legacy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-slate-500 hover:text-slate-800`}
            title="Vista externa original"
          >
            Vista Embebida
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Certificados Oficiales</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">1,241</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Emitidos en ciclo 2026</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Validación Pública QR</span>
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">100%</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Trazabilidad online en tiempo real</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Aptos para Emisión</span>
            <GraduationCap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {eligibleTrainees.length}
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">Avance &ge; 70% pendiente de firma</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Calificación Promedio</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            6.8<span className="text-xs text-slate-400 font-sans">/7.0</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Nivel de excelencia académica</div>
        </div>
      </div>

      {/* SubTab 1: Galería y Registro de Diplomas */}
      {activeSubTab === 'galeria' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, RUT, folio o curso..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterEmpresa}
                onChange={(e) => setFilterEmpresa(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Todas las Empresas (Holding)</option>
                <option value="Geotec Boyles Bros">Geotec Boyles Bros</option>
                <option value="Minera Centinela">Minera Centinela</option>
                <option value="Retail Andino & Logística">Retail Andino & Logística</option>
              </select>

              <button
                onClick={() => setActiveSubTab('emision')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emitir Diplomas</span>
              </button>
            </div>
          </div>

          {/* Diplomas Grid - High-end Cards with Intranet styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertified.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {t.certificateId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Emitido: {t.certificateIssueDate || '24/10/2026'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500 tabular-nums">
                      RUT: {t.rut} &middot; {t.empresa}
                    </p>
                    <div className="text-xs font-medium text-slate-800 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {t.courseName}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>Duración: <strong className="text-slate-900">{t.totalHours} hrs</strong></span>
                    <span>Calificación: <strong className="font-mono font-bold text-emerald-700">{t.grade.toFixed(1)}/7.0</strong></span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validado SENCE</span>
                  </div>

                  <button
                    onClick={() => onOpenCertificate(t.certificateId!, t)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <FileBadge className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver Diploma</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Emisión de Nuevos Diplomas */}
      {activeSubTab === 'emision' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Colaboradores Aptos para Emisión de Diploma ({eligibleTrainees.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Colaboradores que han completado sus horas lectivas o se encuentran en evaluación final.
              </p>
            </div>

            {eligibleTrainees.length > 0 && (
              <button
                onClick={handleBatchIssue}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-center"
              >
                <Award className="w-4 h-4" />
                <span>Emitir en Lote a Todos ({eligibleTrainees.length})</span>
              </button>
            )}
          </div>

          {eligibleTrainees.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No hay diplomas pendientes de emisión</p>
              <p className="text-xs text-slate-400 mt-1">
                Todos los colaboradores elegibles ya cuentan con su diploma oficial timbrado.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                    <th className="py-2.5 px-4">Colaborador / RUT</th>
                    <th className="py-2.5 px-4">Empresa / Cargo</th>
                    <th className="py-2.5 px-4">Curso Asignado</th>
                    <th className="py-2.5 px-4">Avance & Horas</th>
                    <th className="py-2.5 px-4">Nota</th>
                    <th className="py-2.5 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eligibleTrainees.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">RUT: {t.rut}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{t.empresa}</div>
                        <div className="text-[11px] text-slate-500">{t.cargo}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-slate-800 font-medium truncate">{t.courseName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-700">{t.progress}%</span>
                        <span className="text-[11px] text-slate-500 ml-1">({t.hoursCompleted}/{t.totalHours} hrs)</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {t.grade.toFixed(1)}/7.0
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleIssueSingle(t)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Emitir Diploma</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SubTab 3: Validador QR & Folios */}
      {activeSubTab === 'validador' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 max-w-3xl mx-auto">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Validador Oficial de Diplomas y Folios SENCE
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verifique la validez legal de cualquier diploma corporativo ingresando el código de folio (ej. CIF-2026-CERT-9041) o el RUT del alumno.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex gap-2">
            <input
              type="text"
              value={verifyFolio}
              onChange={(e) => setVerifyFolio(e.target.value)}
              required
              placeholder="Ingrese código de folio (ej. CIF-2026-CERT-9041) o RUT..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Validar Folio</span>
            </button>
          </form>

          {hasVerified && (
            <div className="pt-2">
              {verifiedResult ? (
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Certificado Oficial Válido & Homologado</span>
                    </div>
                    <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded">
                      {verifiedResult.certificateId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Alumno Certificado</span>
                      <strong className="text-slate-900">{verifiedResult.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">RUT Registrado</span>
                      <strong className="font-mono text-slate-900">{verifiedResult.rut}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Programa Acreditado</span>
                      <strong className="text-slate-900">{verifiedResult.courseName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Horas & Calificación</span>
                      <strong>{verifiedResult.totalHours} hrs &middot; {verifiedResult.grade.toFixed(1)}/7.0</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onOpenCertificate(verifiedResult.certificateId!, verifiedResult)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileBadge className="w-3.5 h-3.5 text-blue-400" />
                      <span>Ver Diploma Completo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  No se encontró ningún certificado con el folio o RUT ingresado en el registro corporativo de CIF.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SubTab 4: Legacy iframe view */}
      {activeSubTab === 'legacy' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700">Conexión con portal externo de certificados</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">{EMBED_URL}</span>
              <a
                href={EMBED_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Abrir en nueva pestaña</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="w-full h-[600px] relative">
            <iframe
              key={iframeKey}
              src={EMBED_URL}
              title="Diplomas Legacy"
              className="w-full h-full border-0"
              allow="camera; microphone; clipboard-write; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          </div>
        </div>
      )}
    </div>
  );
};
