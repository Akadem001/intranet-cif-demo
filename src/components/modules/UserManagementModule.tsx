import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { Course, ProcessStatus, Trainee } from '../../types';

interface UserManagementModuleProps {
  trainees: Trainee[];
  courses: Course[];
  onAddTrainee: (newTrainee: Omit<Trainee, 'id'>) => void;
  onUpdateTrainee: (trainee: Trainee) => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  trainees,
  courses,
  onAddTrainee,
  onUpdateTrainee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('Minera Centinela');
  const [area, setArea] = useState('Operaciones & Logística');
  const [cargo, setCargo] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [status, setStatus] = useState<ProcessStatus>('iniciado');
  const [progress, setProgress] = useState(25);
  const [grade, setGrade] = useState(6.0);

  const resetForm = () => {
    setName('');
    setRut('');
    setEmail('');
    setEmpresa('Minera Centinela');
    setArea('Operaciones & Logística');
    setCargo('');
    setCourseId(courses[0]?.id || '');
    setStatus('iniciado');
    setProgress(25);
    setGrade(6.0);
    setEditingTrainee(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Trainee) => {
    setEditingTrainee(t);
    setName(t.name);
    setRut(t.rut);
    setEmail(t.email);
    setEmpresa(t.empresa);
    setArea(t.area);
    setCargo(t.cargo);
    setCourseId(t.assignedCourseId);
    setStatus(t.status);
    setProgress(t.progress);
    setGrade(t.grade);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCourseObj = courses.find((c) => c.id === courseId);
    const courseTitle = selectedCourseObj ? selectedCourseObj.title : 'Curso General';
    const totalHours = selectedCourseObj ? selectedCourseObj.durationHours : 20;
    const hoursCompleted = Math.round((progress / 100) * totalHours);

    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    if (editingTrainee) {
      onUpdateTrainee({
        ...editingTrainee,
        name,
        rut,
        email,
        empresa,
        area,
        cargo,
        assignedCourseId: courseId,
        courseName: courseTitle,
        status,
        progress,
        hoursCompleted,
        totalHours,
        grade,
        avatarInitials: initials || 'CO',
      });
    } else {
      onAddTrainee({
        name,
        rut,
        email,
        empresa,
        area,
        cargo,
        assignedCourseId: courseId,
        courseName: courseTitle,
        status,
        progress,
        hoursCompleted,
        totalHours,
        grade,
        lastAccess: 'Hoy',
        affidavitStatus: 'pendiente',
        avatarInitials: initials || 'CO',
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const filtered = trainees.filter((t) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.rut.toLowerCase().includes(q) ||
      t.empresa.toLowerCase().includes(q) ||
      t.area.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Super Admin
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Gestión de Usuarios & Colaboradores
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administración centralizada de nóminas de colaboradores, filiales corporativas y asignación de cursos SENCE.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inscribir Nuevo Colaborador</span>
        </button>
      </div>

      {/* Table section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Padrón Corporativo: <strong className="text-slate-800">{trainees.length}</strong> colaboradores activos
          </div>
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar colaborador..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">Colaborador / RUT</th>
                <th className="py-2.5 px-4">Empresa / Área</th>
                <th className="py-2.5 px-4">Curso Asignado</th>
                <th className="py-2.5 px-4">Avance</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      RUT: {t.rut} · {t.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{t.empresa}</div>
                    <div className="text-[11px] text-slate-500">{t.area} · {t.cargo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium truncate max-w-xs">{t.courseName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 tabular-nums">{t.progress}%</span>
                    <span className="text-[11px] text-slate-500 ml-1">({t.hoursCompleted}/{t.totalHours} hrs)</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-slate-700 font-medium">
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar registro del colaborador"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingTrainee ? 'Editar Colaborador' : 'Inscribir Nuevo Colaborador'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Marcela Castro Pérez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    RUT (con guión)
                  </label>
                  <input
                    type="text"
                    required
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="ej. 17.521.904-8"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Email Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.castro@empresa.cl"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Cargo / Puesto
                  </label>
                  <input
                    type="text"
                    required
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="ej. Jefe de Turno"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Empresa Filial
                  </label>
                  <select
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Geotec Boyles Bros">Geotec Boyles Bros</option>
                    <option value="Minera Centinela">Minera Centinela</option>
                    <option value="Retail Andino & Logística">Retail Andino & Logística</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Área / Gerencia
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Geología & Perforación DDH">Geología & Perforación DDH</option>
                    <option value="Operaciones Mina & Concentradora">Operaciones Mina & Concentradora</option>
                    <option value="Logística & Cadena de Suministro">Logística & Cadena de Suministro</option>
                    <option value="Mantenimiento & Equipos">Mantenimiento & Equipos</option>
                    <option value="Prevención de Riesgos y SSO">Prevención de Riesgos y SSO</option>
                    <option value="Gestión de Personas & OTEC">Gestión de Personas & OTEC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Programa de Capacitación Asignado
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.durationHours} hrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Estado del Proceso
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProcessStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="iniciado">Iniciado</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="evaluacion_pendiente">Evaluación Pendiente</option>
                    <option value="certificado_emitido">Certificado Emitido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Avance ({progress}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Calificación
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="7.0"
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm cursor-pointer"
                >
                  {editingTrainee ? 'Guardar Cambios' : 'Registrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
