import React, { useState } from 'react';
import { 
  Bell, 
  FileSpreadsheet, 
  Search, 
  Building, 
  Clock, 
  FileText,
  X,
  CheckCircle2,
  Menu,
  Users,
  BookOpen,
  Download
} from 'lucide-react';
import { ActiveTab, AuthUser } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

interface TopHeaderProps {
  currentUser: AuthUser;
  activeTab: ActiveTab;
  onOpenReportModal: () => void;
  onOpenMobileMenu?: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenConsultaAlumnos?: () => void;
  onOpenConsultaCursos?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  activeTab,
  onOpenReportModal,
  onOpenMobileMenu,
  searchTerm,
  onSearchChange,
  onOpenConsultaAlumnos,
  onOpenConsultaCursos,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard de Seguimiento & Reportería';
      case 'malla':
        return 'Malla Curricular · Ruta Técnica de Sondaje (52 hrs)';
      case 'declaraciones':
        return 'Módulo 1: Declaraciones Juradas Digitales';
      case 'diplomas':
        return 'Módulo 2: Diplomas y Certificados Oficiales';
      case 'moodle':
        return 'Módulo 3: Campus Virtual Moodle LMS';
      case 'usuarios':
        return 'Gestión de Usuarios y Asignación de Roles';
      case 'configuracion':
        return 'Configuración del Sistema Corporativo';
      default:
        return 'Intranet Corporativa';
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 z-10">
      {/* Zone 1: Breadcrumb navigation */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
          <span className="font-medium text-slate-700">Intranet CIF</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900 truncate">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Zone 2: Quick Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar colaborador por nombre, RUT, curso o área..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Zone 3: Actions & Notifications */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Avisos y notificaciones del sistema"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-800">
                  Notificaciones del Sistema ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      n.unread ? 'bg-blue-50/60 font-medium' : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>{n.category}</span>
                      <span>{n.time}</span>
                    </div>
                    <div className="text-slate-800 text-xs">{n.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Query Action Buttons */}
        {onOpenConsultaAlumnos && (
          <button
            onClick={onOpenConsultaAlumnos}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            title="Abrir buscador y ficha rápida de alumnos"
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Consulta Alumnos</span>
          </button>
        )}

        {onOpenConsultaCursos && (
          <button
            onClick={onOpenConsultaCursos}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            title="Abrir catálogo y consulta de cursos y mallas"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Consulta Cursos</span>
          </button>
        )}

        {/* Download Standalone HTML Button */}
        <a
          href="/cif_intranet_aplicacion.html"
          download="cif_intranet_corporativa.html"
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          title="Descargar la aplicación completa en un único archivo HTML autónomo para abrir offline"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Bajar HTML Autónomo</span>
          <span className="sm:inline hidden text-[10px] bg-emerald-200/80 px-1 py-0.5 rounded text-emerald-900 font-bold">.html</span>
        </a>

        {/* Primary Action Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Informe para el Directorio</span>
          <span className="sm:hidden">Informe</span>
        </button>
      </div>
    </header>
  );
};
