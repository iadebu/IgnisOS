import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import caliDevsAuth from './auth-service';

// Icons as SVG components (no external dependencies)
const Icons = {
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  MessageSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Edit2: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  ),
  Trash2: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Monitor: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Tablet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  Smartphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  Link: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  ),
  Loader2: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Folder: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  )
};

// CSS Styles - CaliDevs Brand
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg-dark: #2d3748;
    --bg-darker: #1a202c;
    --bg-card: #3d4a5c;
    --bg-card-hover: #4a5a6e;
    --accent: #FF6B35;
    --accent-hover: #ff8555;
    --accent-glow: rgba(255, 107, 53, 0.3);
    --light: #f8f6f3;
    --light-muted: rgba(248, 246, 243, 0.7);
    --light-faded: rgba(248, 246, 243, 0.5);
    --success: #48bb78;
    --warning: #ecc94b;
    --danger: #fc8181;
    --border: rgba(248, 246, 243, 0.1);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-darker);
    color: var(--light);
    min-height: 100vh;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, var(--accent-glow) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.15) 0%, transparent 40%),
      linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 100%);
    z-index: -1;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  .pulse-animation {
    animation: pulse 0.5s ease-in-out 2;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Main App Component
export default function MarkupApp() {
  const [currentView, setCurrentView] = useState('loading');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [guestName, setGuestName] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [directProjectId, setDirectProjectId] = useState(null);

  // Get project ID from URL
  const getProjectIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('project');
  };

  // Update URL without reload
  const updateUrl = (projectId = null) => {
    const url = new URL(window.location.href);
    if (projectId) {
      url.searchParams.set('project', projectId);
    } else {
      url.searchParams.delete('project');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Initialize auth and check URL
  useEffect(() => {
    const init = async () => {
      const projectIdFromUrl = getProjectIdFromUrl();
      
      // Wait for auth to initialize
      await caliDevsAuth.waitForInit();
      const currentUser = caliDevsAuth.getUser();
      
      if (projectIdFromUrl) {
        // Direct access to project
        setDirectProjectId(projectIdFromUrl);
        
        if (currentUser) {
          // Logged in user accessing project
          setUser({
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            isGuest: false
          });
          await loadProjectById(projectIdFromUrl);
        } else {
          // Guest accessing project - show name modal
          const savedGuestName = localStorage.getItem('markupGuestName');
          if (savedGuestName) {
            setGuestName(savedGuestName);
            setUser({ name: savedGuestName, isGuest: true });
            await loadProjectById(projectIdFromUrl);
          } else {
            setShowGuestModal(true);
            setLoading(false);
          }
        }
      } else {
        // Dashboard access - requires login
        if (currentUser) {
          setUser({
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            isGuest: false
          });
          await loadProjects();
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
          setLoading(false);
        }
      }
    };

    init();

    // Listen for auth changes
    const unsubscribe = caliDevsAuth.onAuthStateChange((authUser) => {
      if (authUser && currentView === 'login') {
        setUser({
          name: authUser.displayName || authUser.email.split('@')[0],
          email: authUser.email,
          isGuest: false
        });
        loadProjects();
        setCurrentView('dashboard');
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const projectId = getProjectIdFromUrl();
      if (projectId && projects.length > 0) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setSelectedProject(project);
          setCurrentView('markup');
        }
      } else if (!projectId && user && !user.isGuest) {
        setCurrentView('dashboard');
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [projects, user]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectById = async (projectId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      
      if (data) {
        setSelectedProject(data);
        setCurrentView('markup');
      } else {
        // Project not found
        setCurrentView('notfound');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setCurrentView('notfound');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = async (name) => {
    localStorage.setItem('markupGuestName', name);
    setGuestName(name);
    setUser({ name, isGuest: true });
    setShowGuestModal(false);
    await loadProjectById(directProjectId);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('markup');
    updateUrl(project.id);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
    updateUrl(null);
    if (user && !user.isGuest) {
      loadProjects();
    }
  };

  const handleLogout = async () => {
    await caliDevsAuth.logout();
    setUser(null);
    setProjects([]);
    setCurrentView('login');
  };

  // Loading state
  if (currentView === 'loading' || (loading && !showGuestModal)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-darker)'
      }}>
        <Icons.Loader2 />
      </div>
    );
  }

  // Guest name modal
  if (showGuestModal) {
    return <GuestNameModal onSubmit={handleGuestSubmit} />;
  }

  // Login view
  if (currentView === 'login') {
    return <LoginView onSuccess={() => {
      const authUser = caliDevsAuth.getUser();
      setUser({
        name: authUser.displayName || authUser.email.split('@')[0],
        email: authUser.email,
        isGuest: false
      });
      loadProjects();
      setCurrentView('dashboard');
    }} />;
  }

  // Project not found
  if (currentView === 'notfound') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-darker)',
        padding: '32px'
      }}>
        <div style={{
          background: 'var(--bg-dark)',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid var(--border)',
          maxWidth: '440px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '24px',
            opacity: '0.5'
          }}>?</div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>Proyecto no encontrado</h1>
          <p style={{
            color: 'var(--light-muted)',
            marginBottom: '24px'
          }}>El proyecto que buscas no existe o ha sido eliminado.</p>
          <a href="/apps/markup-app/" style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>Ir al Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {currentView === 'dashboard' && (
        <Dashboard 
          projects={projects}
          loading={loading}
          user={user}
          onRefresh={loadProjects}
          onSelectProject={handleSelectProject}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'markup' && selectedProject && (
        <MarkupCanvas 
          project={selectedProject}
          user={user}
          onBack={user?.isGuest ? null : handleBackToDashboard}
        />
      )}
    </div>
  );
}

// Guest Name Modal
function GuestNameModal({ onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(26, 32, 44, 0.98)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-dark)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px var(--accent-glow)'
            }}>
              <Icons.User />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800' }}>Markup App</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Acceso como Invitado
          </h1>
          <p style={{ color: 'var(--light-muted)', fontSize: '14px' }}>
            Ingresa tu nombre para agregar markups
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--light-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Tu Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Ej: Juan Perez"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'var(--bg-darker)',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--light)',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {error && (
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            background: 'rgba(252, 129, 129, 0.15)',
            color: 'var(--danger)'
          }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px 28px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '15px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
            color: 'white',
            boxShadow: '0 4px 14px var(--accent-glow)'
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// Login View
function LoginView({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await caliDevsAuth.login(email, password);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error);
        }
      } else {
        const result = await caliDevsAuth.register(email, password, displayName);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Error de conexion. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'var(--bg-darker)',
    border: '2px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--light)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(26, 32, 44, 0.98)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-dark)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px var(--accent-glow)'
            }}>
              <Icons.Folder />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800' }}>Markup App</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
          </h1>
          <p style={{ color: 'var(--light-muted)', fontSize: '14px' }}>
            {isLogin ? 'Accede a tus proyectos de markup' : 'Registrate para comenzar'}
          </p>
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--light-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Nombre</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              style={inputStyle}
              disabled={loading}
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--light-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--light-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Contrasena</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            background: 'rgba(252, 129, 129, 0.15)',
            color: 'var(--danger)'
          }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 28px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '15px',
            fontFamily: 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
            color: 'white',
            boxShadow: '0 4px 14px var(--accent-glow)',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading && <Icons.Loader2 />}
          {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '24px 0',
          color: 'var(--light-faded)',
          fontSize: '13px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span>o</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            color: 'var(--light-muted)',
            background: 'none',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          {isLogin ? 'No tienes cuenta? Registrate' : 'Ya tienes cuenta? Inicia sesion'}
        </button>

        <a 
          href="/apps/"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '20px',
            color: 'var(--light-muted)',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ projects, loading, user, onRefresh, onSelectProject, onLogout }) {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddProject = async () => {
    if (!newProjectName || !newProjectUrl) {
      alert('Por favor completa todos los campos');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProjectName,
          url: newProjectUrl
        }])
        .select();

      if (error) throw error;

      setNewProjectName('');
      setNewProjectUrl('');
      setShowNewProject(false);
      onRefresh();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error al crear proyecto: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Estas seguro de eliminar este proyecto? Se eliminaran todos sus markups.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar proyecto: ' + error.message);
    }
  };

  const copyProjectLink = async (projectId, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?project=${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    } catch (err) {
      prompt('Copia este enlace:', url);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icons.Loader2 />
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'var(--bg-darker)',
    border: '2px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--light)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <a href="/../" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--light-muted)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              <Icons.ArrowLeft />
              Apps
            </a>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Markup App
          </h1>
          <p style={{ color: 'var(--light-muted)', fontSize: '15px', marginTop: '4px' }}>
            Gestiona tus proyectos de revision visual
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-darker)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icons.User />
            <span style={{ fontSize: '14px', color: 'var(--light-muted)' }}>{user?.email}</span>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--light-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          >
            <Icons.LogOut />
            Salir
          </button>
          <button
            onClick={() => setShowNewProject(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 4px 14px var(--accent-glow)'
            }}
          >
            <Icons.Plus />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(26, 32, 44, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-dark)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
              Crear Nuevo Proyecto
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--light-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Nombre del Proyecto</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Mi Sitio Web"
                style={inputStyle}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--light-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>URL del Sitio</label>
              <input
                type="url"
                value={newProjectUrl}
                onChange={(e) => setNewProjectUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                style={inputStyle}
                disabled={saving}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProjectName('');
                  setNewProjectUrl('');
                }}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'var(--bg-card)',
                  color: 'var(--light)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProject}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {saving && <Icons.Loader2 />}
                Crear Proyecto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {projects.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--bg-dark)',
            borderRadius: '20px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: '0.5' }}>
              <Icons.Folder />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Sin proyectos
            </h3>
            <p style={{ color: 'var(--light-muted)', fontSize: '15px' }}>
              Crea tu primer proyecto para comenzar a agregar markups
            </p>
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              style={{
                background: 'var(--bg-dark)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg), 0 0 40px var(--accent-glow)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 107, 53, 0.15)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Icons.Folder />
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {project.name}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: 'var(--light-muted)',
                marginBottom: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {project.url}
              </p>

              <p style={{ fontSize: '13px', color: 'var(--light-faded)', marginBottom: '16px' }}>
                Creado: {new Date(project.created_at).toLocaleDateString('es-ES')}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => copyProjectLink(project.id, e)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'var(--bg-darker)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--light-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <Icons.Link />
                  Compartir
                </button>
                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(252, 129, 129, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icons.Trash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// MarkupCanvas Component
function MarkupCanvas({ project, user, onBack }) {
  const [markups, setMarkups] = useState([]);
  const [deviceView, setDeviceView] = useState('desktop');
  const [isAddingMarkup, setIsAddingMarkup] = useState(false);
  const [selectedMarkup, setSelectedMarkup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('active');
  const [newMarkupDialog, setNewMarkupDialog] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef(null);
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(3000);

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  useEffect(() => {
    loadMarkups();
  }, [project.id]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDocument) {
          const height = Math.max(
            iframeDocument.body.scrollHeight,
            iframeDocument.documentElement.scrollHeight,
            3000
          );
          setIframeHeight(height);
        }
      } catch (e) {
        setIframeHeight(3000);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);
    return () => iframe.removeEventListener('load', handleIframeLoad);
  }, [project.url]);

  const loadMarkups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('markups')
        .select('*, comments(*)')
        .eq('project_id', project.id)
        .order('number', { ascending: true });

      if (error) throw error;
      setMarkups(data || []);
    } catch (error) {
      console.error('Error loading markups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProjectLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    } catch (err) {
      prompt('Copia este enlace:', url);
    }
  };

  const handleCanvasClick = async (e) => {
    if (!isAddingMarkup) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const nextNumber = markups.length > 0 ? Math.max(...markups.map(m => m.number)) + 1 : 1;

    try {
      const { data, error } = await supabase
        .from('markups')
        .insert([{
          project_id: project.id,
          number: nextNumber,
          x: x.toFixed(2),
          y: y.toFixed(2),
          device_view: deviceView,
          created_by: user?.name || 'Anonimo',
          description: '',
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      const newMarkup = { ...data, comments: [] };
      setMarkups([...markups, newMarkup]);
      setIsAddingMarkup(false);

      setNewMarkupDialog({
        x: e.clientX,
        y: e.clientY,
        markup: newMarkup
      });
    } catch (error) {
      console.error('Error creating markup:', error);
      alert('Error al crear markup: ' + error.message);
    }
  };

  const handleSaveNewMarkupDescription = async (description) => {
    if (!newMarkupDialog) return;

    try {
      const { error } = await supabase
        .from('markups')
        .update({ description })
        .eq('id', newMarkupDialog.markup.id);

      if (error) throw error;

      setMarkups(markups.map(m =>
        m.id === newMarkupDialog.markup.id ? { ...m, description } : m
      ));

      setNewMarkupDialog(null);
      setSelectedMarkup({ ...newMarkupDialog.markup, description });
    } catch (error) {
      console.error('Error updating markup:', error);
    }
  };

  const handleUpdateMarkup = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('markups')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMarkups(markups.map(m => m.id === id ? { ...m, ...updates } : m));
      if (selectedMarkup?.id === id) {
        setSelectedMarkup({ ...selectedMarkup, ...updates });
      }
    } catch (error) {
      console.error('Error updating markup:', error);
    }
  };

  const handleDeleteMarkup = async (id) => {
    try {
      const { error } = await supabase
        .from('markups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMarkups(markups.filter(m => m.id !== id));
      if (selectedMarkup?.id === id) {
        setSelectedMarkup(null);
      }
    } catch (error) {
      console.error('Error deleting markup:', error);
    }
  };

  const handleAddComment = async (markupId, commentText) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          markup_id: markupId,
          author: user?.name || 'Anonimo',
          text: commentText
        }])
        .select()
        .single();

      if (error) throw error;

      const updatedMarkups = markups.map(m => {
        if (m.id === markupId) {
          return { ...m, comments: [...(m.comments || []), data] };
        }
        return m;
      });

      setMarkups(updatedMarkups);

      if (selectedMarkup?.id === markupId) {
        setSelectedMarkup({
          ...selectedMarkup,
          comments: [...(selectedMarkup.comments || []), data]
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const scrollToMarkup = (markupId) => {
    const markupElement = document.getElementById(`markup-pin-${markupId}`);
    if (markupElement) {
      markupElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      // Add pulse animation
      markupElement.querySelector('.markup-pin')?.classList.add('pulse-animation');
      setTimeout(() => {
        markupElement.querySelector('.markup-pin')?.classList.remove('pulse-animation');
      }, 1000);
    }
  };

  const handleSelectMarkupFromList = (markup) => {
    setSelectedMarkup(markup);
    setTimeout(() => scrollToMarkup(markup.id), 100);
  };

  const visibleMarkups = markups.filter(m =>
    m.device_view === deviceView && m.status === statusFilter
  );

  const activeCount = markups.filter(m => m.device_view === deviceView && m.status === 'active').length;
  const resolvedCount = markups.filter(m => m.device_view === deviceView && m.status === 'resolved').length;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icons.Loader2 />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-darker)' }}>
      {/* Toast */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'var(--bg-dark)',
          color: 'var(--light)',
          padding: '16px 24px',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          zIndex: 1001,
          animation: 'slideIn 0.4s ease',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Icons.Check />
          Enlace copiado al portapapeles
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'var(--bg-dark)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--light-muted)',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Icons.ArrowLeft />
            </button>
          )}
          <div>
            <h2 style={{ fontWeight: '600', fontSize: '16px' }}>{project.name}</h2>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: 'var(--light-muted)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {project.url}
              <Icons.ExternalLink />
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* User badge */}
          <div style={{
            padding: '8px 14px',
            background: 'var(--bg-darker)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '13px',
            color: 'var(--light-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Icons.User />
            {user?.name}
            {user?.isGuest && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>(Invitado)</span>}
          </div>

          {/* Share button */}
          <button
            onClick={handleCopyProjectLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--light-muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <Icons.Link />
            Compartir
          </button>

          {/* Device selector */}
          <div style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-darker)',
            borderRadius: '10px',
            padding: '4px'
          }}>
            {[
              { key: 'desktop', icon: Icons.Monitor },
              { key: 'tablet', icon: Icons.Tablet },
              { key: 'mobile', icon: Icons.Smartphone }
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setDeviceView(key)}
                style={{
                  padding: '8px 12px',
                  background: deviceView === key ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: deviceView === key ? 'var(--light)' : 'var(--light-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                <Icon />
              </button>
            ))}
          </div>

          {/* Add markup button */}
          <button
            onClick={() => setIsAddingMarkup(!isAddingMarkup)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: isAddingMarkup
                ? 'rgba(252, 129, 129, 0.15)'
                : 'linear-gradient(135deg, var(--accent), #ff8c42)',
              color: isAddingMarkup ? 'var(--danger)' : 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            {isAddingMarkup ? <><Icons.X /> Cancelar</> : <><Icons.Plus /> Nuevo Markup</>}
          </button>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'none',
              padding: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--light)',
              cursor: 'pointer'
            }}
            className="mobile-sidebar-toggle"
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas area */}
        <div style={{
          flex: 1,
          background: 'var(--bg-darker)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '20px',
          overflow: 'auto'
        }}>
          <div
            ref={canvasRef}
            style={{
              background: 'white',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              width: deviceView === 'desktop' ? '100%' : deviceSizes[deviceView].width,
              maxWidth: '100%',
              minHeight: `${iframeHeight}px`,
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: `${iframeHeight}px`,
              minHeight: `${iframeHeight}px`
            }}>
              <iframe
                ref={iframeRef}
                src={project.url}
                scrolling="no"
                style={{
                  width: '100%',
                  height: `${iframeHeight}px`,
                  minHeight: `${iframeHeight}px`,
                  border: 'none',
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: isAddingMarkup ? 'none' : 'auto',
                  overflow: 'hidden'
                }}
                title={project.name}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />

              {/* Click layer for adding markups */}
              {isAddingMarkup && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    cursor: 'crosshair',
                    zIndex: 20
                  }}
                  onClick={handleCanvasClick}
                />
              )}

              {/* Markup pins */}
              {visibleMarkups.map(markup => (
                <div
                  key={markup.id}
                  id={`markup-pin-${markup.id}`}
                  style={{
                    position: 'absolute',
                    left: `${parseFloat(markup.x)}%`,
                    top: `${parseFloat(markup.y)}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 30,
                    pointerEvents: 'auto'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAddingMarkup) {
                      setSelectedMarkup(markup);
                    }
                  }}
                >
                  <div
                    className="markup-pin"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s',
                      background: markup.status === 'resolved'
                        ? 'linear-gradient(135deg, var(--success), #38a169)'
                        : 'linear-gradient(135deg, var(--danger), #e53e3e)',
                      border: selectedMarkup?.id === markup.id
                        ? '3px solid var(--accent)'
                        : '2px solid white'
                    }}
                  >
                    {markup.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: '380px',
          background: 'var(--bg-dark)',
          borderLeft: '1px solid var(--border)',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <div style={{ padding: '20px' }}>
            {/* Status filter */}
            <div style={{
              display: 'flex',
              gap: '0',
              marginBottom: '20px',
              background: 'var(--bg-darker)',
              borderRadius: '10px',
              padding: '4px'
            }}>
              <button
                onClick={() => setStatusFilter('active')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  background: statusFilter === 'active' ? 'var(--bg-card)' : 'transparent',
                  color: statusFilter === 'active' ? 'var(--danger)' : 'var(--light-muted)'
                }}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  background: statusFilter === 'resolved' ? 'var(--bg-card)' : 'transparent',
                  color: statusFilter === 'resolved' ? 'var(--success)' : 'var(--light-muted)'
                }}
              >
                Resueltos ({resolvedCount})
              </button>
            </div>

            <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>
              {statusFilter === 'active' ? 'Markups Activos' : 'Markups Resueltos'} ({visibleMarkups.length})
            </h3>

            {selectedMarkup ? (
              <MarkupDetail
                markup={selectedMarkup}
                onUpdate={handleUpdateMarkup}
                onDelete={handleDeleteMarkup}
                onAddComment={handleAddComment}
                onClose={() => setSelectedMarkup(null)}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {visibleMarkups.length === 0 ? (
                  <p style={{
                    color: 'var(--light-muted)',
                    textAlign: 'center',
                    padding: '40px 20px'
                  }}>
                    No hay markups {statusFilter === 'active' ? 'activos' : 'resueltos'} en esta vista.
                  </p>
                ) : (
                  visibleMarkups.map(markup => (
                    <div
                      key={markup.id}
                      onClick={() => handleSelectMarkupFromList(markup)}
                      style={{
                        padding: '16px',
                        background: 'var(--bg-darker)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700',
                          flexShrink: 0,
                          background: markup.status === 'resolved'
                            ? 'var(--success)'
                            : 'var(--danger)'
                        }}>
                          {markup.number}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {markup.description || 'Sin descripcion'}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--light-muted)' }}>
                            {markup.created_by} - {new Date(markup.created_at).toLocaleDateString('es-ES')}
                          </p>
                          {markup.comments?.length > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '6px',
                              fontSize: '12px',
                              color: 'var(--light-muted)'
                            }}>
                              <Icons.MessageSquare />
                              {markup.comments.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New markup dialog */}
      {newMarkupDialog && (
        <NewMarkupDialog
          position={{ x: newMarkupDialog.x, y: newMarkupDialog.y }}
          markup={newMarkupDialog.markup}
          onSave={handleSaveNewMarkupDescription}
          onSkip={() => {
            setNewMarkupDialog(null);
            setSelectedMarkup(newMarkupDialog.markup);
          }}
        />
      )}
    </div>
  );
}

// New Markup Dialog
function NewMarkupDialog({ position, markup, onSave, onSkip }) {
  const [description, setDescription] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      const dialog = dialogRef.current;
      const rect = dialog.getBoundingClientRect();

      let top = position.y + 40;
      let left = position.x - rect.width / 2;

      if (top + rect.height > window.innerHeight - 20) {
        top = position.y - rect.height - 40;
      }
      if (left < 20) left = 20;
      if (left + rect.width > window.innerWidth - 20) {
        left = window.innerWidth - rect.width - 20;
      }

      dialog.style.top = `${top}px`;
      dialog.style.left = `${left}px`;
    }
  }, [position]);

  return (
    <div
      ref={dialogRef}
      style={{
        position: 'fixed',
        zIndex: 50,
        background: 'var(--bg-dark)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)',
        padding: '16px',
        width: '280px',
        top: 0,
        left: 0
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: '700'
        }}>
          {markup.number}
        </div>
        <h3 style={{ fontWeight: '600', fontSize: '14px' }}>Agregar Descripcion</h3>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe el problema..."
        autoFocus
        style={{
          width: '100%',
          padding: '10px 12px',
          background: 'var(--bg-darker)',
          border: '2px solid var(--border)',
          borderRadius: '10px',
          color: 'var(--light)',
          fontSize: '13px',
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
          marginBottom: '12px'
        }}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            onSave(description);
          }
        }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onSkip}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--light)',
            fontSize: '13px',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          Omitir
        </button>
        <button
          onClick={() => onSave(description)}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

// Markup Detail Component
function MarkupDetail({ markup, onUpdate, onDelete, onAddComment, onClose }) {
  const [description, setDescription] = useState(markup.description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleSaveDescription = () => {
    onUpdate(markup.id, { description });
    setIsEditingDescription(false);
  };

  const handleToggleStatus = () => {
    onUpdate(markup.id, {
      status: markup.status === 'active' ? 'resolved' : 'active'
    });
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(markup.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            background: markup.status === 'resolved' ? 'var(--success)' : 'var(--danger)'
          }}>
            {markup.number}
          </div>
          <span style={{
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: '600',
            background: markup.status === 'resolved'
              ? 'rgba(72, 187, 120, 0.15)'
              : 'rgba(252, 129, 129, 0.15)',
            color: markup.status === 'resolved' ? 'var(--success)' : 'var(--danger)'
          }}>
            {markup.status === 'resolved' ? 'Resuelto' : 'Activo'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--light-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Icons.X />
        </button>
      </div>

      {/* Meta info */}
      <div>
        <p style={{ fontSize: '13px', color: 'var(--light-muted)' }}>
          Creado por {markup.created_by}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--light-faded)' }}>
          {new Date(markup.created_at).toLocaleString('es-ES')}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--light-faded)', marginTop: '4px' }}>
          Vista: {markup.device_view === 'desktop' ? 'Desktop' : markup.device_view === 'tablet' ? 'Tablet' : 'Mobile'}
        </p>
      </div>

      {/* Description */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--light-muted)' }}>
            Descripcion
          </label>
          {!isEditingDescription && (
            <button
              onClick={() => setIsEditingDescription(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer'
              }}
            >
              <Icons.Edit2 />
            </button>
          )}
        </div>
        {isEditingDescription ? (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema o sugerencia..."
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-darker)',
                border: '2px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--light)',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '80px',
                outline: 'none',
                marginBottom: '10px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSaveDescription}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setDescription(markup.description);
                  setIsEditingDescription(false);
                }}
                style={{
                  padding: '10px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--light)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--light)', whiteSpace: 'pre-wrap' }}>
            {markup.description || 'Sin descripcion'}
          </p>
        )}
      </div>

      {/* Comments */}
      <div>
        <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--light-muted)', marginBottom: '12px' }}>
          Comentarios ({markup.comments?.length || 0})
        </h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {markup.comments?.map(comment => (
            <div key={comment.id} style={{
              background: 'var(--bg-darker)',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{comment.author}</span>
                <span style={{ fontSize: '11px', color: 'var(--light-muted)' }}>
                  {new Date(comment.created_at).toLocaleString('es-ES')}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--light-muted)' }}>{comment.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            placeholder="Agregar comentario..."
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--bg-darker)',
              border: '2px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--light)',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSubmitComment}
            style={{
              padding: '10px 14px',
              background: 'linear-gradient(135deg, var(--accent), #ff8c42)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icons.MessageSquare />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '10px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)'
      }}>
        <button
          onClick={handleToggleStatus}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            background: markup.status === 'active'
              ? 'linear-gradient(135deg, var(--success), #38a169)'
              : 'var(--bg-card)',
            color: markup.status === 'active' ? 'white' : 'var(--light)'
          }}
        >
          <Icons.Check />
          {markup.status === 'active' ? 'Marcar Resuelto' : 'Reabrir'}
        </button>
        <button
          onClick={() => {
            if (confirm('Estas seguro de eliminar este markup?')) {
              onDelete(markup.id);
            }
          }}
          style={{
            padding: '12px 16px',
            background: 'rgba(252, 129, 129, 0.15)',
            border: 'none',
            borderRadius: '10px',
            color: 'var(--danger)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icons.Trash2 />
        </button>
      </div>
    </div>
  );
}
