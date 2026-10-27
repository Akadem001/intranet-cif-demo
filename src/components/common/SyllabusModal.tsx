import React from 'react';
import { X, BookOpen, Clock, Users, GraduationCap, ExternalLink, CheckCircle } from 'lucide-react';
import { Course } from '../../types';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl ${course.curriculumMalla ? 'max-w-4xl' : 'max-w-2xl'} w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900`}>
        <div className={`p-6 bg-gradient-to-r ${course.bannerColor} text-white flex items-start justify-between`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
              {course.code} &middot; {course.category}
            </span>
            <h2 className="text-base font-bold mt-2 text-white">{course.title}</h2>
            <p className="text-xs text-white/80 mt-1">Docente Responsable: {course.instructor}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              Descripción del Programa
            </h3>
            <p className="text-slate-600 leading-relaxed text-justify">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-500 block">Horas SENCE</span>
              <span className="font-bold text-xs text-slate-900 tabular-nums">{course.durationHours} hrs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Colaboradores Inscritos</span>
              <span className="font-bold text-xs text-slate-900 tabular-nums">{course.enrolledCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Promedio Calificación</span>
              <span className="font-bold text-xs text-emerald-700 font-mono tabular-nums">{course.averageScore.toFixed(1)}/7.0</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Estructura Modular & Contenidos {course.curriculumMalla ? 'de la Malla Curricular' : 'en Moodle LMS'}
            </h3>

            {course.curriculumMalla ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {course.curriculumMalla.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between bg-white shadow-xs"
                  >
                    <div>
                      <div
                        className="p-3 text-white flex items-center justify-between"
                        style={{ backgroundColor: mod.headerBgHex }}
                      >
                        <div>
                          <div className="text-[10px] font-bold uppercase">{mod.moduleNumber}</div>
                          <div className="text-[10px] font-extrabold uppercase tracking-wider">{mod.actionVerb}</div>
                        </div>
                        <div className="text-sm font-bold">{mod.totalHours} h</div>
                      </div>

                      <div className="p-3">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug mb-2">
                          {mod.title}
                        </h4>
                        <ul className="space-y-1.5 text-[11px] text-slate-600">
                          {mod.topics.map((t, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center text-[10px]">
                        <div className="bg-slate-50 p-1 rounded font-mono">
                          <span className="font-bold block text-slate-800">{mod.ht}</span>
                          <span className="text-slate-400">HT</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded font-mono">
                          <span className="font-bold block text-slate-800">{mod.hp}</span>
                          <span className="text-slate-400">HP</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded font-mono">
                          <span className="font-bold block text-slate-800">{mod.ept}</span>
                          <span className="text-slate-400">EPT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {course.modules.map((mod, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {index + 1}
                    </div>
                    <div className="text-slate-800 font-medium flex-1">{mod}</div>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
            >
              Cerrar
            </button>

            <a
              href={course.moodleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Acceder al Aula en Moodle</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
