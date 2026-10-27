import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  Building, 
  Globe, 
  Shield, 
  Database, 
  Sliders,
  CheckCircle2,
  Download,
  Laptop,
  FileCode
} from 'lucide-react';

export const ConfiguracionModule: React.FC = () => {
  const [holdingName, setHoldingName] = useState('CIF EdTech Holding Corporativo');
  const [oticCode, setOticCode] = useState('OTIC-SOFOFA-2026-CL');
  const [declaracionesUrl, setDeclaracionesUrl] = useState('https://akadem-edtech.github.io/declaraciones-juradas/');
  const [diplomasUrl, setDiplomasUrl] = useState('https://akadem-diplomas-certificados.vercel.app/');
  const [moodleUrl, setMoodleUrl] = useState('https://campus.cif.cl');
  const [targetHours, setTargetHours] = useState('20000');
  const [minPassGrade, setMinPassGrade] = useState('5.0');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Configuración
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Ajustes del Sistema Corporativo
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de URLs maestras de integración, parámetros SENCE y metas para el Directorio.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuración guardada exitosamente</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: URLs de Integración de Módulos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>URLs de Integración de las 4 Aplicaciones</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Módulo 1: URL Declaraciones Juradas (iframe)
              </label>
              <input
                type="url"
                value={declaracionesUrl}
                onChange={(e) => setDeclaracionesUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Módulo 2: URL Diplomas y Certificados (iframe)
              </label>
              <input
                type="url"
                value={diplomasUrl}
                onChange={(e) => setDiplomasUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Módulo 3: URL Campus Virtual Moodle LMS
              </label>
              <input
                type="url"
                value={moodleUrl}
                onChange={(e) => setMoodleUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Parámetros del Directorio & SENCE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Metas Corporativas y Parámetros del Directorio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Razón Social del Holding
              </label>
              <input
                type="text"
                value={holdingName}
                onChange={(e) => setHoldingName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Código OTIC / Registro SENCE
              </label>
              <input
                type="text"
                value={oticCode}
                onChange={(e) => setOticCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Meta Anual de Horas Capacitadas
              </label>
              <input
                type="number"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Nota Mínima de Aprobación Certificación
              </label>
              <input
                type="number"
                step="0.1"
                value={minPassGrade}
                onChange={(e) => setMinPassGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Descarga del Paquete Autónomo HTML (Offline / Distribución) */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>Paquete Autónomo de la Aplicación en HTML (Offline)</span>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              Archivo Único Portable
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Puedes descargar la aplicación completa compilada en un único archivo <strong>.html</strong> autónomo (incluye todos los scripts, estilos, módulos y datos). Este archivo no requiere Node.js ni servidor web: puedes guardarlo en un pendrive, enviarlo por correo y hacer doble clic para abrirlo directamente en Google Chrome, Edge o Safari en cualquier computador de faena o del Directorio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 bg-white/80 p-3.5 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                HTML
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  cif_intranet_corporativa.html
                </div>
                <div className="text-[11px] text-slate-500">
                  Aplicación completa autónoma · ~900 KB · Compatible con modo sin conexión
                </div>
              </div>
            </div>

            <a
              href="/cif_intranet_aplicacion.html"
              download="cif_intranet_corporativa.html"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Archivo HTML</span>
            </a>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Parámetros Institucionales</span>
          </button>
        </div>
      </form>
    </div>
  );
};
