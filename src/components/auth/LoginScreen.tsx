import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser, UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockData';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin.corporativo');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const foundUser = MOCK_USERS.find(
        (u) => u.username.toLowerCase() === trimmedUser
      );

      if (!foundUser) {
        setError('Usuario o credenciales no reconocidas en el directorio activo.');
        setLoading(false);
        return;
      }

      // Check simple simulated password
      if (
        (foundUser.role === 'super_admin' && password !== 'admin123') ||
        (foundUser.role === 'usuario_privilegiado' && password !== 'user123')
      ) {
        setError('Contraseña incorrecta. Utilice las credenciales predeterminadas.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onLogin(foundUser);
    }, 400);
  };

  const handleSelectRolePreset = (role: UserRole) => {
    if (role === 'super_admin') {
      setUsername('admin.corporativo');
      setPassword('admin123');
    } else {
      setUsername('supervisor.rrhh');
      setPassword('user123');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top institutional subtle header */}
      <div className="w-full border-b border-slate-800 bg-slate-950/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md text-xs">
            CIF
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">CIF</span>
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline">Portal Corporativo de Capacitación & Gestión</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acceso Seguro SSO Corporativo</span>
        </div>
      </div>

      {/* Main card area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Iniciar Sesión</h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Ingrese sus credenciales corporativas para acceder a la Intranet
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Usuario Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="ej. admin.corporativo"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clave de acceso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar a la Intranet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher with realistic role profiles */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="block text-xs font-medium text-slate-400 mb-3 text-center">
              Acceso rápido para evaluación (Roles configurados):
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectRolePreset('super_admin')}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  username === 'admin.corporativo'
                    ? 'bg-blue-950/40 border-blue-500/60 text-blue-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span>1. Rol Super Admin</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                      super_admin
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Elena Silva · Acceso total, Directorio & Configuración
                  </div>
                </div>
                {username === 'admin.corporativo' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectRolePreset('usuario_privilegiado')}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  username === 'supervisor.rrhh'
                    ? 'bg-blue-950/40 border-blue-500/60 text-blue-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span>2. Rol Usuario Privilegiado</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      usuario_privilegiado
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Rodrigo Morales · Operaciones, Declaraciones & Certificados
                  </div>
                </div>
                {username === 'supervisor.rrhh' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        CIF Corporativo &copy; 2026 · Plataforma homologada bajo estándares SENCE y Ley 16.744
      </footer>
    </div>
  );
};
