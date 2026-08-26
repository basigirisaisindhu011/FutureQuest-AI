import React, { useState } from 'react';
import { HelpCircle, Award, RefreshCw, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const QUESTIONS = [
  { id: 1, text: "I love building and designing things (like robots, websites, or blocks).", trait: "Realistic" },
  { id: 2, text: "I like investigating science questions, doing research, or solving puzzles.", trait: "Investigative" },
  { id: 3, text: "I enjoy drawing, taking photos, writing stories, or playing music.", trait: "Artistic" },
  { id: 4, text: "I like explaining topics to others, teaching, or helping friends feel better.", trait: "Social" },
  { id: 5, text: "I enjoy leading projects, selling items, or proposing new business ideas.", trait: "Enterprising" },
  { id: 6, text: "I like organizing data, making lists, and keeping things neat.", trait: "Conventional" },
  { id: 7, text: "I prefer working outdoors, tracking animals, or exploring nature.", trait: "Realistic" },
  { id: 8, text: "I am fascinated by how computer code works behind the screen.", trait: "Investigative" },
  { id: 9, text: "Designing logos, color palettes, or digital arts sounds fun to me.", trait: "Artistic" },
  { id: 10, text: "I would enjoy running my own online lemonade stand or business.", trait: "Enterprising" }
];

export function Quizzes({ onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [traitScores, setTraitScores] = useState({});

  const selectAnswer = (value) => {
    const q = QUESTIONS[currentIdx];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateScores(newAnswers);
    }
  };

  const calculateScores = async (finalAnswers) => {
    setSubmitting(true);
    // Count scores
    const scores = { Realistic: 0, Investigative: 0, Artistic: 0, Social: 0, Enterprising: 0, Conventional: 0 };
    QUESTIONS.forEach(q => {
      if (finalAnswers[q.id] === 'yes') {
        scores[q.trait] = (scores[q.trait] || 0) + 1;
      }
    });

    setTraitScores(scores);

    // Sum overall score (0 to 10 scale)
    const overallScore = Object.values(finalAnswers).filter(val => val === 'yes').length;

    try {
      await api.post('/child/quizzes', {
        quizType: 'personality',
        score: overallScore,
        responses: JSON.stringify(finalAnswers)
      });
      setFinished(true);
    } catch (e) {
      console.error("Failed to submit quiz results", e);
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setAnswers({});
    setFinished(false);
    setTraitScores({});
  };

  if (finished) {
    // Find strongest trait
    const topTrait = Object.keys(traitScores).reduce((a, b) => traitScores[a] > traitScores[b] ? a : b);

    return (
      <div className="card animate-fade-in" style={{ padding: '24px', textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
        <Award size={64} style={{ color: 'var(--color-accent)', margin: '0 auto 16px auto' }} />
        <h2>Quiz Completed!</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px 0' }}>You successfully analyzed your interests and earned +50 XP bonus!</p>
        
        <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '18px', marginBottom: '8px' }}>Your Core Profile: {topTrait}</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {topTrait === 'Artistic' && "You love expressing yourself through photography, design, branding, and animations. You excel at creative paths!"}
            {topTrait === 'Investigative' && "You have a natural curiosity for tech coding, medicine, aerospace scientific research, and complex problem-solving."}
            {topTrait === 'Realistic' && "You prefer hands-on activities, tracking wildlife in nature, playing sports, or building agricultural machinery."}
            {topTrait === 'Enterprising' && "You show high potential for running businesses, managing startup operations, and proposing marketing projects."}
            {topTrait === 'Social' && "You are excellent at communicating, mentoring, teaching, and working in public services or team activities."}
            {topTrait === 'Conventional' && "You enjoy organizing data, working with computer files, auditing rules, and structuring clean systems."}
          </p>
          
          <div style={{ marginTop: '16px' }}>
            <strong style={{ fontSize: '14px' }}>Interest Breakdown:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {Object.entries(traitScores).map(([trait, val]) => (
                <div key={trait} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ width: '90px', fontWeight: '600' }}>{trait}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(val / 2) * 100}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={onBack}>
            Go back to Dashboard
          </button>
          <button className="btn btn-secondary" onClick={resetQuiz}>
            <RefreshCw size={16} /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((currentIdx / QUESTIONS.length) * 100);

  return (
    <div className="animate-fade-in" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            Question {currentIdx + 1} of {QUESTIONS.length}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {progressPercent}% Complete
          </span>
        </div>
        
        <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden', marginBottom: '30px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.3s' }}></div>
        </div>

        <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)' }}>
            "{QUESTIONS[currentIdx].text}"
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => selectAnswer('yes')}
            disabled={submitting}
            style={{ padding: '16px', fontSize: '18px' }}
          >
            Yes, that's me! 👍
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => selectAnswer('no')}
            disabled={submitting}
            style={{ padding: '16px', fontSize: '18px' }}
          >
            No, not really. 👎
          </button>
        </div>
      </div>
    </div>
  );
}
