import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Trainee } from '../../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  trainee: Trainee | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificateId,
  trainee,
}) => {
  if (!isOpen || !trainee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Top interactive toolbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">Certificado Oficial emitido</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-slate-300">{certificateId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Certificado</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 sm:p-12 bg-white relative print:p-0">
          {/* Subtle ornate border */}
          <div className="border-4 border-double border-slate-800 p-8 sm:p-10 text-center relative bg-gradient-to-b from-white via-slate-50/50 to-white">
            {/* Corner flourishes */}
            <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">
              REGISTRO SENCE #2026-CL
            </div>
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono">
              FOLIO: {certificateId}
            </div>

            {/* Emblem / Header */}
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-md">
              CIF
            </div>

            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              CIF EDTECH HOLDING &middot; INSTITUTO DE CAPACITACIÓN LABORAL
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide mb-6">
              DIPLOMA DE CERTIFICACIÓN
            </h1>

            <p className="text-xs text-slate-600 mb-2">
              Se otorga el presente reconocimiento oficial a:
            </p>

            <div className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight mb-1 border-b border-slate-300 inline-block px-8 pb-1">
              {trainee.name}
            </div>

            <p className="text-xs text-slate-500 mb-6 font-mono">
              RUT: {trainee.rut} &middot; {trainee.empresa} ({trainee.cargo})
            </p>

            <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed mb-6">
              Por haber completado y aprobado satisfactoriamente con calificación{' '}
              <strong className="text-slate-900 font-mono font-bold">{trainee.grade.toFixed(1)}/7.0</strong> el programa corporativo de formación continua:
            </p>

            <div className="text-base sm:text-lg font-bold text-slate-900 mb-3 bg-slate-100/70 p-3 rounded-xl border border-slate-200">
              {trainee.courseName}
            </div>

            <div className="text-xs text-slate-600 mb-8">
              Con una duración lectiva de <strong className="text-slate-900">{trainee.totalHours} horas cronológicas</strong>, cumpliendo con los estándares de asistencia, suscripción de Declaración Jurada y evaluación teórica-práctica.
            </div>

            {/* Bottom Row: Signatures & QR */}
            <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-slate-200 text-xs">
              <div className="text-center">
                <div className="border-t border-slate-400 pt-2 font-bold text-slate-800 text-[11px]">
                  Dra. Elena Silva V.
                </div>
                <div className="text-[10px] text-slate-500">Dirección Académica CIF</div>
              </div>

              {/* QR Verification */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border border-slate-300 p-1 rounded-lg bg-white flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-mono">
                  Validador QR Oficial
                </div>
              </div>

              <div className="text-center">
                <div className="border-t border-slate-400 pt-2 font-bold text-slate-800 text-[11px]">
                  Rodrigo Morales P.
                </div>
                <div className="text-[10px] text-slate-500">Jefe de Capacitación SENCE</div>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verificación de autenticidad en tiempo real en https://akadem-diplomas-certificados.vercel.app/</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
