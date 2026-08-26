import React, { useState, useEffect } from 'react';
import { BookOpen, Compass, Award, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export function CareerLibrary({ onBack }) {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activeTab, setActiveTab] = useState('roadmap'); // roadmap, resources
  const [roadmaps, setRoadmaps] = useState([]);
  const [resources, setResources] = useState([]);
  const [completedResources, setCompletedResources] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const selectCareer = async (career) => {
    setSelectedCareer(career);
    setActiveTab('roadmap');
    setFeedbackSuccess(false);
    setFeedback({ rating: 5, comment: '' });
    try {
      const rmRes = await api.get(`/careers/${career.id}/roadmap`);
      setRoadmaps(rmRes.data);
      const resRes = await api.get(`/careers/${career.id}/resources`);
      setResources(resRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleResource = (id) => {
    if (completedResources.includes(id)) {
      setCompletedResources(completedResources.filter(rid => rid !== id));
    } else {
      setCompletedResources([...completedResources, id]);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', {
        activityType: 'career',
        activityId: selectedCareer.id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      setFeedbackSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedCareer) {
    const progressPercent = resources.length 
      ? Math.round((completedResources.filter(id => resources.some(r => r.id === id)).length / resources.length) * 100) 
      : 0;

    return (
      <div className="animate-fade-in" style={{ padding: '16px' }}>
        <button className="btn btn-secondary" onClick={() => setSelectedCareer(null)} style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Library
        </button>

        <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, hsl(var(--hue-primary), 60%, 15%) 0%, hsl(var(--hue-primary), 65%, 25%) 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '8px' }}>{selectedCareer.name}</h2>
          <span style={{ background: 'var(--color-secondary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>
            {selectedCareer.domain}
          </span>
          <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.85)' }}>{selectedCareer.description}</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button 
            className={`btn ${activeTab === 'roadmap' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('roadmap')}
            style={{ flex: 1 }}
          >
            <Compass size={18} /> Career Roadmap
          </button>
          <button 
            className={`btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('resources')}
            style={{ flex: 1 }}
          >
            <BookOpen size={18} /> Learning Resources
          </button>
        </div>

        {activeTab === 'roadmap' ? (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Educational Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {roadmaps.map((rm) => (
                <div key={rm.id} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '18px', marginBottom: '8px' }}>{rm.educationLevel}</h4>
                  <p style={{ fontStyle: 'italic', marginBottom: '12px' }}>{rm.overview}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div>
                      <strong>Skills:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {rm.requiredSkills?.split(',').map((s, i) => (
                          <span key={i} style={{ background: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Recommended Courses:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {rm.recommendedCourses?.split(',').map((c, i) => (
                          <span key={i} style={{ background: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>{c.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="card animate-fade-in" style={{ marginBottom: '20px', background: 'hsla(var(--hue-secondary), 90%, 50%, 0.1)', borderColor: 'var(--color-secondary)' }}>
              <h4>Learning Progress</h4>
              <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-secondary)', transition: 'width 0.4s' }}></div>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{progressPercent}% Complete ({completedResources.filter(id => resources.some(r => r.id === id)).length}/{resources.length} resources)</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resources.map((res) => (
                <div key={res.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      {res.difficultyLevel} • {res.resourceType}
                    </span>
                    <h4 style={{ margin: '4px 0' }}>{res.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{res.description}</p>
                    <a href={res.externalLink} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                      Access Resource <ExternalLink size={14} />
                    </a>
                  </div>
                  <button 
                    onClick={() => toggleResource(res.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: completedResources.includes(res.id) ? 'var(--color-success)' : 'var(--color-border)' }}
                  >
                    <CheckCircle2 size={32} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Review Feedback Form */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Review this Career Path</h3>
          {feedbackSuccess ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', marginTop: '12px' }}>
              ✓ Thank you for your feedback! You earned +10 XP bonus!
            </div>
          ) : (
            <form onSubmit={submitFeedback} style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">How interesting is this career path to you?</label>
                <select 
                  className="form-input" 
                  value={feedback.rating} 
                  onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Essential (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ Great (4/5)</option>
                  <option value="3">⭐⭐⭐ Interesting (3/5)</option>
                  <option value="2">⭐⭐ Not for me (2/5)</option>
                  <option value="1">⭐ Boring (1/5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Any suggestions or comments?</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Share your thoughts about this job..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Feedback</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Career Discovery Library</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Discover the exciting jobs you can pursue. Click a path to check out roadmaps, learning tasks, and skills!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {careers.map((career) => (
          <div key={career.id} className="card" onClick={() => selectCareer(career)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '180px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{career.domain}</span>
              <h3 style={{ fontSize: '20px', margin: '4px 0 8px 0' }}>{career.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {career.description}
              </p>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
              Explore Path →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
