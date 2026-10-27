import React, { useState } from 'react';
import { 
  FileCheck2, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info,
  Copy,
  Check,
  Plus,
  Printer,
  X,
  FileText,
  UserCheck,
  Building,
  KeyRound,
  Download,
  Filter
} from 'lucide-react';
import { Trainee } from '../../types';
import { DigitalSignaturePad } from '../common/DigitalSignaturePad';

interface DeclaracionRecord {
  id: string;
  code: string;
  type: string;
  category: string;
  traineeId: string;
  traineeName: string;
  rut: string;
  empresa: string;
  area: string;
  cargo: string;
  signedDate: string;
  status: 'firmada' | 'pendiente';
  hashSha256: string;
  signatureImage?: string;
  clauses: string[];
}

interface DeclaracionesJuradasModuleProps {
  trainees: Trainee[];
}

export const DeclaracionesJuradasModule: React.FC<DeclaracionesJuradasModuleProps> = ({ trainees }) => {
  const EMBED_URL = 'https://akadem-edtech.github.io/declaraciones-juradas/';
  const [activeSubTab, setActiveSubTab] = useState<'bandeja' | 'nueva' | 'verificar' | 'legacy'>('bandeja');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<DeclaracionRecord | null>(null);

  // New DJ Form states
  const [newDjType, setNewDjType] = useState('DJ-101');
  const [selectedTraineeId, setSelectedTraineeId] = useState(trainees[0]?.id || '');
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Legacy iframe state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Initial mock declarations database aligned with Holding
  const [declarations, setDeclarations] = useState<DeclaracionRecord[]>([
    {
      id: 'dj-rec-01',
      code: 'DJ-2026-0841',
      type: 'Prevención de Riesgos y Salud Ocupacional (Ley 16.744)',
      category: 'Seguridad Laboral',
      traineeId: 'trn-101',
      traineeName: 'Sebastián Alarcón Castro',
      rut: '16.428.910-K',
      empresa: 'Minera Centinela',
      area: 'Operaciones Mina & Concentradora',
      cargo: 'Supervisor de Planta Concentradora',
      signedDate: '24/10/2026 09:32 hrs',
      status: 'firmada',
      hashSha256: '9b3f421ca0921df89b91e92c4a91901a884efb20c9183011',
      clauses: [
        'Declaro haber recibido y comprendido la totalidad de los contenidos de seguridad operacional y protocolos de faena.',
        'Me comprometo a utilizar de manera obligatoria y adecuada los Elementos de Protección Personal (EPP).',
        'Acepto la fiscalización y auditoría periódica de cumplimiento preventivo en terreno.',
      ],
    },
    {
      id: 'dj-rec-02',
      code: 'DJ-2026-0842',
      type: 'Código de Ética y Prevención de Delitos (Ley 20.393)',
      category: 'Compliance & Legal',
      traineeId: 'trn-102',
      traineeName: 'Camila Valenzuela Soto',
      rut: '17.810.342-5',
      empresa: 'Geotec Boyles Bros',
      area: 'Geología & Perforación DDH',
      cargo: 'Geóloga de Sondaje y Testigoteca',
      signedDate: '20/10/2026 15:14 hrs',
      status: 'firmada',
      hashSha256: 'c84a10e7b99142858b73f27129188a44b1c781640a23bc81',
      clauses: [
        'Declaro no mantener conflictos de interés vigentes con proveedores o contratistas de sondaje.',
        'Me obligo a resguardar la confidencialidad de la información litológica y de leyes minerales.',
        'Conozco los canales de denuncia corporativos y las sanciones asociadas a la Ley 20.393.',
      ],
    },
    {
      id: 'dj-rec-03',
      code: 'DJ-2026-0843',
      type: 'Protocolo de Operación y Seguridad en Perforación Diamantina DDH',
      category: 'Seguridad Operacional',
      traineeId: 'trn-103',
      traineeName: 'Felipe Araya Morales',
      rut: '18.904.512-3',
      empresa: 'Geotec Boyles Bros',
      area: 'Operaciones de Sondaje',
      cargo: 'Ayudante de Perforación Nivel A0',
      signedDate: '22/10/2026 11:05 hrs',
      status: 'firmada',
      hashSha256: '517d91ae4883bfca9810141bb7654109726ae019f20109cc',
      clauses: [
        'Me comprometo a cumplir estrictamente los protocolos de bloqueo de energía y manejo seguro de barras.',
        'Declaro haber completado la inducción práctica y horas reglamentarias en simulador CT-20.',
        'Acepto los lineamientos de la norma NCh2728:2015 sobre calidad y seguridad en procesos de instrucción técnica.',
      ],
    },
    {
      id: 'dj-rec-04',
      code: 'DJ-2026-0844',
      type: 'Asistencia y Participación en Capacitación Franquicia SENCE',
      category: 'SENCE & Franquicia',
      traineeId: 'trn-105',
      traineeName: 'Diego Tapia Rojas',
      rut: '15.918.432-8',
      empresa: 'Retail Andino & Logística',
      area: 'Logística & Cadena de Suministro',
      cargo: 'Jefe de Despacho & Abastecimiento Faenas',
      signedDate: '19/10/2026 16:40 hrs',
      status: 'firmada',
      hashSha256: 'a12cf409890bc41235471928374189028371902837419082',
      clauses: [
        'Certifico mi asistencia efectiva y personal a las horas cronológicas del curso impartido.',
        'Autorizo el registro de mi asistencia y evaluación ante el Servicio Nacional de Capacitación y Empleo (SENCE).',
      ],
    },
  ]);

  // Verification state
  const [verifyRut, setVerifyRut] = useState('');
  const [verifyResult, setVerifyResult] = useState<DeclaracionRecord[] | null>(null);
  const [searchedVerify, setSearchedVerify] = useState(false);

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedVerify(true);
    const clean = verifyRut.trim().toLowerCase().replace(/\./g, '');
    const found = declarations.filter((d) =>
      d.rut.toLowerCase().replace(/\./g, '').includes(clean) ||
      d.code.toLowerCase().includes(clean)
    );
    setVerifyResult(found);
  };

  const handleCreateSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureData) {
      setSignatureError(true);
      return;
    }
    setSignatureError(false);

    const targetTrainee = trainees.find((t) => t.id === selectedTraineeId);
    if (!targetTrainee) return;

    const typesMap: Record<string, { title: string; category: string; clauses: string[] }> = {
      'DJ-101': {
        title: 'Prevención de Riesgos y Salud Ocupacional (Ley 16.744)',
        category: 'Seguridad Laboral',
        clauses: [
          'Declaro haber recibido y comprendido la totalidad de los contenidos de seguridad operacional y protocolos de faena.',
          'Me comprometo a utilizar de manera obligatoria y adecuada los Elementos de Protección Personal (EPP).',
          'Acepto la fiscalización y auditoría periódica de cumplimiento preventivo en terreno.',
        ],
      },
      'DJ-102': {
        title: 'Confidencialidad y Protección de Datos ISO 27001',
        category: 'Ciberseguridad & TI',
        clauses: [
          'Me comprometo a salvaguardar los tokens, credenciales y llaves criptográficas asignadas a mi cargo.',
          'Declaro no almacenar datos personales de colaboradores o alumnos en dispositivos no autorizados.',
          'Acepto los lineamientos de la norma ISO/IEC 27001:2022.',
        ],
      },
      'DJ-103': {
        title: 'Código de Ética y Prevención de Delitos (Ley 20.393)',
        category: 'Compliance & Legal',
        clauses: [
          'Declaro no mantener conflictos de interés vigentes con proveedores o clientes corporativos.',
          'Me obligo a resguardar la confidencialidad de la información y abstenerse del uso de información privilegiada.',
        ],
      },
      'DJ-104': {
        title: 'Asistencia y Participación en Capacitación Franquicia SENCE',
        category: 'SENCE & Franquicia',
        clauses: [
          'Certifico mi asistencia efectiva y personal al programa de capacitación corporativo homologado.',
          'Autorizo la trazabilidad de mi registro académico ante SENCE y la Dirección del Trabajo.',
        ],
      },
    };

    const typeConfig = typesMap[newDjType] || typesMap['DJ-101'];
    const newCode = `DJ-2026-0${845 + declarations.length}`;
    const generatedHash = Array.from({ length: 48 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newRecord: DeclaracionRecord = {
      id: `dj-${Date.now()}`,
      code: newCode,
      type: typeConfig.title,
      category: typeConfig.category,
      traineeId: targetTrainee.id,
      traineeName: targetTrainee.name,
      rut: targetTrainee.rut,
      empresa: targetTrainee.empresa,
      area: targetTrainee.area,
      cargo: targetTrainee.cargo,
      signedDate: `Hoy, ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs`,
      status: 'firmada',
      hashSha256: generatedHash,
      signatureImage: signatureData,
      clauses: typeConfig.clauses,
    };

    setDeclarations([newRecord, ...declarations]);
    setSelectedRecord(newRecord);
    setSuccessToast(`Declaración Jurada ${newCode} suscrita y timbrada digitalmente.`);
    setActiveSubTab('bandeja');

    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredDeclarations = declarations.filter((d) => {
    if (filterType !== 'all' && d.category !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.traineeName.toLowerCase().includes(q) ||
        d.rut.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.empresa.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Módulo 1
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Declaraciones Juradas Digitales
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión institucional de declaraciones juradas, suscripción digital con estampado criptográfico SHA-256 y auditoría SENCE.
          </p>
        </div>

        {/* Sub-navigation tabs aligned to Intranet visual style */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('bandeja')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeSubTab === 'bandeja'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bandeja de Declaraciones ({declarations.length})
          </button>

          <button
            onClick={() => setActiveSubTab('nueva')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'nueva'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Firmar Nueva DJ</span>
          </button>

          <button
            onClick={() => setActiveSubTab('verificar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeSubTab === 'verificar'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verificador Legal
          </button>

          <button
            onClick={() => setActiveSubTab('legacy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-slate-500 hover:text-slate-800`}
            title="Vista embebida externa original"
          >
            Vista Embebida
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Declaraciones Suscritas</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {declarations.filter((d) => d.status === 'firmada').length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Tasa de cumplimiento: 94.6%</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Seguridad Laboral (Ley 16.744)</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">100%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Faenas Mineras & Operaciones</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Firmas Pendientes</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">2</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Notificaciones enviadas por email</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Criptografía & Timbre</span>
            <KeyRound className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xs font-mono font-bold text-slate-900 mt-2 truncate">
            SHA-256 DIGITAL
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Validado ante Dirección del Trabajo</div>
        </div>
      </div>

      {/* SubTab 1: Bandeja de Declaraciones */}
      {activeSubTab === 'bandeja' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por colaborador, RUT, código DJ o empresa..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Todas las Categorías</option>
                <option value="Seguridad Laboral">Seguridad Laboral (Ley 16.744)</option>
                <option value="Compliance & Legal">Compliance & Legal (Ley 20.393)</option>
                <option value="Ciberseguridad & TI">Ciberseguridad ISO 27001</option>
                <option value="SENCE & Franquicia">SENCE & Franquicia</option>
              </select>

              <button
                onClick={() => setActiveSubTab('nueva')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Suscribir DJ</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Código DJ</th>
                  <th className="py-2.5 px-4">Colaborador / RUT</th>
                  <th className="py-2.5 px-4">Tipo de Declaración</th>
                  <th className="py-2.5 px-4">Empresa / Área</th>
                  <th className="py-2.5 px-4">Fecha y Hora</th>
                  <th className="py-2.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeclarations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {d.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{d.traineeName}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums">RUT: {d.rut}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-800 font-medium truncate">{d.type}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        Hash: {d.hashSha256.slice(0, 16)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{d.empresa}</div>
                      <div className="text-[11px] text-slate-500">{d.area}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 tabular-nums text-[11px]">
                      {d.signedDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(d)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Documento</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Nueva Suscripción Digital en Vivo */}
      {activeSubTab === 'nueva' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 max-w-3xl mx-auto">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Suscripción Digital de Declaración Jurada
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Complete los datos del colaborador y estampe la firma digital obligatoria bajo estándares de la Ley 19.799.
            </p>
          </div>

          <form onSubmit={handleCreateSignature} className="space-y-5 text-xs">
            {/* Step 1: Type */}
            <div>
              <label className="block font-semibold text-slate-800 mb-2">
                1. Seleccione el Tipo de Declaración Jurada a Suscribir:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'DJ-101', name: 'Prevención de Riesgos y Salud Ocupacional (Ley 16.744)', cat: 'Seguridad' },
                  { id: 'DJ-102', name: 'Confidencialidad y Seguridad de la Información ISO 27001', cat: 'Ciberseguridad' },
                  { id: 'DJ-103', name: 'Código de Ética y Prevención de Delitos (Ley 20.393)', cat: 'Compliance' },
                  { id: 'DJ-104', name: 'Asistencia y Participación en Capacitación Franquicia SENCE', cat: 'SENCE' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setNewDjType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newDjType === item.id
                        ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-semibold shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-blue-700 font-bold">{item.id}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-sans">
                        {item.cat}
                      </span>
                    </div>
                    <div className="text-xs font-medium leading-snug">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Trainee selection */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1.5">
                2. Seleccione el Colaborador Registrado:
              </label>
              <select
                value={selectedTraineeId}
                onChange={(e) => setSelectedTraineeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {trainees.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} &middot; RUT: {t.rut} &middot; {t.empresa} ({t.cargo})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Legal Clauses */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-semibold text-slate-900">
                3. Consentimiento Legal y Aceptación de Cláusulas Institucionales:
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={(e) => setConsent1(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-700 leading-snug">
                  Declaro bajo fe de juramento que la información proporcionada es verídica y que he recibido instrucción completa sobre los protocolos obligatorios de la empresa.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={(e) => setConsent2(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-700 leading-snug">
                  Autorizo el estampado de mi firma digital manuscrita con registro de hash criptográfico y su archivo ante auditorías de SENCE y organismos fiscalizadores.
                </span>
              </label>
            </div>

            {/* Step 4: Digital Signature Pad */}
            <div className="space-y-2">
              <DigitalSignaturePad onSignatureChange={setSignatureData} />
              {signatureError && (
                <div className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Por favor estampe su firma digital manuscrita en el recuadro antes de continuar.</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveSubTab('bandeja')}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Suscribir & Timbrar Declaración Jurada</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SubTab 3: Verificador Legal */}
      {activeSubTab === 'verificar' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 max-w-3xl mx-auto">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Verificador Criptográfico de Declaraciones Juradas
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consulte la autenticidad y fecha exacta de suscripción de cualquier documento emitido en la Intranet Corporativa.
            </p>
          </div>

          <form onSubmit={handleVerifySearch} className="flex gap-2">
            <input
              type="text"
              value={verifyRut}
              onChange={(e) => setVerifyRut(e.target.value)}
              required
              placeholder="Ingrese RUT del trabajador (ej. 16.428.910-K) o Código DJ (ej. DJ-2026-0841)"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verificar</span>
            </button>
          </form>

          {searchedVerify && (
            <div className="pt-2">
              {verifyResult && verifyResult.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Se encontraron {verifyResult.length} registro(s) legalmente válido(s):</span>
                  </div>

                  {verifyResult.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-blue-700">{rec.code}</div>
                        <div className="font-semibold text-slate-900 mt-0.5">{rec.traineeName}</div>
                        <div className="text-slate-500 text-[11px]">
                          RUT: {rec.rut} &middot; {rec.empresa} ({rec.cargo})
                        </div>
                        <div className="text-slate-700 font-medium mt-1">{rec.type}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          Hash SHA-256: {rec.hashSha256}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center shrink-0"
                      >
                        Ver Documento Timbrado
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  No se encontró ninguna declaración jurada para el criterio ingresado. Verifique el formato del RUT o código.
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
              <span className="font-medium text-slate-700">Conexión con aplicativo web original</span>
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
              title="Declaraciones Juradas Legacy"
              className="w-full h-full border-0"
              allow="camera; microphone; clipboard-write; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          </div>
        </div>
      )}

      {/* Official Timbrada Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            {/* Top Toolbar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2 text-xs">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Declaración Jurada Oficial Timbrada</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-300">{selectedRecord.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 sm:p-10 space-y-6 text-xs text-slate-800 bg-white">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    CIF
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">CIF EDTECH CORP</div>
                    <div className="text-[11px] text-slate-500">Dirección de Auditoría & Cumplimiento Normativo</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <div className="font-mono font-bold text-slate-900">FOLIO: {selectedRecord.code}</div>
                  <div>Fecha: {selectedRecord.signedDate}</div>
                </div>
              </div>

              <div className="text-center py-2">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  DECLARACIÓN JURADA INSTITUCIONAL
                </h3>
                <p className="text-xs text-blue-900 font-semibold mt-1">
                  {selectedRecord.type}
                </p>
              </div>

              {/* Trainee Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Colaborador:</span>{' '}
                  <strong className="text-slate-900">{selectedRecord.traineeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">RUT:</span>{' '}
                  <strong className="font-mono text-slate-900">{selectedRecord.rut}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Empresa Filial:</span>{' '}
                  <strong className="text-slate-900">{selectedRecord.empresa}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Cargo / Faena:</span>{' '}
                  <strong className="text-slate-900">{selectedRecord.cargo} ({selectedRecord.area})</strong>
                </div>
              </div>

              {/* Clauses */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-900 uppercase tracking-wide text-[11px]">
                  Cláusulas y Términos Aceptados:
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-700 text-justify leading-relaxed">
                  {selectedRecord.clauses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Cryptographic stamp & signature */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 items-center">
                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50 text-[10px] space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TIMBRE DE VALIDACIÓN DIGITAL</span>
                  </div>
                  <div>Algoritmo: SHA-256 HMAC Digital Stamp</div>
                  <div className="font-mono text-slate-600 break-all">
                    {selectedRecord.hashSha256}
                  </div>
                  <div className="text-slate-400">Estado: Válido para fiscalización laboral</div>
                </div>

                <div className="text-center">
                  <div className="h-16 flex items-center justify-center">
                    {selectedRecord.signatureImage ? (
                      <img
                        src={selectedRecord.signatureImage}
                        alt="Firma manuscrita"
                        className="max-h-14 max-w-full object-contain"
                      />
                    ) : (
                      <div className="font-serif italic text-lg text-slate-800">
                        {selectedRecord.traineeName}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-900">
                    Firma del Colaborador
                  </div>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    RUT: {selectedRecord.rut}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
