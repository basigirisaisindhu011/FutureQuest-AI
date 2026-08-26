import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Award, RotateCcw, Lock, CheckCircle2, Star, Volume2, Mic, Play, RefreshCw, Layers, Send, Lightbulb, Zap, Trash2, Shield, Compass, Camera, Heart, Briefcase, Megaphone } from 'lucide-react';
import api from '../utils/api';

const DEFAULT_LEVELS = [
  { level: 'EASY', unlocked: true, completed: false, starsEarned: 0, xpEarned: 0, replayCount: 0, targetCount: 5, subtitle: '🌱 Warm-Up Adventure' },
  { level: 'MODERATE', unlocked: true, completed: false, starsEarned: 0, xpEarned: 0, replayCount: 0, targetCount: 5, subtitle: '🚀 Ready for More?' },
  { level: 'MEDIUM', unlocked: true, completed: false, starsEarned: 0, xpEarned: 0, replayCount: 0, targetCount: 6, subtitle: '🔥 Challenge Yourself' },
  { level: 'HARD', unlocked: true, completed: false, starsEarned: 0, xpEarned: 0, replayCount: 0, targetCount: 7, subtitle: '🏆 Expert Adventure' }
];

const CATEGORY_KEYS = {
  ALL: 'ALL',
  COMMUNICATION_LANGUAGE: 'COMMUNICATION_LANGUAGE',
  TECHNOLOGY_LOGIC: 'TECHNOLOGY_LOGIC',
  SCIENCE_EXPLORATION: 'SCIENCE_EXPLORATION',
  CREATIVITY_DESIGN: 'CREATIVITY_DESIGN',
  NATURE_ENVIRONMENT: 'NATURE_ENVIRONMENT',
  SOCIAL_HELPING: 'SOCIAL_HELPING',
  BUSINESS_LEADERSHIP: 'BUSINESS_LEADERSHIP'
};

const CATEGORIES_LIST = [
  { id: 'ALL', name: 'All Games', icon: '🎮', tagline: 'Explore all interactive mini-games across every category.' },
  { id: 'COMMUNICATION_LANGUAGE', name: 'Communication & Language', icon: '🗣️', tagline: 'Build your speaking, listening, vocabulary, and storytelling skills.', themeColor: '#EC4899' },
  { id: 'TECHNOLOGY_LOGIC', name: 'Technology & Logic', icon: '💻', tagline: 'Master coding, pattern recognition, and problem solving.', themeColor: '#3B82F6' },
  { id: 'SCIENCE_EXPLORATION', name: 'Science & Exploration', icon: '🔬', tagline: 'Discover planetary physics, space orbits, and ancient history.', themeColor: '#8B5CF6' },
  { id: 'CREATIVITY_DESIGN', name: 'Creativity & Design', icon: '🎨', tagline: 'Express yourself through color palettes, room design, and visual themes.', themeColor: '#F43F5E' },
  { id: 'NATURE_ENVIRONMENT', name: 'Nature & Environment', icon: '🌱', tagline: 'Observe wildlife habitats and protect planet Earth.', themeColor: '#10B981' },
  { id: 'SOCIAL_HELPING', name: 'Social & Helping', icon: '🤝', tagline: 'Develop empathy and healthcare first-aid decision making.', themeColor: '#EF4444' },
  { id: 'BUSINESS_LEADERSHIP', name: 'Business & Leadership', icon: '💼', tagline: 'Manage budget simulations, business strategy, and news reporting.', themeColor: '#EAB308' }
];

const MASTER_GAMES_LIST = [
  // Communication & Language
  { id: 'spell_quest', name: 'Spell Quest 🔤', tagline: 'Become a Word Wizard!', desc: 'Type & spell words accurately with letter feedback.', categories: ['COMMUNICATION_LANGUAGE'], badge: '🔤 Word Wizard', victoryMsg: 'Word Wizard! 🔤', themeColor: '#EC4899' },
  { id: 'listen_spell', name: 'Listen & Spell 🎧', tagline: 'Tune Your Ears!', desc: 'Listen to spoken words and type their spelling.', categories: ['COMMUNICATION_LANGUAGE'], badge: '🎧 Master Listener', victoryMsg: 'Super Listener! 🎧', themeColor: '#EC4899' },
  { id: 'speaking_games', name: 'Speak & Shine 🎙️', tagline: 'Share Your Voice!', desc: 'Speak clearly into the microphone on tailored prompts.', categories: ['COMMUNICATION_LANGUAGE'], badge: '🎙️ Speaking Star', victoryMsg: 'Awesome Speaking! 🎙️', themeColor: '#EC4899' },
  { id: 'read_aloud', name: 'Read Aloud 📖', tagline: 'Master Reading!', desc: 'Read full sentences out loud with speech feedback.', categories: ['COMMUNICATION_LANGUAGE'], badge: '📖 Fluent Reader', victoryMsg: 'Fluent Reading! 📖', themeColor: '#EC4899' },
  { id: 'describe_picture', name: 'Describe the Picture 🖼️', tagline: 'Visual Storytelling!', desc: 'Describe rich visual scenes out loud.', categories: ['COMMUNICATION_LANGUAGE'], badge: '🖼️ Scene Explorer', victoryMsg: 'Great Observation! 🖼️', themeColor: '#EC4899' },
  { id: 'story_builder', name: 'Story Builder 📚', tagline: 'Craft Adventures!', desc: 'Build short stories from visual image sequences.', categories: ['COMMUNICATION_LANGUAGE', 'CREATIVITY_DESIGN'], badge: '📚 Story Star', victoryMsg: 'Creative Story! 📚', themeColor: '#EC4899' },
  { id: 'sentence_builder', name: 'Sentence Builder 💬', tagline: 'Word Puzzle Master!', desc: 'Arrange large scrambled word cards into sentences.', categories: ['COMMUNICATION_LANGUAGE'], badge: '💬 Sentence Master', victoryMsg: 'Sentence Completed! 💬', themeColor: '#EC4899' },
  { id: 'rapid_word', name: 'Rapid Word Challenge ⚡', tagline: 'Fast Vocabulary!', desc: 'Recall as many words in a category as you can in 30s.', categories: ['COMMUNICATION_LANGUAGE'], badge: '⚡ Rapid Mind', victoryMsg: 'Speedy Thinking! ⚡', themeColor: '#EC4899' },

  // Technology & Logic
  { id: 'code_robot', name: 'Code the Robot 🤖', tagline: 'Guide Robot to Target!', desc: 'Plan movement commands on an animated 4x4 grid.', categories: ['TECHNOLOGY_LOGIC'], badge: '🤖 Robot Coder', victoryMsg: 'Robot reached the goal! 🤖', themeColor: '#3B82F6' },
  { id: 'puzzle_lab', name: 'Puzzle Laboratory 🧩', tagline: 'Pattern Detective!', desc: 'Solve shape series, odd-one-out, and visual puzzles.', categories: ['TECHNOLOGY_LOGIC'], badge: '🧩 Puzzle Master', victoryMsg: 'Puzzle cracked! 🧩', themeColor: '#3B82F6' },
  { id: 'math_treasure', name: 'Math Treasure Hunt 🗺️', tagline: 'Unlock Chests!', desc: 'Solve pirate treasure riddles to unlock coin chests.', categories: ['TECHNOLOGY_LOGIC'], badge: '🗺️ Treasure Solver', victoryMsg: 'Treasure Unlocked! 🗺️', themeColor: '#3B82F6' },
  { id: 'cyber_detective', name: 'Cyber Detective 🕵️', tagline: 'Digital Safety Hero!', desc: 'Spot security clues and solve online safety cases.', categories: ['TECHNOLOGY_LOGIC'], badge: '🕵️ Safety Detective', victoryMsg: 'Digital Safety Hero! 🕵️', themeColor: '#3B82F6' },

  // Science & Exploration
  { id: 'space_scientist', name: 'Space Scientist 🚀', tagline: 'Explore Cosmos!', desc: 'Discover planets, orbits, and space missions.', categories: ['SCIENCE_EXPLORATION'], badge: '🚀 Space Explorer', victoryMsg: 'Space Discovery Complete! 🚀', themeColor: '#8B5CF6' },
  { id: 'archaeologist', name: 'Archaeologist 🏺', tagline: 'Uncover History!', desc: 'Excavate ancient tools and relics.', categories: ['SCIENCE_EXPLORATION'], badge: '🏺 Relic Finder', victoryMsg: 'Ancient History Uncovered! 🏺', themeColor: '#8B5CF6' },

  // Creativity & Design
  { id: 'dream_designer', name: 'Dream Designer 🎨', tagline: 'Design Your Room!', desc: 'Pick color schemes and arrange room decor (No wrong answers!).', categories: ['CREATIVITY_DESIGN'], badge: '🎨 Creative Spark', victoryMsg: 'Awesome design choice! 🎨', themeColor: '#F43F5E' },

  // Nature & Environment
  { id: 'wildlife_photo', name: 'Wildlife Photographer 📷', tagline: 'Capture Nature!', desc: 'Observe wildlife species in natural habitats.', categories: ['NATURE_ENVIRONMENT'], badge: '📷 Nature Photographer', victoryMsg: 'Wildlife Photo Captured! 📷', themeColor: '#10B981' },
  { id: 'eco_rescue', name: 'Eco Rescue 🌱', tagline: 'Save Planet Earth!', desc: 'Sort waste into recycling, compost, and trash bins.', categories: ['NATURE_ENVIRONMENT'], badge: '🌱 Eco Hero', victoryMsg: 'Planet saved! 🌱', themeColor: '#10B981' },

  // Social & Helping
  { id: 'emergency_doctor', name: 'Emergency Doctor 🩺', tagline: 'Empathetic Healer!', desc: 'Help patients with basic health and first-aid steps.', categories: ['SOCIAL_HELPING'], badge: '🩺 Caring Doctor', victoryMsg: 'Empathetic Healthcare Care! 🩺', themeColor: '#EF4444' },

  // Business & Leadership
  { id: 'mini_entrepreneur', name: 'Mini Entrepreneur 💼', tagline: 'Lemonade Stand Boss!', desc: 'Manage your ₹500 budget and serve happy customers.', categories: ['BUSINESS_LEADERSHIP'], badge: '💼 Young Entrepreneur', victoryMsg: 'Great business decision! 💼', themeColor: '#EAB308' },
  { id: 'news_reporter', name: 'News Reporter 🎤', tagline: 'Headline News!', desc: 'Broadcast fictional news reports to earn reporter badges.', categories: ['BUSINESS_LEADERSHIP', 'COMMUNICATION_LANGUAGE'], badge: '🎤 Junior Reporter', victoryMsg: 'Headline Report Complete! 🎤', themeColor: '#EAB308' }
];

// DIFFICULTY-SPECIFIC QUESTION BANKS
const GAME_QUESTION_BANKS = {
  spell_quest: {
    EASY: ['CAT', 'DOG', 'SUN', 'BOOK', 'TREE', 'FISH', 'MILK', 'BIRD'],
    MODERATE: ['PLANET', 'SCHOOL', 'ANIMAL', 'DOCTOR', 'FRIEND', 'GARDEN', 'FAMILY'],
    MEDIUM: ['ADVENTURE', 'COMPUTER', 'CREATIVE', 'JOURNEY', 'SCIENTIST', 'DISCOVERY'],
    HARD: ['TECHNOLOGY', 'ENVIRONMENT', 'COMMUNICATION', 'ARCHITECTURE', 'ENTREPRENEUR']
  },
  listen_spell: {
    EASY: ['CAT', 'DOG', 'SUN', 'TREE', 'MILK', 'STAR', 'PARK'],
    MODERATE: ['SCHOOL', 'PLANET', 'FRIEND', 'GARDEN', 'DOCTOR', 'FAMILY'],
    MEDIUM: ['ADVENTURE', 'COMPUTER', 'CREATIVE', 'LIBRARY', 'SCIENCE', 'JOURNEY'],
    HARD: ['TECHNOLOGY', 'COMMUNICATION', 'ENVIRONMENT', 'ARCHITECTURE', 'INVESTIGATION']
  },
  speaking_games: {
    EASY: ["Say your favorite color and why you like it.", "Tell me about your favorite pet or animal.", "Say your favorite food."],
    MODERATE: ["Tell me about your favorite game and why you enjoy playing it.", "Describe your school day and your favorite subject."],
    MEDIUM: ["Describe your classroom and tell me what you like best about it.", "Explain how to play your favorite outdoor sport."],
    HARD: ["If you could invent something to help your school, what would you create and why?", "Share your opinion: Is space exploration or ocean discovery more exciting and why?"]
  },
  story_builder: {
    EASY: [{ sequence: ['🐶', '🌧️', '🏠', '😊'], hint: "A little dog in the rain finding a warm home!" }],
    MODERATE: [{ sequence: ['🚀', '🌙', '👽', '🌟'], hint: "A space rocket landing on the moon and making friends!" }],
    MEDIUM: [{ sequence: ['🌳', '🐦', '💨', '🪺'], hint: "A bird protecting its nest during a windy storm!" }],
    HARD: [{ sequence: ['🎨', '🖌️', '🏆', '⭐'], hint: "An artist working hard and winning the golden trophy!" }]
  },
  news_reporter: {
    EASY: [{ headline: "🌳 Students Plant 100 Trees", facts: ["100 green trees planted", "50 students participated", "Took place on Friday", "Teachers helped out"] }],
    MODERATE: [{ headline: "🤖 School Robot Wins Science Fair", facts: ["Robot built by 6th graders", "Won 1st prize trophy", "Can sort recycling automatically"] }],
    MEDIUM: [{ headline: "🚀 Space Explorer Satellite Launched", facts: ["Launched into orbit at 8:00 AM", "Takes photos of Jupiter's moons", "Mission lasts 2 years"] }],
    HARD: [{ headline: "🌊 Eco Volunteers Clean Local Beach", facts: ["Cleaned 500 kg of plastic", "Protected marine sea turtles", "Community project supported by 200 citizens"] }]
  },
  rapid_word: {
    EASY: ["🐾 Animals", "🍎 Fruits", "🎨 Colors"],
    MODERATE: ["💼 Jobs & Careers", "🌳 Nature & Environment", "⚽ Sports"],
    MEDIUM: ["💻 Technology Terms", "🚀 Space Objects", "🏛️ Historical Places"],
    HARD: ["🗣️ Communication Words", "🔬 Scientific Instruments", "🏛️ Architectural Structures"]
  },
  read_aloud: {
    EASY: ["The cat sat on the mat.", "The sun shines bright in the sky.", "A red bird sang on the tree."],
    MODERATE: ["The dog is playing in the garden.", "We love exploring nature and learning new things.", "Our school planted green trees today."],
    MEDIUM: ["The curious astronaut explored the shiny planet.", "Solving logical puzzles expands our thinking power.", "Building stories requires imagination and strong vocabulary."],
    HARD: ["Clear communication and vocabulary build strong leadership skills.", "Environmental preservation ensures a sustainable future for all.", "Scientific discovery inspires technological innovation."]
  },
  puzzle_lab: {
    EASY: [
      { q: "What comes next in the pattern: 2, 4, 6, ?", options: ["8", "10", "7"], correct: "8" },
      { q: "Find the odd one out:", options: ["🐶 Dog", "🐱 Cat", "🚗 Car"], correct: "🚗 Car" },
      { q: "What comes next: ▲ ● ▲ ● ▲ ?", options: ["● Circle", "▲ Triangle", "■ Square"], correct: "● Circle" }
    ],
    MODERATE: [
      { q: "What comes next in the pattern: 3, 6, 12, 24, ?", options: ["48", "36", "30"], correct: "48" },
      { q: "Find the odd one out:", options: ["🍎 Apple", "🍌 Banana", "⚽ Soccer Ball"], correct: "⚽ Soccer Ball" },
      { q: "What comes next: 4, 12, 36, ?", options: ["108", "96", "72"], correct: "108" }
    ],
    MEDIUM: [
      { q: "Square numbers sequence: 1, 4, 9, 16, ?", options: ["25", "20", "30"], correct: "25" },
      { q: "Pattern solve: 2, 5, 10, 17, ?", options: ["26", "24", "30"], correct: "26" }
    ],
    HARD: [
      { q: "Solve Fibonacci: 1, 1, 2, 3, 5, 8, ?", options: ["13", "11", "15"], correct: "13" },
      { q: "Logic pattern: 2, 6, 12, 20, 30, ?", options: ["42", "40", "36"], correct: "42" }
    ]
  },
  math_treasure: {
    EASY: [
      { q: "You find 5 gold coins and 4 silver coins. Total?", options: ["9", "10", "8"], correct: "9" },
      { q: "You have 10 coins and spend 3. How many left?", options: ["7", "6", "8"], correct: "7" }
    ],
    MODERATE: [
      { q: "You find 6 treasure boxes with 4 coins in each. Total?", options: ["24", "20", "28"], correct: "24" },
      { q: "A chest has 35 gems split equally among 5 explorers. How many each?", options: ["7", "6", "8"], correct: "7" }
    ],
    MEDIUM: [
      { q: "24 coins shared equally into 6 chests. How many per chest?", options: ["4", "6", "8"], correct: "4" },
      { q: "You find 3 bags with 8 coins each, plus 5 bonus coins. Total?", options: ["29", "27", "31"], correct: "29" }
    ],
    HARD: [
      { q: "Chest code is double 15 plus 12. What is the code?", options: ["42", "30", "45"], correct: "42" },
      { q: "Triple 12 minus 6 divided by 3. What is the key?", options: ["10", "12", "8"], correct: "10" }
    ]
  },
  cyber_detective: {
    EASY: [
      { q: "What is the safest action when a stranger asks for your address online?", options: ["Never share address", "Tell them", "Post it"], correct: "Never share address" }
    ],
    MODERATE: [
      { q: "Text msg: 'You won $1000! Click link.' What should you do?", options: ["Do not click & tell adult", "Click link", "Send password"], correct: "Do not click & tell adult" }
    ],
    MEDIUM: [
      { q: "An app asks access to your contacts and location. What check?", options: ["Ask parent & check necessity", "Grant all", "Ignore safety"], correct: "Ask parent & check necessity" }
    ],
    HARD: [
      { q: "What is the strongest security habit?", options: ["Long password + 2FA", "Password123", "Your nickname"], correct: "Long password + 2FA" }
    ]
  },
  space_scientist: {
    EASY: [
      { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter"], correct: "Mars" }
    ],
    MODERATE: [
      { q: "Which planet is closest to the Sun?", options: ["Mercury", "Mars", "Earth"], correct: "Mercury" }
    ],
    MEDIUM: [
      { q: "What force keeps planets in orbit around the Sun?", options: ["Gravity", "Magnetism", "Wind"], correct: "Gravity" }
    ],
    HARD: [
      { q: "What powers the Sun's core energy?", options: ["Nuclear Fusion", "Chemical burning", "Solar panels"], correct: "Nuclear Fusion" }
    ]
  }
};

export function Games({ onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_KEYS.ALL);
  const [levelProgresses, setLevelProgresses] = useState(DEFAULT_LEVELS);
  const [loadingLevels, setLoadingLevels] = useState(false);

  const openGameLevelSelector = async (game) => {
    setSelectedGame(game);
    setSelectedLevel(null);
    setLevelProgresses(DEFAULT_LEVELS);
    setLoadingLevels(true);
    try {
      const res = await api.get(`/child/games/${game.id}/levels`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const updated = res.data.map(l => ({ ...l, unlocked: true }));
        setLevelProgresses(updated);
      }
    } catch (e) {
      console.warn("Using default unlocked levels fallback:", e);
      setLevelProgresses(DEFAULT_LEVELS);
    } finally {
      setLoadingLevels(false);
    }
  };

  const startLevel = (lvlObj) => {
    setSelectedLevel(lvlObj.level);
  };

  const filteredGames = selectedCategory === CATEGORY_KEYS.ALL
    ? MASTER_GAMES_LIST
    : MASTER_GAMES_LIST.filter(g => g.categories.includes(selectedCategory));

  const activeCategoryObj = CATEGORIES_LIST.find(c => c.id === selectedCategory) || CATEGORIES_LIST[0];

  if (selectedGame && selectedLevel) {
    return (
      <InteractiveGameEngine 
        game={selectedGame} 
        level={selectedLevel} 
        onBack={() => openGameLevelSelector(selectedGame)}
        onFinish={() => openGameLevelSelector(selectedGame)}
      />
    );
  }

  // REDESIGNED FREE LEVEL SELECTION SCREEN
  if (selectedGame) {
    const listToRender = levelProgresses.length > 0 ? levelProgresses : DEFAULT_LEVELS;

    return (
      <div className="card animate-fade-in" style={{ maxWidth: '900px', width: '90%', margin: '30px auto', padding: '32px' }}>
        <button className="btn btn-secondary" onClick={() => setSelectedGame(null)} style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Game Center
        </button>

        <div style={{ background: `linear-gradient(135deg, ${selectedGame.themeColor || 'var(--color-primary)'}22, ${selectedGame.themeColor || 'var(--color-primary)'}44)`, padding: '24px', borderRadius: '16px', marginBottom: '28px', borderLeft: `6px solid ${selectedGame.themeColor || 'var(--color-primary)'}` }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px', color: selectedGame.themeColor || 'var(--color-primary)' }}>
            CHOOSE YOUR CHALLENGE
          </span>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', margin: '4px 0 6px' }}>{selectedGame.name}</h2>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{selectedGame.tagline || 'Choose any level you like!'}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Pick any difficulty level below to start playing immediately!</p>
        </div>

        {loadingLevels ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>Loading Challenge Levels...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {listToRender.map((lvl) => {
              const isEasy = lvl.level === 'EASY';
              const badgeColor = isEasy ? 'var(--color-success)' : (lvl.level === 'MODERATE' ? '#EAB308' : (lvl.level === 'MEDIUM' ? '#F97316' : '#EF4444'));
              const labelName = isEasy ? '🟢 Level 1 — Easy' : (lvl.level === 'MODERATE' ? '🟡 Level 2 — Moderate' : (lvl.level === 'MEDIUM' ? '🟠 Level 3 — Medium' : '🔴 Level 4 — Hard'));
              const subtitle = isEasy ? '🌱 Warm-Up Adventure' : (lvl.level === 'MODERATE' ? '🚀 Ready for More?' : (lvl.level === 'MEDIUM' ? '🔥 Challenge Yourself' : '🏆 Expert Adventure'));
              
              return (
                <div 
                  key={lvl.level} 
                  className="card"
                  onClick={() => startLevel(lvl)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px',
                    borderLeft: `8px solid ${badgeColor}`,
                    background: 'var(--bg-app)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      {labelName} {lvl.completed && <CheckCircle2 size={22} style={{ color: 'var(--color-success)' }} />}
                    </h3>
                    <p style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{subtitle}</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {lvl.targetCount || 5} Missions {lvl.replayCount > 0 ? `• Played ${lvl.replayCount} time${lvl.replayCount > 1 ? 's' : ''}` : '• Not tried yet'} {lvl.starsEarned > 0 && `• ${'⭐'.repeat(lvl.starsEarned)}`}
                    </p>
                  </div>

                  <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); startLevel(lvl); }} style={{ padding: '14px 28px', fontSize: '16px' }}>
                    {lvl.completed ? 'PLAY AGAIN 🔄' : 'PLAY 🚀'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // REDESIGNED GAME CENTER WITH CATEGORY FILTERING
  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '1200px', width: '92%', margin: '0 auto' }}>
      
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to My Adventure
      </button>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Outfit', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          CareerQuest Game Center 🎮
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
          Play fun interactive mini-games. Select a category below to filter games by skill domain!
        </p>
      </div>

      {/* Category Filter Pills / Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
        {CATEGORIES_LIST.map(cat => {
          const gameCount = cat.id === CATEGORY_KEYS.ALL 
            ? MASTER_GAMES_LIST.length 
            : MASTER_GAMES_LIST.filter(g => g.categories.includes(cat.id)).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '10px 18px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: isActive ? '0 4px 12px hsla(var(--hue-primary), 85%, 60%, 0.3)' : 'none'
              }}
            >
              {cat.icon} {cat.name} ({gameCount})
            </button>
          );
        })}
      </div>

      {/* Selected Category Banner */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px 24px', background: 'var(--bg-app)', borderLeft: `6px solid ${activeCategoryObj.themeColor || 'var(--color-primary)'}` }}>
        <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          {activeCategoryObj.icon} {activeCategoryObj.name}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {activeCategoryObj.tagline} • Showing {filteredGames.length} Mini-Game{filteredGames.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Filtered Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
          This adventure is being prepared. 🚀
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredGames.map(game => (
            <div 
              key={game.id} 
              className="card" 
              onClick={() => openGameLevelSelector(game)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                padding: '24px',
                borderLeft: `5px solid ${game.themeColor || 'var(--color-primary)'}`,
                cursor: 'pointer',
                background: 'var(--bg-app)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '22px', marginBottom: '4px', color: game.themeColor || 'var(--color-primary)' }}>{game.name}</h3>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '8px' }}>{game.tagline}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{game.desc}</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={(e) => { e.stopPropagation(); openGameLevelSelector(game); }} 
                style={{ marginTop: '18px', width: '100%', padding: '12px', fontSize: '15px' }}
              >
                Choose Challenge 🚀
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* =========================================================================
   SPECIALIZED MINI-GAME ENGINES (PROMINENT VISUALS & DYNAMIC MECHANICS)
   ========================================================================= */
function InteractiveGameEngine({ game, level, onBack, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);
  const [completedResult, setCompletedResult] = useState(null);

  // Specialized State
  const [typedInput, setTypedInput] = useState('');
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [robotPath, setRobotPath] = useState([]);
  const [robotPos, setRobotPos] = useState({ r: 0, c: 0 });
  const [selectedWords, setSelectedWords] = useState([]);
  const [creativeChoice, setCreativeChoice] = useState(null);
  const [lemonadePrice, setLemonadePrice] = useState(20);
  const [showHint, setShowHint] = useState(false);
  
  // Rapid Word Engine State
  const [rapidTimer, setRapidTimer] = useState(30);
  const [rapidWordsList, setRapidWordsList] = useState([]);
  const [rapidInput, setRapidInput] = useState('');

  const totalMissions = 5;

  // Rapid word countdown timer
  useEffect(() => {
    if (game.id === 'rapid_word' && rapidTimer > 0 && !completedResult) {
      const interval = setInterval(() => {
        setRapidTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [game.id, rapidTimer, completedResult]);

  const addRapidWord = () => {
    if (rapidInput.trim() && !rapidWordsList.includes(rapidInput.trim().toUpperCase())) {
      setRapidWordsList([...rapidWordsList, rapidInput.trim().toUpperCase()]);
      setRapidInput('');
    }
  };

  const getWordForLevel = (gId, lvl, idx) => {
    const bank = GAME_QUESTION_BANKS[gId]?.[lvl] || ['CAT', 'DOG', 'SUN', 'BOOK', 'TREE'];
    return bank[idx % bank.length];
  };

  const getReadAloudSentence = (lvl, idx) => {
    const bank = GAME_QUESTION_BANKS.read_aloud?.[lvl];
    if (Array.isArray(bank)) return bank[idx % bank.length];
    return bank || "The cat sat on the mat.";
  };

  const getSpeakingPrompt = (lvl, idx) => {
    const bank = GAME_QUESTION_BANKS.speaking_games?.[lvl];
    if (Array.isArray(bank)) return bank[idx % bank.length];
    return "Tell Questy about your favorite animal or adventure!";
  };

  const getStoryItem = (lvl, idx) => {
    const list = GAME_QUESTION_BANKS.story_builder?.[lvl] || [
      { sequence: ['🐶', '🌧️', '🏠', '😊'], hint: "A little dog in the rain finding a warm home!" }
    ];
    return list[idx % list.length];
  };

  const getNewsItem = (lvl, idx) => {
    const list = GAME_QUESTION_BANKS.news_reporter?.[lvl] || [
      { headline: "🌳 Students Plant 100 Trees", facts: ["100 green trees planted", "50 students participated", "Took place on Friday", "Teachers helped out"] }
    ];
    return list[idx % list.length];
  };

  const getPuzzleItem = (lvl, idx) => {
    const list = GAME_QUESTION_BANKS.puzzle_lab?.[lvl] || [
      { q: "What comes next in the pattern: 2, 4, 6, ?", options: ["8", "10", "7"], correct: "8" }
    ];
    return list[idx % list.length];
  };

  const getMathItem = (lvl, idx) => {
    const list = GAME_QUESTION_BANKS.math_treasure?.[lvl] || [
      { q: "You find 5 gold coins and 4 silver coins. Total?", options: ["9", "10", "8"], correct: "9" }
    ];
    return list[idx % list.length];
  };

  const getCyberItem = (lvl, idx) => {
    const list = GAME_QUESTION_BANKS.cyber_detective?.[lvl] || [
      { q: "Safe action when stranger asks address?", options: ["Never share address", "Tell them"], correct: "Never share address" }
    ];
    return list[idx % list.length];
  };

  const playAudioWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setSpeechTranscript('');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSpeechTranscript(text);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setSpeechTranscript("I love exploring nature and building creative stories!");
        setIsRecording(false);
      };
      recognition.start();
    } else {
      setTimeout(() => {
        setSpeechTranscript("I enjoy solving puzzles and building stories with Questy!");
        setIsRecording(false);
      }, 1500);
    }
  };

  const getNextLevel = (lvl) => {
    switch (lvl) {
      case 'EASY': return 'MODERATE';
      case 'MODERATE': return 'MEDIUM';
      case 'MEDIUM': return 'HARD';
      default: return 'EASY';
    }
  };

  const handleNextMission = async (isCorrect) => {
    const nextScore = scoreCount + (isCorrect ? 1 : 0);
    setScoreCount(nextScore);

    if (currentIdx < totalMissions - 1) {
      setCurrentIdx(currentIdx + 1);
      setTypedInput('');
      setSpeechTranscript('');
      setRobotPath([]);
      setRobotPos({ r: 0, c: 0 });
      setSelectedWords([]);
      setCreativeChoice(null);
      setShowHint(false);
    } else {
      const finalPercentage = Math.round((nextScore / totalMissions) * 100);
      try {
        const res = await api.post('/child/games/level-complete', {
          gameId: game.id,
          gameName: game.name,
          gameCategory: (game.categories && game.categories.length > 0) ? game.categories[0] : 'COMMUNICATION_LANGUAGE',
          level: level,
          score: finalPercentage
        });
        setCompletedResult(res.data);
      } catch (e) {
        console.error(e);
        setCompletedResult({ completed: true, starsEarned: 3, xpEarned: 120, nextLevel: getNextLevel(level) });
      }
    }
  };

  if (completedResult) {
    const nextLevelName = getNextLevel(level);

    return (
      <div className="card animate-fade-in" style={{ maxWidth: '650px', margin: '40px auto', padding: '36px', textAlign: 'center', borderTop: `8px solid ${game.themeColor || 'var(--color-primary)'}` }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎉</div>
        <h2 style={{ fontSize: '32px' }}>{game.victoryMsg || `${level} Adventure Complete!`}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', margin: '8px 0' }}>{game.name} • Badge Earned: <strong>{game.badge || '🏅 Mini-Game Champion'}</strong></p>

        <div style={{ fontSize: '36px', margin: '20px 0' }}>
          {'⭐'.repeat(completedResult.starsEarned || 3)}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: game.themeColor || 'var(--color-primary)', marginBottom: '24px' }}>
          +{completedResult.xpEarned || 120} XP Earned!
        </div>

        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>What would you like to do next?</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onFinish} style={{ padding: '14px', fontSize: '16px' }}>
            🚀 Try {nextLevelName} Level
          </button>
          <button className="btn btn-secondary" onClick={() => { setCompletedResult(null); setCurrentIdx(0); setScoreCount(0); }} style={{ padding: '14px', fontSize: '16px' }}>
            🔄 Play {level} Again
          </button>
          <button className="btn btn-secondary" onClick={onFinish} style={{ padding: '14px', fontSize: '16px' }}>
            🎮 Choose Another Game
          </button>
          <button className="btn btn-secondary" onClick={onFinish} style={{ padding: '14px', fontSize: '16px' }}>
            🏠 Back to My Adventure
          </button>
        </div>
      </div>
    );
  }

  const activeWord = getWordForLevel(game.id, level, currentIdx);
  const activeReadAloud = getReadAloudSentence(level, currentIdx);
  const activeSpeakingPrompt = getSpeakingPrompt(level, currentIdx);
  const storyItem = getStoryItem(level, currentIdx);
  const newsItem = getNewsItem(level, currentIdx);
  const puzzleItem = getPuzzleItem(level, currentIdx);
  const mathItem = getMathItem(level, currentIdx);
  const cyberItem = getCyberItem(level, currentIdx);

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '950px', width: '88%', margin: '24px auto', padding: '32px', borderTop: `6px solid ${game.themeColor || 'var(--color-primary)'}` }}>
      
      {/* Top Compact Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '8px 16px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Exit Game
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '800', fontSize: '16px', color: game.themeColor || 'var(--color-primary)' }}>
            {game.name}
          </span>
          <span style={{ background: 'var(--bg-app)', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
            {level} • {currentIdx + 1}/{totalMissions}
          </span>
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div style={{ background: 'var(--color-border)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ width: `${((currentIdx + 1) / totalMissions) * 100}%`, height: '100%', background: game.themeColor || 'var(--color-primary)', transition: 'width 0.3s' }}></div>
      </div>

      {/* 1. SPELL QUEST ENGINE (SpellingEngine) */}
      {game.id === 'spell_quest' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🔤</span>
            <h2 style={{ fontSize: '28px', margin: 0 }}>Spell Quest ({level})</h2>
          </div>
          
          <div className="card" style={{ background: 'var(--bg-app)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Spell the target word below:</span>
            <div style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '6px', color: game.themeColor || 'var(--color-primary)' }}>
              {activeWord}
            </div>
            <button className="btn btn-secondary" onClick={() => playAudioWord(activeWord)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} /> Pronounce Word
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            {activeWord.split('').map((char, i) => {
              const enteredChar = typedInput[i] || '';
              return (
                <div key={i} style={{ width: '50px', height: '60px', border: '3px solid var(--color-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', background: enteredChar ? 'var(--bg-app)' : 'var(--color-border)' }}>
                  {enteredChar}
                </div>
              );
            })}
          </div>

          <input 
            className="form-input"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value.toUpperCase())}
            placeholder="Type spelling here..."
            style={{ fontSize: '24px', letterSpacing: '4px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}
            autoFocus
          />

          <button className="btn btn-primary" onClick={() => handleNextMission(typedInput.trim() === activeWord)} style={{ padding: '16px', fontSize: '18px' }}>
            Check Spelling ✅
          </button>
        </div>
      )}

      {/* 2. LISTEN & SPELL ENGINE (ListenSpellEngine) */}
      {game.id === 'listen_spell' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '36px' }}>🎧</span>
            <h2 style={{ fontSize: '28px', margin: 0 }}>Listen & Spell ({level})</h2>
          </div>

          <div className="card" style={{ background: 'var(--bg-app)', padding: '28px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Click the audio button to hear the hidden word, then type your spelling!
            </p>
            <button className="btn btn-primary" onClick={() => playAudioWord(activeWord)} style={{ padding: '18px 36px', fontSize: '22px', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <Volume2 size={28} /> Play Spoken Word
            </button>
            {showHint && (
              <div style={{ marginTop: '16px', fontSize: '16px', color: 'var(--color-secondary)' }}>
                💡 Hint: Starts with letter <strong>"{activeWord[0]}"</strong> ({activeWord.length} letters long)
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setShowHint(true)}>💡 Show Hint</button>
            <button className="btn btn-secondary" onClick={() => playAudioWord(activeWord)}>🔄 Hear Again</button>
          </div>

          <input 
            className="form-input"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value.toUpperCase())}
            placeholder="Type word spelling..."
            style={{ fontSize: '28px', letterSpacing: '4px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}
          />

          <button className="btn btn-primary" onClick={() => handleNextMission(typedInput.trim() === activeWord)} style={{ padding: '16px', fontSize: '18px' }}>
            Submit Spelling ✅
          </button>
        </div>
      )}

      {/* 3. STORY BUILDER ENGINE (StoryEngine) */}
      {game.id === 'story_builder' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>📚</span>
            <h2 style={{ fontSize: '28px', margin: 0 }}>Story Builder ({level})</h2>
          </div>

          <div className="card" style={{ background: 'var(--bg-app)', padding: '24px' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Create an exciting story based on this visual image sequence:
            </p>
            
            {/* Visual Image Sequence */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', margin: '16px 0' }}>
              {storyItem.sequence.map((img, i) => (
                <React.Fragment key={i}>
                  <div className="card" style={{ width: '75px', height: '75px', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                    {img}
                  </div>
                  {i < storyItem.sequence.length - 1 && <span style={{ fontSize: '24px', fontWeight: 'bold' }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
            <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--color-secondary)' }}>"{storyItem.hint}"</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={startVoiceRecording} disabled={isRecording} style={{ padding: '16px 28px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={22} /> {isRecording ? 'Listening...' : '🎤 Tell My Story'}
            </button>
          </div>

          {speechTranscript && (
            <div className="card" style={{ borderLeft: '4px solid var(--color-success)', textAlign: 'left' }}>
              <strong>Your Spoken Story:</strong>
              <p style={{ fontSize: '16px', marginTop: '6px' }}>"{speechTranscript}"</p>
            </div>
          )}

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px' }}>
            Finish Story & Next Scene →
          </button>
        </div>
      )}

      {/* 4. NEWS REPORTER ENGINE (NewsEngine) */}
      {game.id === 'news_reporter' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>📰</span>
            <h2 style={{ fontSize: '28px', margin: 0 }}>News Reporter Studio ({level})</h2>
          </div>

          <div className="card" style={{ background: '#FFFBEB', border: '2px solid #F59E0B', padding: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#D97706', letterSpacing: '1px' }}>
              BREAKING NEWS EVENT CARD
            </div>
            <h3 style={{ fontSize: '24px', margin: '6px 0 12px', color: '#92400E' }}>{newsItem.headline}</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '16px', color: '#78350F' }}>
              {newsItem.facts.map((fact, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{fact}</li>
              ))}
            </ul>
          </div>

          <button className="btn btn-primary" onClick={startVoiceRecording} disabled={isRecording} style={{ padding: '18px 36px', fontSize: '20px', margin: '0 auto', background: '#D97706' }}>
            <Mic size={24} /> {isRecording ? 'Broadcasting...' : '🎤 You\'re the Reporter! Broadcast News'}
          </button>

          {speechTranscript && (
            <div className="card" style={{ borderLeft: '4px solid var(--color-success)', textAlign: 'left' }}>
              <strong>Broadcast Transcript:</strong>
              <p style={{ fontSize: '16px', marginTop: '6px' }}>"{speechTranscript}"</p>
            </div>
          )}

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px' }}>
            Publish Report & Next Headline →
          </button>
        </div>
      )}

      {/* 5. RAPID WORD CHALLENGE ENGINE (RapidWordEngine) */}
      {game.id === 'rapid_word' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '28px', margin: 0 }}>⚡ Rapid Word Challenge ({level})</h2>
            <div style={{ fontSize: '24px', fontWeight: '800', color: rapidTimer <= 10 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
              ⏱️ {rapidTimer}s Remaining
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-app)', padding: '20px' }}>
            <h3>Category: <span style={{ color: 'var(--color-primary)' }}>{GAME_QUESTION_BANKS.rapid_word?.[level]?.[currentIdx % 3] || '🐾 Animals'}</span></h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Type or speak as many words in this category as you can!</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <input 
              className="form-input"
              value={rapidInput}
              onChange={(e) => setRapidInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRapidWord()}
              placeholder="Type word and press Enter..."
              style={{ fontSize: '18px', flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addRapidWord} style={{ padding: '0 20px' }}>Add ✓</button>
          </div>

          {/* Live Word Chip Stream */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', minHeight: '60px' }}>
            {rapidWordsList.map((word, i) => (
              <span key={i} style={{ background: 'var(--color-primary)', color: 'white', padding: '6px 14px', borderRadius: '16px', fontSize: '15px', fontWeight: 'bold' }}>
                {word} ✓
              </span>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => handleNextMission(rapidWordsList.length > 0)} style={{ padding: '16px', fontSize: '18px' }}>
            Finish Challenge ({rapidWordsList.length} Words Recalled) →
          </button>
        </div>
      )}

      {/* 6. CODE THE ROBOT ENGINE (GridEngine) */}
      {game.id === 'code_robot' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Code the Robot ({level}) 🤖</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Build movement commands to guide robot 🤖 to star ⭐!</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 75px)', gap: '10px', justifyContent: 'center', margin: '12px 0' }}>
            {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => {
              const isRobot = robotPos.r === r && robotPos.c === c;
              const targetR = level === 'EASY' ? 1 : (level === 'MODERATE' ? 2 : 3);
              const targetC = level === 'EASY' ? 1 : (level === 'MODERATE' ? 2 : 3);
              const isStar = r === targetR && c === targetC;
              const isObstacle = (level === 'MEDIUM' || level === 'HARD') && ((r === 1 && c === 1) || (r === 2 && c === 2));

              return (
                <div key={`${r}-${c}`} style={{ width: '75px', height: '75px', border: '2px solid var(--color-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', background: isObstacle ? '#334155' : 'var(--bg-app)' }}>
                  {isRobot ? '🤖' : (isStar ? '⭐' : (isObstacle ? '⬛' : ''))}
                </div>
              );
            }))}
          </div>

          <div className="card" style={{ background: 'var(--bg-app)', padding: '12px 20px', minHeight: '45px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <strong>Commands:</strong> {robotPath.length > 0 ? robotPath.join(' ➔ ') : 'Click movement buttons below...'}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => { setRobotPath([...robotPath, 'RIGHT']); setRobotPos({ ...robotPos, c: Math.min(3, robotPos.c + 1) }); }}>➡️ Right</button>
            <button className="btn btn-secondary" onClick={() => { setRobotPath([...robotPath, 'DOWN']); setRobotPos({ ...robotPos, r: Math.min(3, robotPos.r + 1) }); }}>⬇️ Down</button>
            <button className="btn btn-secondary" onClick={() => { setRobotPath([]); setRobotPos({ r: 0, c: 0 }); }}>🔄 Reset</button>
          </div>

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px' }}>
            ▶ RUN ROBOT
          </button>
        </div>
      )}

      {/* 7. PUZZLE LABORATORY ENGINE (VisualPuzzleEngine) */}
      {game.id === 'puzzle_lab' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Puzzle Laboratory ({level}) 🧩</h2>
          <div className="card" style={{ padding: '24px', fontSize: '22px', fontWeight: 'bold', background: 'var(--bg-app)' }}>
            {puzzleItem.q}
          </div>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            {puzzleItem.options.map((opt, i) => (
              <button key={i} className="btn btn-secondary" onClick={() => handleNextMission(opt === puzzleItem.correct)} style={{ padding: '16px 28px', fontSize: '20px' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 8. MATH TREASURE HUNT ENGINE (MathTreasureEngine) */}
      {game.id === 'math_treasure' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Math Treasure Hunt ({level}) 🗺️</h2>
          <div className="card" style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', background: 'var(--bg-app)' }}>
            🏴‍☠️ {mathItem.q}
          </div>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            {mathItem.options.map((opt, i) => (
              <button key={i} className="btn btn-secondary" onClick={() => handleNextMission(opt === mathItem.correct)} style={{ padding: '16px 28px', fontSize: '20px' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 9. DREAM DESIGNER ENGINE (CreativeChoiceEngine) */}
      {game.id === 'dream_designer' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Dream Designer ({level}) 🎨</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Pick your favorite room theme & color palette. (No wrong answers!)</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '16px 0' }}>
            {[
              { label: '🪐 Cosmic Space Room', color: '#312E81' },
              { label: '🌿 Nature Forest Room', color: '#065F46' },
              { label: '🎨 Pastel Art Studio', color: '#9D174D' }
            ].map((theme, i) => (
              <div 
                key={i} 
                className="card"
                onClick={() => setCreativeChoice(theme.label)}
                style={{
                  padding: '24px',
                  background: theme.color,
                  color: 'white',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  border: creativeChoice === theme.label ? '4px solid var(--color-accent)' : 'none'
                }}
              >
                <h3>{theme.label}</h3>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px' }}>
            Save Design & Next Room →
          </button>
        </div>
      )}

      {/* 10. MINI ENTREPRENEUR ENGINE (SimulationEngine) */}
      {game.id === 'mini_entrepreneur' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Lemonade Challenge ({level}) 🍋</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Set your lemonade price per cup with your ₹500 budget!</p>

          <div className="card" style={{ padding: '24px', background: 'var(--bg-app)' }}>
            <h3>Price per cup: ₹{lemonadePrice}</h3>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={lemonadePrice} 
              onChange={(e) => setLemonadePrice(Number(e.target.value))}
              style={{ width: '80%', margin: '16px 0' }}
            />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {lemonadePrice <= 25 ? 'Great price! Many happy customers will buy lemonade.' : 'High price! Fewer customers might buy.'}
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px' }}>
            Open Stand & Serve Customers 🍋
          </button>
        </div>
      )}

      {/* 11. ECO RESCUE ENGINE (EcoEngine) */}
      {game.id === 'eco_rescue' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Eco Rescue ({level}) 🌱</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Sort this item into the correct bin: <strong>🧴 Plastic Bottle</strong></p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '16px 0' }}>
            <div className="card" onClick={() => handleNextMission(true)} style={{ padding: '20px', cursor: 'pointer', background: 'var(--bg-app)' }}>
              <h3 style={{ color: 'var(--color-primary)' }}>♻️ Recycling</h3>
            </div>
            <div className="card" onClick={() => handleNextMission(false)} style={{ padding: '20px', cursor: 'pointer', background: 'var(--bg-app)' }}>
              <h3 style={{ color: 'var(--color-success)' }}>🌱 Compost</h3>
            </div>
            <div className="card" onClick={() => handleNextMission(false)} style={{ padding: '20px', cursor: 'pointer', background: 'var(--bg-app)' }}>
              <h3 style={{ color: 'var(--color-danger)' }}>🗑️ Trash</h3>
            </div>
          </div>
        </div>
      )}

      {/* 12. SPEAKING & READ ALOUD & DESCRIBE PICTURE ENGINE */}
      {(game.id === 'speaking_games' || game.id === 'read_aloud' || game.id === 'describe_picture') && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>{game.name} ({level}) 🎙️</h2>
          
          {game.id === 'describe_picture' && (
            <div className="card" style={{ background: '#F8FAFC', padding: '20px' }}>
              <div style={{ fontSize: '80px', margin: '10px 0' }}>🏞️</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Describe the scene above in your own words!</p>
            </div>
          )}

          <div className="card" style={{ background: 'var(--bg-app)', padding: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            {game.id === 'read_aloud' ? activeReadAloud : (game.id === 'describe_picture' ? "Tell Questy everything you observe in this picture scene!" : activeSpeakingPrompt)}
          </div>

          <button className="btn btn-primary" onClick={startVoiceRecording} disabled={isRecording} style={{ padding: '20px 40px', fontSize: '22px', width: 'fit-content', margin: '0 auto', background: isRecording ? 'var(--color-accent)' : game.themeColor || 'var(--color-primary)' }}>
            <Mic size={28} /> {isRecording ? 'Listening...' : 'Start Speaking'}
          </button>

          {speechTranscript && (
            <div className="card" style={{ borderLeft: '4px solid var(--color-success)', textAlign: 'left', marginTop: '12px' }}>
              <strong>Here's what I heard:</strong>
              <p style={{ fontSize: '16px', marginTop: '6px' }}>"{speechTranscript}"</p>
            </div>
          )}

          <button className="btn btn-primary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px', marginTop: '16px' }}>
            {speechTranscript ? 'Awesome Speaking! Next Mission →' : 'Skip / Next Mission →'}
          </button>
        </div>
      )}

      {/* 13. SENTENCE BUILDER ENGINE */}
      {game.id === 'sentence_builder' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>Sentence Builder ({level}) 💬</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Click the word cards in order to form a correct sentence:</p>

          <div className="card" style={{ minHeight: '70px', padding: '20px', fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)', background: 'var(--bg-app)' }}>
            {selectedWords.join(' ') || 'Click word tiles below...'}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Maya', 'loves', 'building', 'creative', 'stories'].map((w, idx) => (
              <button key={idx} className="btn btn-secondary" onClick={() => setSelectedWords([...selectedWords, w])} style={{ padding: '14px 24px', fontSize: '20px', background: 'white' }}>
                {w}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => handleNextMission(selectedWords.length > 2)} style={{ padding: '16px', fontSize: '18px' }}>
            Check Sentence ✅
          </button>
        </div>
      )}

      {/* 14. DEFAULT ENGINE FOR REMAINING GAMES */}
      {!['spell_quest', 'listen_spell', 'puzzle_lab', 'math_treasure', 'cyber_detective', 'space_scientist', 'speaking_games', 'read_aloud', 'describe_picture', 'story_builder', 'news_reporter', 'code_robot', 'sentence_builder', 'dream_designer', 'mini_entrepreneur', 'eco_rescue', 'rapid_word'].includes(game.id) && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '28px' }}>{game.name} ({level})</h2>
          <div className="card" style={{ padding: '24px', fontSize: '20px', background: 'var(--bg-app)' }}>
            Mission Challenge ({level}): Choose the best action to complete this goal.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => handleNextMission(true)} style={{ padding: '16px', fontSize: '18px', textAlign: 'left' }}>
              🌟 Choice A: Take the safe and clever approach
            </button>
            <button className="btn btn-secondary" onClick={() => handleNextMission(false)} style={{ padding: '16px', fontSize: '18px', textAlign: 'left' }}>
              ⚡ Choice B: Try a bold alternative strategy
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
