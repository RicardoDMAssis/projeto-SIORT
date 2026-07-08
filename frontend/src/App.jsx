import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Presentation from './components/Presentation/Presentation';
import VideoSection from './components/VideoSection/VideoSection';
import BodyExplorer from './components/BodyExplorer/BodyExplorer';
import Registration from './components/Registration/Registration';
import Minicourses from './components/Minicourses/Minicourses';
import Certificates from './components/Certificates/Certificates';
import Footer from './components/Footer/Footer';
import GeneralLogin from './components/GeneralLogin/GeneralLogin';
import StudentHub from './components/StudentHub/StudentHub';
import AdminPanel from './components/AdminPanel/AdminPanel';
import useScrollSpy from './hooks/useScrollSpy';
import {
  fetchCourses,
  getParticipantCount,
  registerParticipant,
  loginParticipant,
  toggleEnrollment,
  fetchEnrollments,
} from './services/api';

// Section IDs for the scroll spy
const SECTION_IDS = ['home', 'apresentacao', 'implantes', 'inscricao', 'minicursos', 'certificados'];

const buildAdminPath = (route = 'overview') => {
  switch (route) {
    case 'students':
      return '/admin/students';
    case 'subscriptions':
      return '/admin/subscriptions';
    case 'courses':
      return '/admin/courses';
    default:
      return '/admin';
  }
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'student-hub' | 'admin'
  const [adminRoute, setAdminRoute] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [activeUser, setActiveUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState([]);

  // Scroll spy tracking
  const activeSection = useScrollSpy(SECTION_IDS);

  const navigateToView = useCallback((nextView, nextRoute = 'overview') => {
    setView(nextView);
    if (nextView === 'admin') {
      setAdminRoute(nextRoute);
    } else {
      setAdminRoute('overview');
    }

    if (typeof window !== 'undefined') {
      const path = nextView === 'admin' ? buildAdminPath(nextRoute) : '/';
      window.history.pushState({}, '', path);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    if (pathname.startsWith('/admin')) {
      const route = pathname.includes('/courses')
        ? 'courses'
        : pathname.includes('/subscriptions')
          ? 'subscriptions'
          : pathname.includes('/students')
            ? 'students'
            : 'overview';
      setView('admin');
      setAdminRoute(route);
    } else if (pathname === '/login') {
      setView('login');
    } else if (pathname === '/student-hub') {
      setView('student-hub');
    } else {
      setView('landing');
    }
  }, []);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [loadedCourses, count] = await Promise.all([
        fetchCourses(),
        getParticipantCount(),
      ]);
      setCourses(loadedCourses);
      setParticipantCount(count);
    } catch (err) {
      console.error('[SIORT] Erro ao carregar dados iniciais do backend:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When returning to landing, reload courses in case admin changed them
  useEffect(() => {
    if (view === 'landing') {
      loadData();
    }
  }, [view, loadData]);

  const handleRegister = useCallback(async (formData) => {
    const newParticipant = await registerParticipant(formData.name, formData.email, formData.phone, formData.cpf);
    setActiveUser(newParticipant);
    setUserEnrollments([]);
    
    // Refresh participant count
    try {
      const count = await getParticipantCount();
      setParticipantCount(count);
    } catch (err) {
      console.error(err);
    }
    console.log('[SIORT] Nova inscrição registrada no backend:', newParticipant);
  }, []);

  const handleLogin = useCallback(async (email) => {
    const user = await loginParticipant(email);
    setActiveUser(user);
    
    // Fetch user enrollments
    try {
      const enrolls = await fetchEnrollments(email);
      setUserEnrollments(enrolls.map((en) => en.courseId));
    } catch (err) {
      console.error('[SIORT] Erro ao buscar inscrições do usuário:', err);
      setUserEnrollments([]);
    }

    if (user.role === 'admin') {
      navigateToView('admin', 'overview');
    } else {
      navigateToView('student-hub');
    }
    console.log('[SIORT] Usuário conectado:', user);
  }, []);

  const handleEnroll = useCallback(async (email, courseId) => {
    try {
      const result = await toggleEnrollment(email, courseId);
      // Refresh enrollments
      const enrolls = await fetchEnrollments(email);
      setUserEnrollments(enrolls.map((en) => en.courseId));
      console.log('[SIORT] Matrícula alterada com sucesso:', result);
    } catch (err) {
      console.error('[SIORT] Erro ao realizar matrícula:', err);
    }
  }, []);

  return (
    <>
      <Navbar 
        activeSection={activeSection} 
        onNavigate={(nextView) => {
          if (nextView === 'admin') {
            navigateToView('admin', 'overview');
          } else {
            navigateToView(nextView);
          }
        }} 
        currentView={view} 
        activeUser={activeUser}
        onLogout={() => {
          setActiveUser(null);
          setUserEnrollments([]);
          navigateToView('landing');
        }}
      />

      {view === 'landing' && (
        <main>
          {/* Hero Section */}
          <Hero />

          {/* Apresentação do Congresso */}
          <Presentation />

          {/* Vídeos do Evento */}
          <VideoSection />

          {/* Exploração Interativa 3D */}
          <BodyExplorer />

          {/* Inscrição no Evento */}
          <Registration
            participantCount={participantCount}
            onRegister={handleRegister}
            activeUser={activeUser}
            onLogin={handleLogin}
          />

          {/* Minicursos */}
          <Minicourses
            activeUser={activeUser}
            courses={courses}
            userEnrollments={userEnrollments}
            onEnroll={handleEnroll}
            onLogin={handleLogin}
          />

          {/* Certificados */}
          <Certificates />
        </main>
      )}

      {view === 'login' && (
        <GeneralLogin
          onLogin={handleLogin}
          onBackToLanding={() => setView('landing')}
        />
      )}

      {view === 'student-hub' && (
        <StudentHub
          activeUser={activeUser}
          courses={courses}
          userEnrollments={userEnrollments}
          onEnroll={handleEnroll}
          onLogout={() => {
            setActiveUser(null);
            setUserEnrollments([]);
            navigateToView('landing');
          }}
        />
      )}

      {view === 'admin' && (
        <AdminPanel
          currentRoute={adminRoute}
          onNavigateRoute={setAdminRoute}
          onBackToLanding={() => navigateToView('landing')}
        />
      )}

      <Footer />
    </>
  );
}
