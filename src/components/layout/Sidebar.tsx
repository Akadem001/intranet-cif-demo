import React from 'react';
import { 
  BarChart3, 
  FileCheck2, 
  Award, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Briefcase,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ActiveTab, AuthUser } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: AuthUser;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onSwitchRole,
}) => {
  const isSuperAdmin = currentUser.role === 'super_admin';

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard & Directorio',
      icon: BarChart3,
      badge: 'Reportes KPIs',
      allowedRoles: ['super_admin', 'usuario_privilegiado'],
      description: 'Métricas gerenciales y seguimiento',
    },
    {
      id: 'malla' as ActiveTab,
      label: 'Malla Curricular',
      icon: Layers,
      badge: 'Sondaje 52h',
      allowedRoles: ['super_admin', 'usuario_privilegiado'],
      description: 'Ruta técnica A0 · Geotec',
    },
    {
      id: 'declaraciones' as ActiveTab,
      label: 'Declaraciones Juradas',
      icon: FileCheck2,
      badge: 'Integración',
      allowedRoles: ['super_admin', 'usuario_privilegiado'],
      description: 'Firma y validación digital',
    },
    {
      id: 'diplomas' as ActiveTab,
      label: 'Diplomas y Certificados',
      icon: Award,
      badge: 'Verificación QR',
      allowedRoles: ['super_admin', 'usuario_privilegiado'],
      description: 'Emisión y folios oficiales',
    },
    {
      id: 'moodle' as ActiveTab,
      label: 'Campus Virtual Moodle',
      icon: GraduationCap,
      badge: 'LMS Activo',
      allowedRoles: ['super_admin', 'usuario_privilegiado'],
      description: 'Aulas, cursos y notas',
    },
    {
      id: 'usuarios' as ActiveTab,
      label: 'Gestión de Usuarios',
      icon: Users,
      badge: isSuperAdmin ? 'Admin' : 'Restringido',
      allowedRoles: ['super_admin'],
      description: 'Control de accesos y roles',
    },
    {
      id: 'configuracion' as ActiveTab,
      label: 'Configuración Sistema',
      icon: Settings,
      badge: 'Directorio',
      allowedRoles: ['super_admin'],
      description: 'Parámetros institucionales',
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-xs">
              CIF
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>CIF</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded">
                  INTRANET
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Capacitación & Gestión</p>
            </div>
          </div>
        </div>

        {/* Role status banner */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSuperAdmin ? 'bg-amber-400' : 'bg-blue-400'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-300">
              {isSuperAdmin ? 'Rol: Super Administrador' : 'Rol: Usuario Privilegiado'}
            </span>
          </div>
          <button
            onClick={onSwitchRole}
            title="Alternar entre super_admin y usuario_privilegiado para pruebas"
            className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
          >
            Cambiar rol
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Módulos Corporativos
          </div>

          {navItems.map((item) => {
            const hasAccess = item.allowedRoles.includes(currentUser.role);
            const isActive = activeTab === item.id;

            if (!hasAccess && !isSuperAdmin) {
              return null; // hide for normal privileged user
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ml-2 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile block & logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
              {currentUser.avatarInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.cargo}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400">
            Soporte TI: soporte@cif.cl
          </span>
        </div>
      </div>
    </aside>
  );
};
