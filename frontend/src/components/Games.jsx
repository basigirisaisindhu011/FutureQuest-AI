import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Mic,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import api from "../utils/api";
import { ageBand, takeChallenges, createPuzzleBank } from "../utils/challenges";
import { CareerDiscoveryGame } from "./CareerDiscoveryGames";
import { CreativeLifestyleGame } from "./CreativeLifestyleGames";
import { InterestDiscoveryGame } from "./InterestDiscoveryGames";
import { QuestyMascot } from "./QuestyMascot";
import { Brand, GameArtwork, GameCelebration } from "./AdventureVisuals";
import { GAME_CATALOG as CORE_GAMES, WORLDS } from "../data/catalog";

const LEVELS = ["EASY", "MODERATE", "MEDIUM", "HARD"];
const LEVEL_SIZE = { EASY: 5, MODERATE: 5, MEDIUM: 6, HARD: 6 };
const CATEGORY_NAMES = {
  TECHNOLOGY_LOGIC: "Technology & Logic",
  ENGINEERING_MAKING: "Engineering & Making",
  SCIENCE_RESEARCH: "Science & Research",
  CREATIVITY_DESIGN: "Creativity & Design",
  COMMUNICATION_MEDIA: "Communication & Media",
  COMMUNICATION_LANGUAGE: "Communication & Media",
  SOCIAL_HELPING: "Social & Helping",
  BUSINESS_LEADERSHIP: "Business & Leadership",
  NATURE_ENVIRONMENT: "Nature & Environment",
  CREATIVE_LIFESTYLE: "Creative & Lifestyle Careers",
  ALL_DOMAINS: "Cross-domain Exploration",
};
const WORDS = {
  EASY: [
    "CAT",
    "TREE",
    "BOOK",
    "WATER",
    "CLOUD",
    "TRAIN",
    "SMILE",
    "GREEN",
    "MUSIC",
    "LIGHT",
    "HOUSE",
    "BREAD",
    "RIVER",
    "FRIEND",
    "PLANT",
    "BIRD",
    "PENCIL",
    "WINDOW",
    "SUNNY",
    "KIND",
  ],
  MODERATE: [
    "PLANET",
    "DOCTOR",
    "ANIMAL",
    "SCHOOL",
    "GARDEN",
    "FAMILY",
    "JOURNEY",
    "MARKET",
    "PRACTICE",
    "MORNING",
    "MACHINE",
    "PREDICT",
    "SEASON",
    "CAPTAIN",
    "BALANCE",
    "EXPLORE",
    "BRIDGE",
    "CURIOUS",
    "ENERGY",
    "LIBRARY",
  ],
  MEDIUM: [
    "ADVENTURE",
    "COMPUTER",
    "CREATIVE",
    "SCIENTIST",
    "DISCOVERY",
    "LANGUAGE",
    "ENGINEER",
    "COMMUNITY",
    "DIRECTION",
    "IMAGINE",
    "PROTECT",
    "INVENTION",
    "VOLCANO",
    "PATTERN",
    "RESEARCH",
    "COMPASS",
    "MEASURE",
    "PROJECT",
    "CULTURE",
    "SOLAR",
  ],
  HARD: [
    "TECHNOLOGY",
    "ENVIRONMENT",
    "COMMUNICATION",
    "ARCHITECTURE",
    "ENTREPRENEUR",
    "OBSERVATION",
    "COLLABORATION",
    "SUSTAINABLE",
    "EXPERIMENTAL",
    "PERSPECTIVE",
    "RESPONSIBILITY",
    "CURIOSITY",
    "NEGOTIATION",
    "INNOVATION",
    "CONSERVATION",
    "CREATIVITY",
    "ENGINEERING",
    "IMAGINATION",
    "ORGANIZATION",
    "EXPLANATION",
  ],
};
const SPEAKING = {
  EASY: [
    "Tell me about a color you enjoy.",
    "What is a food you would happily share with a friend?",
    "Describe a place where you feel comfortable.",
  ],
  MODERATE: [
    "Tell me about an animal you like and give two reasons.",
    "Describe your favorite part of a school day.",
    "Explain a game you enjoy to someone who has never played it.",
  ],
  MEDIUM: [
    "Describe your classroom so someone could picture it.",
    "Explain how to care for a plant from one week to the next.",
    "Tell me about a problem you solved and what you tried first.",
  ],
  HARD: [
    "Invent something useful for school and explain who it helps.",
    "Should a town build a park or a shopping center? Give reasons.",
    "Explain how people can use technology while protecting nature.",
  ],
};
const STORIES = {
  EASY: [
    ["🐶", "🌧️", "🏠"],
    ["🐱", "🎈", "🌳"],
    ["🐢", "🏖️", "🌙"],
    ["🐦", "🪺", "☀️"],
    ["🧒", "🎒", "🏫"],
  ],
  MODERATE: [
    ["🚲", "🌳", "🐦", "🌈"],
    ["🧭", "🗺️", "🪨", "🏕️"],
    ["🧁", "🎉", "🎁", "😊"],
    ["🌱", "💧", "🌻", "🐝"],
    ["🎨", "🖌️", "🖼️", "👏"],
  ],
  MEDIUM: [
    ["🚀", "🌕", "👽", "🔧", "🏠"],
    ["🏝️", "🦜", "🧰", "⛵", "🌊"],
    ["🤖", "⚡", "🏙️", "🛠️", "❤️"],
    ["🐋", "🌊", "🗑️", "♻️", "🌊"],
    ["🎭", "😮", "💡", "🎬", "👏"],
  ],
  HARD: [
    ["🏙️", "🌊", "🧪", "🤝", "🌱"],
    ["🚂", "🕰️", "📜", "🧩", "🔑"],
    ["🌋", "🏘️", "📡", "🧑‍🤝‍🧑", "🛟"],
    ["🛰️", "🌍", "📉", "💬", "✨"],
    ["🏛️", "🗣️", "⚖️", "🌉", "🤲"],
  ],
};

const getChildId = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").childId || "local";
  } catch {
    return "local";
  }
};
const getAgeOffset = () => {
  try {
    const age = JSON.parse(localStorage.getItem("user") || "{}").ageGroup || "";
    return age === "8-10" ? 0 : age === "11-13" ? 3 : 6;
  } catch {
    return 3;
  }
};
const challengeHistory = (gameId, level) => {
  try {
    return (
      JSON.parse(localStorage.getItem(`fq-history-${getChildId()}`) || "{}")[
        `${gameId}:${level}`
      ] || []
    );
  } catch {
    return [];
  }
};
const rememberChallenge = (gameId, level, id) => {
  const key = `fq-history-${getChildId()}`;
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(key) || "{}");
  } catch { /* Invalid local history is ignored; the next save starts a fresh history. */ }
  const slot = `${gameId}:${level}`;
  all[slot] = [id, ...(all[slot] || [])].slice(0, 30);
  localStorage.setItem(key, JSON.stringify(all));
};

export function Games({ onBack, initialSelection }) {
  const [attempt, setAttempt] = useState(0);
  const [game, setGame] = useState(
    () =>
      CORE_GAMES.find((item) => item.id === initialSelection?.gameId) || null,
  );
  const [level, setLevel] = useState(null);
  const [worldId, setWorldId] = useState(initialSelection?.worldId || "all");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [game, level, worldId]);
  const world = WORLDS.find((item) => item.id === worldId);
  const games = world
    ? world.games.map((id) => CORE_GAMES.find((item) => item.id === id))
    : CORE_GAMES;
  if (game && level)
    return (
      <GameRouter
        key={`${game.id}-${level}-${attempt}`}
        game={{ ...game, onReplay: () => setAttempt((value) => value + 1), onChooseAnother: () => { setLevel(null); setGame(null); } }}
        level={level}
        onBack={() => setLevel(null)}
        onDone={() => setLevel(null)}
      />
    );
  if (game)
    return (
      <LevelPicker game={game} onBack={() => setGame(null)} onPick={setLevel} />
    );
  return (
    <main className="game-library animate-fade-in">
      <div className="library-topline">
        <Brand />
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> My adventure
        </button>
      </div>
      <header className="library-heading">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS WITH CURIOSITY</p>
          <h1>{world ? world.name : "Choose your next what-if."}</h1>
          <p>
            {world
              ? world.description
              : "24 activities. Nine worlds. Every difficulty open from the start."}
          </p>
        </div>
        <QuestyMascot className="gate-questy" expression="curious" />
      </header>
      <nav className="world-filter" aria-label="Filter games by world">
        <button aria-pressed={!world} onClick={() => setWorldId("all")}>
          All adventures
        </button>
        {WORLDS.map((item) => (
          <button
            key={item.id}
            aria-pressed={worldId === item.id}
            onClick={() => setWorldId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="catalog-game-grid">
        {games.map((item) => (
          <article className="catalog-game-card" key={item.id}>
            <GameArtwork game={item} />
            <div>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <button
                className="btn btn-secondary"
                onClick={() => setGame(item)}
              >
                Choose difficulty <ArrowRight size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
function LevelPicker({ game, onBack, onPick }) {
  return (
    <main className="level-picker animate-fade-in">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to games
      </button>
      <div className="level-picker__intro">
        <div>
          <p className="eyebrow">MAKE THIS ADVENTURE YOUR OWN</p>
          <h1>{game.name}</h1>
          <p>{game.desc}</p>
        </div>
        <GameArtwork game={game} />
      </div>
      <div className="game-questy-tip">
        <QuestyMascot
          className="game-questy__mascot"
          expression="encouraging"
        />
        <span>
          Pick any level. You can always try another. No unlocking required.
        </span>
      </div>
      <div className="difficulty-grid">
        {LEVELS.map((item, index) => (
          <button
            className="difficulty-card"
            key={item}
            onClick={() => onPick(item)}
            style={{
              "--difficulty-color": [
                "#5e986c",
                "#bf9a42",
                "#bb7a43",
                "#9560ac",
              ][index],
            }}
          >
            <span>
              <strong>{item[0] + item.slice(1).toLowerCase()}</strong>
              <small>
                {
                  [
                    "A gentle place to begin",
                    "Try a little more",
                    "Stretch your thinking",
                    "Curious about a challenge?",
                  ][index]
                }
              </small>
              <span className="difficulty-dots" aria-hidden="true">
                {LEVELS.map((_, dot) => (
                  <i key={dot} className={dot <= index ? "on" : ""} />
                ))}
              </span>
            </span>
            <ArrowRight size={20} />
          </button>
        ))}
      </div>
    </main>
  );
}
function useSession(game, level) {
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const saving = useRef(false);
  const started = useMemo(() => Date.now(), []);
  const [done, setDone] = useState(null);
  const finish = async (details = {}) => {
    if (saving.current) return;
    saving.current = true;
    const payload = {
      sessionId,
      gameId: game.id,
      gameName: game.name,
      gameCategory: CATEGORY_NAMES[game.category],
      level,
      startedAt: new Date(started).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Math.round((Date.now() - started) / 1000),
      completed: true,
      ...details,
    };
    try {
      const result = await api.post("/child/games/level-complete", payload);
      setDone(result.data || { saveFailed: true });
    } catch {
      setDone({ saveFailed: true });
    }
  };
  return { done, finish };
}
function GameRouter({ game, level, onBack, onDone }) {
  const props = { game, level, onBack, onDone };
  if (["interest_battle", "curiosity_trail"].includes(game.id))
    return <InterestDiscoveryGame {...props} />;
  if (game.id === "code_robot") return <RobotGame {...props} />;
  if (game.id === "puzzle_lab") return <PuzzleGame {...props} />;
  if (game.id === "spell_quest") return <SpellingGame {...props} />;
  if (game.id === "speaking_games") return <SpeakingGame {...props} />;
  if (game.id === "story_builder") return <StoryGame {...props} />;
  if (game.id === "dream_designer") return <DesignerGame {...props} />;
  if (game.id === "eco_rescue") return <EcoGame {...props} />;
  if (
    [
      "career_role_challenge",
      "build_the_city",
      "science_lab",
      "data_detective",
      "design_an_app",
      "invent_something",
      "team_leader",
      "money_manager",
    ].includes(game.id)
  )
    return <CareerDiscoveryGame {...props} />;
  if (
    [
      "photo_mission",
      "fashion_studio",
      "directors_cut",
      "music_maker",
      "junior_chef",
      "interior_designer",
    ].includes(game.id)
  )
    return <CreativeLifestyleGame {...props} />;
  return <BusinessGame {...props} />;
}
function Shell({ game, level, index, total, children, onBack }) {
  return (
    <main
      className="card animate-fade-in game-shell"
      style={{
        maxWidth: 850,
        margin: "24px auto",
        padding: 28,
        borderTop: `6px solid ${game.color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Exit
        </button>
        <strong>
          {game.icon} {game.name} · {level}
        </strong>
        <span>
          {index + 1}/{total}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--color-border)",
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((index + 1) / total) * 100}%`,
            background: game.color,
            borderRadius: 4,
          }}
        />
      </div>
      <div className="game-questy-tip game-questy-tip--compact">
        <QuestyMascot className="game-questy__mascot" />
        <span>Take your time—exploring is the adventure.</span>
      </div>
      {children}
    </main>
  );
}
function Results({ game, level, done, onDone, replay }) {
  return (
    <GameCelebration
      game={game}
      level={level}
      result={done}
      onBack={onDone}
      replay={replay}
    />
  );
}

function RobotGame({ game, level, onBack, onDone }) {
  const total = LEVEL_SIZE[level];
  const timers = useRef([]);
  const cancel = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => cancel(), []);
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [commands, setCommands] = useState([]);
  const [retry, setRetry] = useState(0);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const layouts = {
    EASY: { size: 4, goal: { r: 0, c: 3 }, blocks: [] },
    MODERATE: {
      size: 4,
      goal: { r: 3, c: 3 },
      blocks: [
        { r: 1, c: 1 },
        { r: 2, c: 1 },
      ],
    },
    MEDIUM: {
      size: 5,
      goal: { r: 4, c: 4 },
      blocks: [
        { r: 0, c: 2 },
        { r: 1, c: 2 },
        { r: 3, c: 3 },
        { r: 3, c: 4 },
      ],
    },
    HARD: {
      size: 6,
      goal: { r: 5, c: 5 },
      blocks: [
        { r: 0, c: 2 },
        { r: 1, c: 2 },
        { r: 2, c: 2 },
        { r: 4, c: 3 },
        { r: 4, c: 4 },
        { r: 2, c: 4 },
      ],
    },
  };
  const deck = useMemo(() => {
    const base = layouts[level];
    const candidates = [];
    for (let r = 0; r < base.size; r++) for (let c = 0; c < base.size; c++) {
      if (r + c < base.size - 1 + (level === "HARD" ? 2 : 0)) continue;
      const blocked = new Set(base.blocks.map(p => p.r * base.size + p.c));
      const queue = [0], visited = new Set([0]);
      while (queue.length) {
        const cell = queue.shift(), rr = Math.floor(cell / base.size), cc = cell % base.size;
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const nr = rr + dr, nc = cc + dc, next = nr * base.size + nc;
          if (nr >= 0 && nc >= 0 && nr < base.size && nc < base.size && !blocked.has(next) && !visited.has(next)) { visited.add(next); queue.push(next); }
        }
      }
      if (visited.has(r * base.size + c)) candidates.push({ ...base, goal: { r, c } });
    }
    return takeChallenges(game.id, level, candidates, total);
  }, [game.id, level, total]);
  const layout = deck[index];
  const run = () => {
    cancel();
    setRunning(true);
    let current = { ...pos };
    let valid = true;
    commands.forEach((command, step) =>
      timers.current.push(setTimeout(() => {
        const next = {
          r: current.r + (command === "DOWN" ? 1 : command === "UP" ? -1 : 0),
          c:
            current.c + (command === "RIGHT" ? 1 : command === "LEFT" ? -1 : 0),
        };
        if (
          next.r < 0 ||
          next.c < 0 ||
          next.r >= layout.size ||
          next.c >= layout.size ||
          layout.blocks.some(
            (block) => block.r === next.r && block.c === next.c,
          )
        )
          valid = false;
        if (valid) {
          current = next;
          setPos(next);
        }
        if (step === commands.length - 1) {
          setRunning(false);
          if (
            valid &&
            current.r === layout.goal.r &&
            current.c === layout.goal.c
          ) {
            rememberChallenge(
              game.id,
              level,
              `${index}-${layout.size}-${layout.goal.c}`,
            );
            if (index + 1 === total)
              finish({
                commandsUsed: commands.length,
                retries: retry,
                solutionLength: commands.length,
              });
            else {
              setIndex(index + 1);
              setCommands([]);
              setPos({ r: 0, c: 0 });
            }
          } else {
            setRetry(retry + 1);
            setCommands([]);
            setPos({ r: 0, c: 0 });
          }
        }
      }, step * 260)),
    );
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total }} onBack={() => { cancel(); onBack(); }}>
      <h2>Build a route to ⭐</h2>
      <div
        className="robot-grid"
        style={{
          "--grid-size": layout.size,
          display: "grid",
          gridTemplateColumns: `repeat(${layout.size}, 52px)`,
          gap: 5,
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        {Array.from({ length: layout.size * layout.size }, (_, cell) => {
          const spot = {
            r: Math.floor(cell / layout.size),
            c: cell % layout.size,
          };
          const block = layout.blocks.some(
            (item) => item.r === spot.r && item.c === spot.c,
          );
          const robot = pos.r === spot.r && pos.c === spot.c;
          const goal = layout.goal.r === spot.r && layout.goal.c === spot.c;
          return (
            <div
              key={cell}
              style={{
                width: 52,
                height: 52,
                display: "grid",
                placeItems: "center",
                border: "1px solid var(--color-border)",
                background: block ? "#18212f" : "var(--bg-app)",
                fontSize: 25,
              }}
            >
              {robot ? "🤖" : goal ? "⭐" : ""}
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
        Commands: {commands.join(" → ") || "none"} ·{" "}
        {layout.blocks.length
          ? "Avoid the obstacles."
          : "Find the shortest route."}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          ["UP", "⬆️"],
          ["DOWN", "⬇️"],
          ["LEFT", "⬅️"],
          ["RIGHT", "➡️"],
        ].map(([value, label]) => (
          <button
            className="btn btn-secondary"
            disabled={running}
            key={value}
            onClick={() => setCommands([...commands, value])}
          >
            {label}
          </button>
        ))}
        <button
          className="btn btn-primary"
          disabled={running || !commands.length}
          onClick={run}
        >
          <Play size={16} /> Run robot
        </button>
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => {
          cancel();
          setRunning(false);
          setCommands([]);
          setPos({ r: 0, c: 0 });
        }}
        style={{ display: "block", margin: "16px auto" }}
      >
        Reset route
      </button>
    </Shell>
  );
}

function SpellingGame({ game, level, onBack, onDone }) {
  const total = LEVEL_SIZE[level];
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const totals = useRef({ attempts: 0, hints: 0 });
  const deck = useMemo(() => takeChallenges(game.id, level, WORDS[level], total), [game.id, level, total]);
  const word = deck[index];
  const submit = () => {
    const next = attempts + 1;
    totals.current.attempts++;
    setAttempts(next);
    if (answer.trim().toUpperCase() === word) {
      rememberChallenge(game.id, level, word);
      if (index + 1 === total)
        finish({
          wordsAttempted: total,
          wordsCorrect: total,
          attempts: totals.current.attempts,
          hintsUsed: totals.current.hints,
        });
      else {
        setIndex(index + 1);
        setAnswer("");
        setAttempts(0);
        setHints(0);
      }
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <h2>🔤 Spell this word</h2>
      <div style={{ display: "flex", gap: 10, margin: "22px 0" }}>
        <button
          className="btn btn-secondary"
          onClick={() =>
            "speechSynthesis" in window &&
            speechSynthesis.speak(new SpeechSynthesisUtterance(word))
          }
        >
          <Volume2 size={17} /> Hear word
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { totals.current.hints++; setHints(hints + 1); }}
        >
          <Lightbulb size={17} /> Hint
        </button>
      </div>
      {hints > 0 && (
        <p style={{ color: game.color }}>
          It starts with <strong>{word[0]}</strong> and has {word.length}{" "}
          letters.
        </p>
      )}
      <input
        aria-label="Your spelling"
        autoFocus
        className="form-input"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && submit()}
        placeholder="Type the word"
      />
      <button
        className="btn btn-primary"
        onClick={submit}
        style={{ marginTop: 16 }}
      >
        Check spelling
      </button>
      {attempts > 0 && (
        <p style={{ marginTop: 14, color: "var(--text-secondary)" }}>
          One more try. Take your time.
        </p>
      )}
    </Shell>
  );
}

function SpeakingGame({ game, level, onBack, onDone }) {
  const total = 3;
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const prompts = useMemo(() => takeChallenges(game.id, level, SPEAKING[level], total), [game.id, level]);
  const prompt = prompts[index];
  const record = () => {
    setRecording(true);
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setRecording(false);
      return;
    }
    const recognition = new Recognition();
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    try {
      recognition.start();
    } catch {
      setRecording(false);
    }
  };
  const next = () => {
    if (!transcript.trim()) return;
    rememberChallenge(game.id, level, `${index}-${prompt}`);
    if (index + 1 === total)
      finish({
        participation: true,
        transcriptAnalysis: {
          wordCount: transcript.trim().split(/\s+/).length,
          sentenceCount: (transcript.match(/[.!?]/g) || []).length,
          relevance: "prompt-linked",
        },
      });
    else {
      setIndex(index + 1);
      setTranscript("");
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <h2>{prompt}</h2>
      <p style={{ color: "var(--text-secondary)", margin: "12px 0" }}>
        There is no accent score. Questy looks at participation, relevance, and
        how completely you explain an idea.
      </p>
      <button className="btn btn-primary" onClick={record} disabled={recording}>
        <Mic size={18} /> {recording ? "Listening..." : "Tell Questy"}
      </button>
      <label
        className="form-label"
        htmlFor="spoken-response"
        style={{ marginTop: 20 }}
      >
        Your words (you can also type)
      </label>
      <textarea
        id="spoken-response"
        className="form-input"
        rows={4}
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder="Speak if your browser supports it, or type your idea here."
      />
      <p className="fine-print">
        Microphone access depends on your browser and permission. No voice
        recording is required to continue.
      </p>
      <button
        className="btn btn-secondary"
        disabled={!transcript.trim()}
        onClick={next}
      >
        Continue
      </button>
    </Shell>
  );
}

function StoryGame({ game, level, onBack, onDone }) {
  const total = 3;
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [story, setStory] = useState("");
  const sequences = useMemo(() => takeChallenges(game.id, level, STORIES[level], total), [game.id, level]);
  const sequence = sequences[index];
  const next = () => {
    if (!story.trim()) return;
    rememberChallenge(game.id, level, `${index}-${sequence.join("")}`);
    if (index + 1 === total)
      finish({
        storyLength: story.trim().split(/\s+/).length,
        completeness:
          story.trim().split(/\s+/).length >= (level === "HARD" ? 45 : 15),
        mode: "typed",
      });
    else {
      setIndex(index + 1);
      setStory("");
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <h2>Build a story from these scenes</h2>
      <div
        className="story-scenes"
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          fontSize: 42,
          margin: "22px 0",
        }}
      >
        {sequence.map((item, itemIndex) => (
          <React.Fragment key={itemIndex}>
            <span>{item}</span>
            {itemIndex < sequence.length - 1 && (
              <span style={{ fontSize: 24 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <textarea
        aria-label="Your story"
        className="form-input"
        rows="7"
        value={story}
        onChange={(event) => setStory(event.target.value)}
        placeholder="What happened first, next, and last? Add your own details."
      />
      <button
        className="btn btn-primary"
        onClick={next}
        style={{ marginTop: 16 }}
      >
        Save this story
      </button>
    </Shell>
  );
}

function DesignerGame({ game, level, onBack, onDone }) {
  const total = 4;
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const missions = useMemo(() => takeChallenges(game.id, level, ["reading", "making", "relaxing", "sharing", "music", "nature", "quiet study", "storytelling", "team projects", "drawing", "recycling", "space exploration"], 1), [game.id, level]);
  const palettes = {
    EASY: [["Ocean blue", "Sunset coral", "Forest green"], ["Reading nook", "Maker desk", "Plant wall"], ["Stars", "Leaves", "Geometric shapes"], ["Soft light", "Bright light", "Color-changing light"]],
    MODERATE: [["Calm study colors", "Warm reading colors", "High contrast labels"], ["Desk beside the window", "Reading corner away from noise", "Shared work table"], ["Clear shelf labels", "Large simple shapes", "Low-distraction wall"], ["Shaded task lamp", "Indirect daylight", "Adjustable reading light"]],
    MEDIUM: [["Fold-away desk", "Stackable seats", "Wall-mounted storage"], ["Clear wheelchair route", "Open door space", "Separate quiet corner"], ["Reusable fabric panels", "Repairable wood shelves", "Recycled storage boxes"], ["Two-purpose activity zone", "Flexible group space", "Quiet individual space"]],
    HARD: [["LED desk lamp - Rs 100", "Adjustable lamp - Rs 200", "Dimmable lamp - Rs 300"], ["Reused desk - Rs 100", "Fold-away desk - Rs 200", "Height-adjustable desk - Rs 300"], ["Reused shelf - Rs 100", "Wall storage - Rs 200", "Modular storage - Rs 300"], ["Repair cushions - Rs 100", "Quiet panels - Rs 200", "Flexible dividers - Rs 300"]],
  };
  const options = palettes[level];
  const spent = choices.reduce((sum, choice) => sum + Number(choice.match(/(\d+)/)?.[1] || 0), 0);
  const choose = (choice) => {
    const next = [...choices, choice];
    rememberChallenge(game.id, level, `${index}-${choice}`);
    if (index + 1 === total)
      finish({
        choicesMade: next,
        edits: next.length,
        creativePreferences: next,
      });
    else {
      setChoices(next);
      setIndex(index + 1);
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <p>Design a space for {missions[0]}. {level === "HARD" ? `Budget Rs 1,000 - Spent Rs ${spent}` : level === "MEDIUM" ? "Balance small space, accessibility and reusable materials." : level === "MODERATE" ? "Reduce distraction and glare while keeping the space useful." : "Explore colors, patterns and light."}</p>
      <div role="group" aria-label="Design preview" style={{ padding: 16, background: "var(--bg-app)" }}>{choices.join(" / ") || "Your design choices will appear here."}</div>
      <h2>{{
        EASY: ["Choose a color mood", "Add a useful space", "Pick a pattern", "Set the lighting"],
        MODERATE: ["Choose a focused palette", "Plan a low-distraction work area", "Organize visual information", "Reduce glare"],
        MEDIUM: ["Save floor space", "Keep the room accessible", "Choose reusable materials", "Support more than one activity"],
        HARD: ["Choose a lamp within budget", "Choose a work surface", "Plan affordable storage", "Improve comfort with the remaining budget"],
      }[level][index]}</h2>
      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {options[index].map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => choose(option)}
            disabled={level === "HARD" && spent + Number(option.match(/(\d+)/)?.[1] || 0) + (3 - index) * 100 > 1000}
            style={{ minHeight: 70, justifyContent: "flex-start" }}
          >
            🎨 {option}
          </button>
        ))}
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 20 }}>
        No answer is right or wrong. Your design choices are the signal.
      </p>
    </Shell>
  );
}

function PuzzleGame({ game, level, onBack, onDone }) {
  const total = LEVEL_SIZE[level];
  const { done, finish } = useSession(game, level);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const bank = useMemo(() => takeChallenges(game.id, level, createPuzzleBank(level, ageBand()), total), [game.id, level, total]);
  const item = bank[index];
  const answer = (option) => {
    const nextCorrect = correct + (option === item.answer ? 1 : 0);
    rememberChallenge(game.id, level, `puzzle-${item.id}`);
    if (index + 1 === total)
      finish({
        accuracy: Math.round((nextCorrect / total) * 100),
        attempts: total,
      });
    else {
      setCorrect(nextCorrect);
      setIndex(index + 1);
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <h2>{item.prompt}</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
        {item.options.map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => answer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Shell>
  );
}

function EcoGame({ game, level, onBack, onDone }) {
  const total = 4;
  const { done, finish } = useSession(game, level);
  const missions = useMemo(() => {
    const easy = [
      ["Banana peel", "Compost"], ["Dry leaves", "Compost"], ["Apple core", "Compost"], ["Vegetable scraps", "Compost"],
      ["Clean metal can", "Recycling"], ["Clean glass jar", "Recycling"], ["Clean aluminium tray", "Recycling"], ["Clean steel lid", "Recycling"],
      ["Broken ceramic cup", "Trash"], ["Coated snack wrapper", "Trash"], ["Used adhesive tape", "Trash"], ["Dirty plastic film", "Trash"],
    ].map(([item, answer]) => [`Town rules: food/leaves go to compost; clean metal/glass are recycled; other items go to trash. Sort: ${item}.`, ["Compost", "Recycling", "Trash"], answer]);
    const moderate = [
      ["A tap drips between classes. What saves water?", ["Report and repair the leak", "Leave it dripping", "Turn on another tap"], "Report and repair the leak"],
      ["Your class can refill drinking water. What cuts packaging?", ["Refillable bottles", "New disposable bottles daily", "Extra wrappers"], "Refillable bottles"],
      ["A room is empty and lights are on. What saves energy?", ["Turn off unused lights", "Add more lamps", "Leave everything on"], "Turn off unused lights"],
      ["A bird is injured. What is a safe first action?", ["Keep distance and call a wildlife helper", "Chase it", "Take it home"], "Keep distance and call a wildlife helper"],
      ["An event has reusable plates. What reduces waste?", ["Wash and reuse plates", "Throw them away", "Buy extra packaging"], "Wash and reuse plates"],
      ["A garden needs watering. Which timing limits evaporation?", ["Early morning", "Hottest midday", "Water the pavement"], "Early morning"],
      ["A useful chair has one loose screw. What keeps materials in use?", ["Ask an adult to repair it", "Throw it away", "Break another chair"], "Ask an adult to repair it"],
      ["A path passes a nesting area. What protects wildlife?", ["Follow the marked path quietly", "Disturb nests", "Feed wildlife sweets"], "Follow the marked path quietly"],
    ];
    const complex = Array.from({ length: 24 }, (_, i) => {
      const supply = 30 + i * 5;
      const reserve = level === "HARD" ? 10 + i : 5;
      const plots = level === "HARD" ? 4 : 2;
      const perPlot = Math.floor((supply - reserve) / plots);
      return [`Eco mission ${i + 1}: ${supply} litres available. Reserve ${reserve} litres for wildlife, then share whole litres equally across ${plots} garden plots. Maximum litres per plot?`, [String(perPlot), String(perPlot + 2), String(perPlot + 5)], String(perPlot)];
    });
    return takeChallenges(game.id, level, level === "EASY" ? easy : level === "MODERATE" ? moderate : complex, total);
  }, [game.id, level]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const choose = (choice) => {
    const next = [...choices, choice];
    rememberChallenge(game.id, level, `${index}-${choice}`);
    if (index + 1 === total)
      finish({
        choicesMade: next,
        decisionsCorrect: next.filter(
          (item, itemIndex) => item === missions[itemIndex][2],
        ).length,
        retries: 0,
      });
    else {
      setChoices(next);
      setIndex(index + 1);
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  const mission = missions[index];
  return (
    <Shell {...{ game, level, index, total, onBack }}>
      <h2>🌍 Mission {index + 1}</h2>
      <h3 style={{ margin: "18px 0" }}>{mission[0]}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {mission[1].map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Shell>
  );
}

function businessOutcome(choices, level) {
  const price = Number((choices[1] || "20").replace(/[^0-9]/g, ""));
  const cost = choices[0]?.includes("Fancy") ? 350 : choices[0]?.includes("Only") ? 50 : 200;
  const visitors = { EASY: 20, MODERATE: 18, MEDIUM: 16, HARD: 14 }[level];
  const demand = price <= 20 ? 1 : price <= 35 ? 0.7 : 0.3;
  const visibility = choices[2] === "Clear and colorful" ? 1 : 0.5;
  const customers = choices[0]?.includes("Only") ? 0 : Math.floor(visitors * demand * visibility);
  return { revenue: customers * price, customers, profit: customers * price - cost, cost, price, simulation: "Deterministic classroom model; not a business forecast" };
}
function BusinessGame({ game, level, onBack, onDone }) {
  const { done, finish } = useSession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const steps = [
    [
      "Choose ingredients",
      ["Fresh lemons and reusable cups", "Fancy imported fruit", "Only ice"],
    ],
    ["Set a price", ["₹20", "₹35", "₹60"]],
    ["Make a poster", ["Clear and colorful", "No details", "Very tiny text"]],
    [
      "Reflect",
      [
        "I would change the price",
        "I would listen to customers",
        "I would stop planning",
      ],
    ],
  ];
  const choose = (choice) => {
    const next = [...choices, choice];
    if (step === steps.length - 1)
      finish({
        choicesMade: next,
        planningDecisions: next,
        ...businessOutcome(next, level),
      });
    else {
      setChoices(next);
      setStep(step + 1);
    }
  };
  if (done)
    return (
      <Results
        game={game}
        level={level}
        done={done}
        onDone={onDone}
        replay={() => game.onReplay?.()}
      />
    );
  const current = steps[step];
  return (
    <Shell {...{ game, level, index: step, total: steps.length, onBack }}>
      <h2>🍋 Lemonade stand · ₹500 budget</h2>
      <p style={{ color: "var(--text-secondary)", margin: "10px 0 20px" }}>
        Potential visitors: {{ EASY: 20, MODERATE: 18, MEDIUM: 16, HARD: 14 }[level]}. Price, ingredients and poster choices change this classroom model, not a real-world forecast.
      </p>
      {step === 3 && <p role="status">Classroom model: {businessOutcome(choices, level).customers} customers - Revenue Rs {businessOutcome(choices, level).revenue} - Profit Rs {businessOutcome(choices, level).profit}. Higher prices reduce demand; clear posters help visitors find the stand.</p>}
      <h3>{current[0]}</h3>
      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        {current[1].map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Shell>
  );
}
