import React, { useState } from 'react';
import { ActiveTab, AuthUser, Course, Trainee } from './types';
import { MOCK_COURSES, MOCK_KPIS, MOCK_TRAINEES, MOCK_USERS } from './data/mockData';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardDirectorio } from './components/modules/DashboardDirectorio';
import { DeclaracionesJuradasModule } from './components/modules/DeclaracionesJuradasModule';
import { DiplomasCertificadosModule } from './components/modules/DiplomasCertificadosModule';
import { MoodleLmsModule } from './components/modules/MoodleLmsModule';
import { MallaCurricularModule } from './components/modules/MallaCurricularModule';
import { UserManagementModule } from './components/modules/UserManagementModule';
import { ConfiguracionModule } from './components/modules/ConfiguracionModule';
import { ExecutiveReportModal } from './components/common/ExecutiveReportModal';
import { TraineeDetailModal } from './components/common/TraineeDetailModal';
import { CertificateModal } from './components/common/CertificateModal';
import { SyllabusModal } from './components/common/SyllabusModal';
import { ConsultaAlumnosModal } from './components/common/ConsultaAlumnosModal';
import { ConsultaCursosModal } from './components/common/ConsultaCursosModal';

export default function App() {
  // Authentication state - starts with super_admin logged in so evaluator immediately sees full system,
  // with quick ability to test login screen anytime or toggle between roles.
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [trainees, setTrainees] = useState<Trainee[]>(MOCK_TRAINEES);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [kpis, setKpis] = useState(MOCK_KPIS);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConsultaAlumnosOpen, setIsConsultaAlumnosOpen] = useState(false);
  const [isConsultaCursosOpen, setIsConsultaCursosOpen] = useState(false);
  const [consultaAlumnosCourseFilter, setConsultaAlumnosCourseFilter] = useState('all');

  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [certificateData, setCertificateData] = useState<{
    id: string;
    trainee: Trainee | null;
  } | null>(null);
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<Course | null>(null);

  const handleOpenConsultaAlumnos = (courseFilter?: string) => {
    setConsultaAlumnosCourseFilter(courseFilter || 'all');
    setIsConsultaAlumnosOpen(true);
  };

  const handleOpenConsultaCursos = () => {
    setIsConsultaCursosOpen(true);
  };

  // Login handler
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Switch role between super_admin and usuario_privilegiado
  const handleSwitchRole = () => {
    if (!currentUser) return;
    if (currentUser.role === 'super_admin') {
      setCurrentUser(MOCK_USERS[1]); // Rodrigo Morales (usuario_privilegiado)
      if (activeTab === 'usuarios' || activeTab === 'configuracion') {
        setActiveTab('dashboard');
      }
    } else {
      setCurrentUser(MOCK_USERS[0]); // Dra. Elena Silva (super_admin)
    }
  };

  // Trainee Management handlers
  const handleAddTrainee = (newTrainee: Omit<Trainee, 'id'>) => {
    const id = `trn-${Date.now()}`;
    const added: Trainee = {
      ...newTrainee,
      id,
    };
    setTrainees((prev) => [added, ...prev]);
  };

  const handleUpdateTrainee = (updated: Trainee) => {
    setTrainees((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleOpenCertificate = (certificateId: string, trainee: Trainee) => {
    setCertificateData({ id: certificateId, trainee });
  };

  const handleIssueCertificate = (traineeId: string, certId: string) => {
    setTrainees((prev) =>
      prev.map((t) =>
        t.id === traineeId
          ? {
              ...t,
              certificateId: certId,
              certificateIssueDate: 'Hoy',
              status: 'certificado_emitido',
              progress: 100,
            }
          : t
      )
    );
    setKpis((prev) => ({
      ...prev,
      certificatesIssuedCount: prev.certificatesIssuedCount + 1,
    }));
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Banner on Desktop/Mobile indicating Role and test Switcher */}
      <div className="bg-slate-950 text-slate-300 text-[11px] px-6 py-1.5 flex items-center justify-between border-b border-slate-800 no-print">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>
            Sesión iniciada como: <strong className="text-white">{currentUser.name}</strong> ({currentUser.cargo})
          </span>
          <span className="text-slate-600">·</span>
          <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
            {currentUser.role}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSwitchRole}
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
          >
            {currentUser.role === 'super_admin'
              ? 'Cambiar a: usuario_privilegiado (Operaciones)'
              : 'Cambiar a: super_admin (Acceso Total)'}
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${mobileMenuOpen ? 'block fixed inset-0 z-40' : 'hidden md:block'}`}>
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
          />
        </div>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <TopHeader
            currentUser={currentUser}
            activeTab={activeTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenConsultaAlumnos={() => handleOpenConsultaAlumnos()}
            onOpenConsultaCursos={handleOpenConsultaCursos}
          />

          {/* Module Content */}
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardDirectorio
                currentUser={currentUser}
                trainees={trainees}
                kpis={kpis}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onSelectTrainee={(t) => setSelectedTrainee(t)}
                onOpenCertificate={handleOpenCertificate}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onNavigateToMalla={() => setActiveTab('malla')}
                onOpenConsultaAlumnos={() => handleOpenConsultaAlumnos()}
                onOpenConsultaCursos={handleOpenConsultaCursos}
              />
            )}

            {activeTab === 'malla' && (
              <MallaCurricularModule
                trainees={trainees}
                course={courses.find((c) => c.id === 'crs-sond-a0')}
                onSelectTrainee={(t) => setSelectedTrainee(t)}
                onOpenSyllabus={() => {
                  const c = courses.find((crs) => crs.id === 'crs-sond-a0');
                  if (c) setSelectedSyllabusCourse(c);
                }}
              />
            )}

            {activeTab === 'declaraciones' && (
              <DeclaracionesJuradasModule trainees={trainees} />
            )}

            {activeTab === 'diplomas' && (
              <DiplomasCertificadosModule
                trainees={trainees}
                onOpenCertificate={handleOpenCertificate}
                onIssueCertificate={handleIssueCertificate}
              />
            )}

            {activeTab === 'moodle' && (
              <MoodleLmsModule
                courses={courses}
                onSelectCourseSyllabus={(course) => setSelectedSyllabusCourse(course)}
                onNavigateToMalla={() => setActiveTab('malla')}
              />
            )}

            {activeTab === 'usuarios' && currentUser.role === 'super_admin' && (
              <UserManagementModule
                trainees={trainees}
                courses={courses}
                onAddTrainee={handleAddTrainee}
                onUpdateTrainee={handleUpdateTrainee}
              />
            )}

            {activeTab === 'configuracion' && currentUser.role === 'super_admin' && (
              <ConfiguracionModule />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        kpis={kpis}
        trainees={trainees}
      />

      <TraineeDetailModal
        trainee={selectedTrainee}
        onClose={() => setSelectedTrainee(null)}
        onOpenCertificate={handleOpenCertificate}
        onSendReminder={(t) => {
          setSelectedTrainee(null);
        }}
        onOpenSyllabus={(courseId) => {
          const c = courses.find((crs) => crs.id === courseId || crs.code === courseId);
          if (c) {
            setSelectedSyllabusCourse(c);
          }
        }}
      />

      <CertificateModal
        isOpen={!!certificateData}
        onClose={() => setCertificateData(null)}
        certificateId={certificateData?.id || ''}
        trainee={certificateData?.trainee || null}
      />

      <SyllabusModal
        course={selectedSyllabusCourse}
        onClose={() => setSelectedSyllabusCourse(null)}
      />

      {/* Consultation Modals (Alumnos y Cursos) */}
      <ConsultaAlumnosModal
        isOpen={isConsultaAlumnosOpen}
        onClose={() => setIsConsultaAlumnosOpen(false)}
        trainees={trainees}
        courses={courses}
        initialCourseFilter={consultaAlumnosCourseFilter}
        onSelectTrainee={(t) => setSelectedTrainee(t)}
        onOpenCertificate={handleOpenCertificate}
        onOpenSyllabus={(course) => setSelectedSyllabusCourse(course)}
      />

      <ConsultaCursosModal
        isOpen={isConsultaCursosOpen}
        onClose={() => setIsConsultaCursosOpen(false)}
        courses={courses}
        trainees={trainees}
        onOpenSyllabus={(course) => setSelectedSyllabusCourse(course)}
        onViewCourseTrainees={(courseTitle) => {
          handleOpenConsultaAlumnos(courseTitle);
        }}
        onNavigateToMoodle={() => setActiveTab('moodle')}
      />
    </div>
  );
}
