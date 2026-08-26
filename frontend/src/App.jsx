import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Shield, KeyRound, Sparkles, User, Heart, Star, Rocket, Palette, Smile } from 'lucide-react';
import api from './utils/api';
import { ChildDashboard, ParentDashboard, AdminDashboard } from './components/Dashboards';
import { Games } from './components/Games';
import { CareerLibrary } from './components/CareerLibrary';
import { AIChatbot } from './components/AIChatbot';

const AVATARS = [
  { id: 'rocket', label: '🚀 Rocket' },
  { id: 'star', label: '⭐ Star' },
  { id: 'leaf', label: '🌿 Leaf' },
  { id: 'planet', label: '🪐 Planet' },
  { id: 'robot', label: '🤖 Robot' },
  { id: 'palette', label: '🎨 Palette' },
  { id: 'lion', label: '🦁 Lion' },
  { id: 'doctor', label: '🩺 Doctor' },
  { id: 'briefcase', label: '💼 Leader' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // landing, student-entry, create-player, player-code-created, child-picker, login, register, dashboard, games, library
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '', role: 'PARENT' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Child registration 4 steps
  const [regStep, setRegStep] = useState(1);
  const [playerForm, setPlayerForm] = useState({ nickname: '', avatar: 'rocket', ageGroup: '11-13', pin: '' });
  const [createdPlayerCode, setCreatedPlayerCode] = useState('');

  // Child login
  const [childProfiles, setChildProfiles] = useState([]);
  const [selectedChildProfile, setSelectedChildProfile] = useState(null);
  const [loginPlayerCode, setLoginPlayerCode] = useState('');
  const [childPin, setChildPin] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role) {
          setUser(parsed);
          setView('dashboard');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setView('landing');
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setView('landing');
      }
    }
    const storedProfiles = localStorage.getItem('careerquest-child-profiles');
    if (storedProfiles) {
      try {
        setChildProfiles(JSON.parse(storedProfiles));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleChildRegistrationSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!playerForm.nickname.trim()) {
      setAuthError("Please enter your name!");
      return;
    }
    if (!/^\d{4}$/.test(playerForm.pin)) {
      setAuthError("Please enter a 4-digit PIN!");
      return;
    }

    try {
      const res = await api.post('/auth/child/register', playerForm);
      const userData = res.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      const newProf = {
        profileId: userData.childId,
        playerCode: userData.playerCode,
        nickname: userData.nickname,
        avatar: userData.avatar,
        ageGroup: userData.ageGroup,
        level: 1
      };
      
      const updatedProfiles = [newProf, ...childProfiles.filter(p => p.playerCode !== userData.playerCode)];
      setChildProfiles(updatedProfiles);
      localStorage.setItem('careerquest-child-profiles', JSON.stringify(updatedProfiles));
      
      setUser(userData);
      setCreatedPlayerCode(userData.playerCode);
      setView('player-code-created');
    } catch (err) {
      console.error('Registration error:', err);
      setAuthError(err.response?.data?.message || err.response?.data?.error || 'Could not create player profile. Try again!');
    }
  };

  const handleChildPinLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const targetCode = selectedChildProfile ? selectedChildProfile.playerCode : loginPlayerCode;
    if (!targetCode) {
      setAuthError("Please enter your Player Code");
      return;
    }
    try {
      const res = await api.post('/auth/child/login', { playerCode: targetCode, pin: childPin });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setView('dashboard');
      setChildPin('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'That PIN did not work. Try again.');
    }
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.post('/auth/login', { username: authForm.username, password: authForm.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setView('dashboard');
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Invalid credentials or connection error.');
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.post('/auth/register', authForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setView('dashboard');
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Registration failed. Try a different username/email.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
    setAuthForm({ username: '', password: '', email: '', role: 'PARENT' });
  };

  if (loading) {
    return <div className="loading-screen">Loading CareerQuest AI...</div>;
  }

  // ----------------------------------------------------
  // PUBLIC VIEW: LANDING PAGE
  // ----------------------------------------------------
  if (view === 'landing') {
    return (
      <div className="landing-page animate-fade-in">
        <div className="nav-bar">
          <h1 className="brand-logo">🚀 CareerQuest AI</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setView('login')}>Parent Login</button>
            <button className="btn btn-secondary" onClick={() => setView('login')}>Admin</button>
          </div>
        </div>

        <div className="hero-section">
          <h2>Discover your passions & strengths through fun games!</h2>
          <p>
            Play interactive challenges, explore nature, solve coding puzzles, build stories, and learn what you're naturally amazing at!
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-primary hero-btn" onClick={() => setView('student-entry')}>
              🎮 I'm a Student
            </button>
            <button className="btn btn-secondary hero-btn" onClick={() => setView('login')}>
              👨‍👩‍👧 Parent Dashboard
            </button>
          </div>
        </div>

        <div className="features-grid container">
          <div className="card feature-card">
            <Sparkles size={36} style={{ color: 'var(--color-primary)' }} />
            <h3>7 Core Interest Domains</h3>
            <p>From Technology & Logic to Communication & Language, explore activities across 7 distinct skill areas.</p>
          </div>
          <div className="card feature-card">
            <BookOpen size={36} style={{ color: 'var(--color-secondary)' }} />
            <h3>Zero Parent Blocking</h3>
            <p>Kids create a player profile in under 1 minute and start playing immediately without parent approvals.</p>
          </div>
          <div className="card feature-card">
            <Shield size={36} style={{ color: 'var(--color-accent)' }} />
            <h3>Parent Progress Reports</h3>
            <p>Parents link via a 6-character Player Code to see supportive insights on their child's natural interests and skills.</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STUDENT ENTRY GATEWAY
  // ----------------------------------------------------
  if (view === 'student-entry') {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel">
          <div className="child-gate__mark">🎮</div>
          <p className="eyebrow">CAREERQUEST AI</p>
          <h2>Ready to start your adventure?</h2>
          <p className="child-gate__hint">Choose an option to continue:</p>
          <div className="entry-actions">
            <button className="btn btn-primary hero-btn" onClick={() => { setRegStep(1); setView('create-player'); }}>
              ✨ New Player
            </button>
            <button className="btn btn-secondary hero-btn" onClick={() => setView('child-picker')}>
              🚀 Continue My Adventure
            </button>
          </div>
          <button className="text-button" onClick={() => setView('landing')}>Back to Welcome</button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SIMPLE 4-STEP CHILD REGISTRATION ("Create Your Player")
  // ----------------------------------------------------
  if (view === 'create-player') {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel player-form">
          <div className="child-gate__mark">🚀</div>
          <p className="eyebrow">STEP {regStep} OF 4</p>
          <h2>Create Your Player</h2>

          {authError && <div className="auth-error">{authError}</div>}

          {regStep === 1 && (
            <div className="wizard-step animate-fade-in">
              <label className="form-label" style={{ fontSize: '20px', fontWeight: 'bold' }}>Step 1: What's your name?</label>
              <input 
                className="form-input" 
                style={{ fontSize: '18px', textAlign: 'center', padding: '12px' }} 
                value={playerForm.nickname} 
                onChange={(e) => setPlayerForm({ ...playerForm, nickname: e.target.value })} 
                placeholder="Enter your nickname"
                autoFocus 
              />
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                if (!playerForm.nickname.trim()) { setAuthError("Please enter your nickname"); return; }
                setAuthError('');
                setRegStep(2);
              }}>Next Step →</button>
            </div>
          )}

          {regStep === 2 && (
            <div className="wizard-step animate-fade-in">
              <label className="form-label" style={{ fontSize: '20px', fontWeight: 'bold' }}>Step 2: Choose your avatar</label>
              <div className="avatar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '16px 0' }}>
                {AVATARS.map((av) => (
                  <button 
                    key={av.id} 
                    type="button" 
                    className={`avatar-tile ${playerForm.avatar === av.id ? 'avatar-tile--selected' : ''}`}
                    onClick={() => setPlayerForm({ ...playerForm, avatar: av.id })}
                    style={{ fontSize: '24px', padding: '12px', borderRadius: '12px', border: playerForm.avatar === av.id ? '3px solid var(--color-primary)' : '1px solid var(--color-border)' }}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRegStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setRegStep(3)}>Next Step →</button>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="wizard-step animate-fade-in">
              <label className="form-label" style={{ fontSize: '20px', fontWeight: 'bold' }}>Step 3: Select your age group</label>
              <div className="age-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
                {['8–10', '11–13', '14–16', '17+'].map((age) => (
                  <button 
                    key={age} 
                    type="button" 
                    className={`age-tile ${playerForm.ageGroup === age ? 'age-tile--selected' : ''}`}
                    onClick={() => setPlayerForm({ ...playerForm, ageGroup: age })}
                    style={{ padding: '16px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: playerForm.ageGroup === age ? '3px solid var(--color-primary)' : '1px solid var(--color-border)' }}
                  >
                    {age}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRegStep(2)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setRegStep(4)}>Next Step →</button>
              </div>
            </div>
          )}

          {regStep === 4 && (
            <form onSubmit={handleChildRegistrationSubmit} className="wizard-step animate-fade-in">
              <label className="form-label" style={{ fontSize: '20px', fontWeight: 'bold' }}>Step 4: Create a 4-digit PIN</label>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '8px 0' }}>
                "Use these 4 numbers next time you want to continue your adventure."
              </p>
              <input 
                className="pin-input" 
                inputMode="numeric" 
                pattern="[0-9]{4}" 
                maxLength="4" 
                required 
                value={playerForm.pin} 
                onChange={(e) => setPlayerForm({ ...playerForm, pin: e.target.value.replace(/\D/g, '') })}
                placeholder="1234"
                style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center', margin: '12px 0' }}
                autoFocus 
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRegStep(3)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Start Playing 🚀</button>
              </div>
            </form>
          )}

          <button className="text-button" style={{ marginTop: '16px' }} onClick={() => setView('student-entry')}>Cancel</button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PLAYER CODE CREATED DISPLAY MODAL
  // ----------------------------------------------------
  if (view === 'player-code-created') {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌟</div>
          <h2>Welcome, {playerForm.nickname}!</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '12px 0' }}>Your player profile was created successfully!</p>
          
          <div className="card" style={{ background: 'var(--bg-app)', border: '2px dashed var(--color-primary)', padding: '20px', margin: '20px 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Unique Player Code</p>
            <h1 style={{ fontSize: '42px', color: 'var(--color-primary)', letterSpacing: '4px', margin: '8px 0' }}>{createdPlayerCode}</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              "Remember this code. You can use it to continue your adventure later!"
            </p>
          </div>

          <button className="btn btn-primary hero-btn" style={{ width: '100%' }} onClick={() => setView('dashboard')}>
            🚀 Start My Adventure
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CHILD LOGIN ("Who's Playing?")
  // ----------------------------------------------------
  if (view === 'child-picker') {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel">
          <div className="child-gate__mark">🚀</div>
          <p className="eyebrow">CAREERQUEST AI</p>
          <h2>Who's Playing?</h2>
          
          {authError && <div className="auth-error">{authError}</div>}

          {/* Profile Tiles */}
          {childProfiles.length > 0 && (
            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', margin: '16px 0' }}>
              {childProfiles.map((p) => (
                <button 
                  key={p.playerCode || p.profileId} 
                  className={`profile-tile ${selectedChildProfile?.playerCode === p.playerCode ? 'profile-tile--selected' : ''}`}
                  onClick={() => { setSelectedChildProfile(p); setLoginPlayerCode(p.playerCode); setAuthError(''); }}
                  style={{ padding: '16px', borderRadius: '12px', border: selectedChildProfile?.playerCode === p.playerCode ? '3px solid var(--color-primary)' : '1px solid var(--color-border)' }}
                >
                  <span style={{ fontSize: '28px', display: 'block' }}>
                    {p.avatar === 'star' ? '⭐' : p.avatar === 'leaf' ? '🌿' : p.avatar === 'planet' ? '🪐' : p.avatar === 'robot' ? '🤖' : p.avatar === 'palette' ? '🎨' : '🚀'}
                  </span>
                  <strong style={{ fontSize: '16px', marginTop: '4px', display: 'block' }}>{p.nickname}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.playerCode}</span>
                </button>
              ))}
            </div>
          )}

          {/* Player Code Input if profile not selected */}
          {!selectedChildProfile && (
            <div style={{ margin: '16px 0' }}>
              <label className="form-label">Enter your Player Code (e.g. CQ4821)</label>
              <input 
                className="form-input" 
                value={loginPlayerCode} 
                onChange={(e) => setLoginPlayerCode(e.target.value.toUpperCase())}
                placeholder="CQ4821" 
                style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
              />
            </div>
          )}

          {/* PIN Input */}
          {(selectedChildProfile || loginPlayerCode) && (
            <form onSubmit={handleChildPinLogin} className="pin-form animate-fade-in" style={{ marginTop: '16px' }}>
              <label className="form-label" htmlFor="child-pin">Enter your 4-digit PIN</label>
              <input 
                id="child-pin" 
                className="pin-input" 
                inputMode="numeric" 
                maxLength="4" 
                pattern="[0-9]{4}" 
                value={childPin} 
                onChange={(e) => setChildPin(e.target.value.replace(/\D/g, ''))} 
                placeholder="1234"
                style={{ fontSize: '24px', letterSpacing: '6px', textAlign: 'center', margin: '8px 0' }}
                autoFocus 
                required 
              />
              <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '12px' }}>
                Continue Adventure 🚀
              </button>
            </form>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button className="text-button" onClick={() => setView('student-entry')}>Back</button>
            <button className="text-button" onClick={() => setView('create-player')}>New Player</button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PARENT LOGIN / REGISTER
  // ----------------------------------------------------
  if (view === 'login') {
    return (
      <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '60px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Parent & Admin Sign In</h2>
          {authError && <div className="auth-error">{authError}</div>}
          <form onSubmit={handleParentLogin}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input type="text" name="username" className="form-input" required onChange={handleAuthChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required onChange={handleAuthChange} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>Sign In</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '16px' }}>
            Need a parent account? <a href="#" onClick={() => setView('register')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Create one here</a>
          </p>
          <button className="text-button" style={{ width: '100%', marginTop: '12px' }} onClick={() => setView('landing')}>← Back to Welcome</button>
        </div>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="container animate-fade-in" style={{ maxWidth: '450px', marginTop: '40px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Parent Account</h2>
          {authError && <div className="auth-error">{authError}</div>}
          <form onSubmit={handleParentRegister}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-input" required onChange={handleAuthChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" required onChange={handleAuthChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required onChange={handleAuthChange} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>Sign Up</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '16px' }}>
            Already registered? <a href="#" onClick={() => setView('login')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login here</a>
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED IN USERS
  // ----------------------------------------------------
  if (user) {
    const role = (user.role || '').toUpperCase();
    
    if (role.includes('CHILD')) {
      const childView = (view === 'games' || view === 'library') ? view : 'dashboard';
      return (
        <div>
          {childView === 'dashboard' && <ChildDashboard user={user} onLogout={handleLogout} onNavigate={setView} />}
          {childView === 'games' && <Games onBack={() => setView('dashboard')} />}
          {childView === 'library' && <CareerLibrary onBack={() => setView('dashboard')} />}
          <AIChatbot />
        </div>
      );
    }
    
    if (role.includes('PARENT')) {
      return <ParentDashboard user={user} onLogout={handleLogout} />;
    }
    
    if (role.includes('ADMIN')) {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    // Fallback: If user role is unrecognized or stale, auto-clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
    return null;
  }

  // Safe default fallback for non-logged in users
  if (view === 'dashboard') {
    setView('landing');
    return null;
  }

  return <div>Access Denied or Unknown State.</div>;
}
