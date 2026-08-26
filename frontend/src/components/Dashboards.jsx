import React, { useState, useEffect } from 'react';
import { Award, Bell, Shield, Users, Database, BookOpen, Compass, BarChart, Smile, Plus, Sparkles, CheckCircle2, Lock, ArrowLeft, Play, Rocket } from 'lucide-react';
import api from '../utils/api';

/* =========================================================================
   CHILD DASHBOARD — "MY ADVENTURE 🚀"
   ========================================================================= */
export function ChildDashboard({ onNavigate, user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    loadProfile();
    loadAnalysis();
    loadTimeline();
    loadAchievements();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/child/profile');
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAnalysis = async () => {
    try {
      const res = await api.get('/child/analysis');
      setAnalysis(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTimeline = async () => {
    try {
      const res = await api.get('/child/timeline');
      setTimeline(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAchievements = async () => {
    try {
      const res = await api.get('/child/achievements');
      setAchievements(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!profile) return <div className="loading-screen">Loading My Adventure...</div>;

  const totalGamesPlayed = analysis?.totalGamesPlayed || 0;
  const isSufficientEvidence = totalGamesPlayed >= 3;
  const discoveryPercentage = Math.min(95, Math.max(30, totalGamesPlayed * 30));

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '950px', margin: '0 auto' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit', fontWeight: '800', color: 'var(--color-primary)' }}>
            My Adventure 🚀
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Hi <strong>{profile.nickname}</strong>! Ready for another adventure? (Player Code: <code>{profile.playerCode}</code>)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>
            ⚡ Level {profile.level} • {profile.points} XP
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('home')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px' }}
        >
          🏠 Home
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => onNavigate('games')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px', background: 'linear-gradient(135deg, hsl(var(--hue-primary), 80%, 50%), hsl(var(--hue-secondary), 80%, 45%))' }}
        >
          🎮 Play Games
        </button>
        <button 
          className={`btn ${activeTab === 'rewards' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('rewards')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px' }}
        >
          🏆 My Rewards
        </button>
        <button 
          className={`btn ${activeTab === 'strengths' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('strengths')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px' }}
        >
          💪 My Strengths
        </button>
        <button 
          className={`btn ${activeTab === 'interests' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('interests')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px' }}
        >
          🌟 My Interests
        </button>
        <button 
          className={`btn ${activeTab === 'journey' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('journey')}
          style={{ padding: '16px', borderRadius: '16px', fontSize: '15px' }}
        >
          🗺️ My Journey
        </button>
      </div>

      {/* HOME TAB */}
      {activeTab === 'home' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Continue Playing Hero Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, hsla(var(--hue-primary), 85%, 55%, 0.15), hsla(var(--hue-secondary), 85%, 50%, 0.15))', borderLeft: '8px solid var(--color-primary)', padding: '28px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              RECOMMENDED FOR YOU
            </span>
            <h2 style={{ fontSize: '30px', margin: '6px 0 8px' }}>Code the Robot 🤖 & Spell Quest 🔤</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Guide the robot to target stars and build your word power!
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('games')} style={{ padding: '16px 32px', fontSize: '18px' }}>
              Play Now 🚀
            </button>
          </div>

          {/* Discovery Progress Threshold Section */}
          <div className="card" style={{ padding: '24px' }}>
            {!isSufficientEvidence ? (
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '6px' }}>🌱 We're Still Discovering You!</h2>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Play a few more adventures so Questy can learn what you naturally enjoy.
                </p>
                <div style={{ background: 'var(--color-border)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${discoveryPercentage}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.3s' }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Discovery Progress: {discoveryPercentage}%</span>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '26px', color: 'var(--color-primary)', marginBottom: '12px' }}>🌟 Things You Seem to Enjoy</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {analysis?.topInterests?.map((interest, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-app)', padding: '10px 18px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', border: '1px solid var(--color-border)' }}>
                      ✨ {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Explore Games Quick Launch */}
          <div className="card">
            <h3>Quick Launch Mini-Games 🎮</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '14px' }}>
              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => onNavigate('games')}>
                <strong>🗣️ Communication</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Spell Quest, Listen & Spell</p>
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => onNavigate('games')}>
                <strong>💻 Logic & Tech</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Code the Robot, Puzzle Lab</p>
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => onNavigate('games')}>
                <strong>🎨 Creativity</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Dream Designer</p>
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => onNavigate('games')}>
                <strong>💼 Leadership</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Mini Entrepreneur</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* REWARDS TAB */}
      {activeTab === 'rewards' && (
        <div className="animate-fade-in">
          <h2 style={{ marginBottom: '16px' }}>🏆 My Rewards & Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {achievements.length === 0 ? (
              <div className="card">Play games to unlock your first badge!</div>
            ) : (
              achievements.map((ach) => (
                <div key={ach.id} className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-primary)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏅</div>
                  <h4 style={{ margin: '4px 0' }}>{ach.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ach.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* STRENGTHS TAB */}
      {activeTab === 'strengths' && (
        <div className="animate-fade-in card">
          <h2>💪 My Growing Strengths</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Here is what you're naturally developing through your game choices:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '12px' }}>
              <strong style={{ fontSize: '16px' }}>⭐ Vocabulary & Word Power</strong>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Building words and exploring stories in Spell Quest & Listen & Spell.</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '12px' }}>
              <strong style={{ fontSize: '16px' }}>⭐ Logical Problem Solving</strong>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Planning robot routes and cracking puzzle sequences.</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '12px' }}>
              <strong style={{ fontSize: '16px' }}>⭐ Careful Observation</strong>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Spotting details in Wildlife Photography & Eco Rescue.</p>
            </div>
          </div>
        </div>
      )}

      {/* INTERESTS TAB */}
      {activeTab === 'interests' && (
        <div className="animate-fade-in card">
          <h2>🌟 My Favorite Activity Areas</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Your favorite areas based on games you voluntarily replay:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <span className="card" style={{ padding: '16px 24px', fontSize: '18px', fontWeight: 'bold' }}>🗣️ Communication & Language</span>
            <span className="card" style={{ padding: '16px 24px', fontSize: '18px', fontWeight: 'bold' }}>💻 Technology & Logic</span>
            <span className="card" style={{ padding: '16px 24px', fontSize: '18px', fontWeight: 'bold' }}>🌱 Nature & Environment</span>
          </div>
        </div>
      )}

      {/* JOURNEY TAB */}
      {activeTab === 'journey' && (
        <div className="animate-fade-in">
          <h2>🗺️ My Exploration Journey</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {timeline.map((item, idx) => (
              <div key={idx} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(item.timestamp).toLocaleString()}</span>
                <h4 style={{ margin: '4px 0' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================================================================
   PARENT DASHBOARD
   ========================================================================= */
export function ParentDashboard({ user, onLogout }) {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childActivity, setChildActivity] = useState(null);
  const [childInsights, setChildInsights] = useState(null);
  const [playerCodeInput, setPlayerCodeInput] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const res = await api.get('/parent/children');
      setChildren(res.data);
      if (res.data.length > 0 && !selectedChild) {
        selectChild(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkChild = async (e) => {
    e.preventDefault();
    setLinkError('');
    setLinkSuccess('');
    try {
      const res = await api.post('/parent/link-child', { playerCode: playerCodeInput });
      setLinkSuccess(res.data.message || 'Child linked successfully!');
      setPlayerCodeInput('');
      loadChildren();
    } catch (e) {
      setLinkError(e.response?.data?.error || 'Could not find a child with that Player Code. Please check the code.');
    }
  };

  const selectChild = async (child) => {
    setSelectedChild(child);
    try {
      const actRes = await api.get(`/parent/children/${child.profileId}/activity`);
      setChildActivity(actRes.data);
      const insRes = await api.get(`/parent/children/${child.profileId}/insights`);
      setChildInsights(insRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Parent Progress Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Logged in as <strong>{user.email || user.username}</strong></p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
      </div>

      <div className="card" style={{ marginBottom: '24px', background: 'var(--bg-card)', borderLeft: '6px solid var(--color-primary)' }}>
        <h3>🔗 Link Your Child's Profile</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Enter your child's 6-character <strong>Player Code</strong> (e.g. <code>CQ4821</code>) to view their interests and level progress:
        </p>
        {linkError && <div className="auth-error" style={{ marginBottom: '10px' }}>{linkError}</div>}
        {linkSuccess && <div style={{ color: 'var(--color-success)', fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>{linkSuccess}</div>}
        
        <form onSubmit={handleLinkChild} style={{ display: 'flex', gap: '12px', maxWidth: '450px' }}>
          <input 
            type="text" 
            className="form-input" 
            value={playerCodeInput} 
            onChange={(e) => setPlayerCodeInput(e.target.value.toUpperCase())}
            placeholder="Enter Player Code (e.g. CQ4821)"
            style={{ letterSpacing: '2px', textTransform: 'uppercase' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Link Child
          </button>
        </form>
      </div>

      {children.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
          {children.map(c => (
            <button 
              key={c.profileId} 
              className={`btn ${selectedChild?.profileId === c.profileId ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => selectChild(c)}
              style={{ padding: '10px 20px', borderRadius: '12px' }}
            >
              👤 {c.nickname} ({c.playerCode})
            </button>
          ))}
        </div>
      )}

      {selectedChild && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, hsla(var(--hue-primary), 80%, 60%, 0.1), hsla(var(--hue-secondary), 80%, 60%, 0.1))', padding: '24px' }}>
            <h1 style={{ fontSize: '26px', color: 'var(--color-primary)', marginBottom: '4px' }}>
              What is {selectedChild.nickname} interested in?
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Player Code: <strong>{selectedChild.playerCode}</strong> • Explorer Level {selectedChild.level} • {selectedChild.points} XP
            </p>
          </div>

          {childInsights && (
            <div className="card">
              <h3>Interest vs. Skill Breakdown & Level Progression Across 7 Domains</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                *Note: Level progress (🟢 Easy ✓ 🟡 Moderate ✓ 🟠 Medium ▶ 🔴 Hard 🔒) tracks sustained progression.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {childInsights.categories.map(cat => (
                  <div key={cat} style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '16px' }}>{cat}</strong>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        Played {childInsights.playCounts[cat] || 0} times
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '6px' }}>
                      <strong>Level Progression:</strong> {childInsights.levelIndicators[cat] || '🟢 ✓ 🟡 ▶ 🟠 🔒 🔴 🔒'}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                      <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Interest Level: </span>
                        <strong>{childInsights.interestLevels[cat]}</strong>
                      </div>
                      <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Skill Status: </span>
                        <strong>{childInsights.skillLevels[cat]}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {childInsights && childInsights.parentInsights && (
            <div className="card" style={{ borderLeft: '6px solid var(--color-accent)' }}>
              <h3>💡 Parent Insights & Observations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {childInsights.parentInsights.map((insight, idx) => (
                  <p key={idx} style={{ fontSize: '14px', lineHeight: '1.5', background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================================
   ADMIN DASHBOARD
   ========================================================================= */
export function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Admin Console</h2>
        <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
      </div>
      <div className="card">
        <h3>Ecosystem Users</h3>
        <ul>
          {users.map(u => <li key={u.id}>{u.username} ({u.role}) - {u.accountStatus}</li>)}
        </ul>
      </div>
    </div>
  );
}
