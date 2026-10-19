import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import api from "../utils/api";
import { GameCelebration } from "./AdventureVisuals";
import { QuestyMascot } from "./QuestyMascot";

const DOMAINS = {
  CREATIVITY_DESIGN: "Creativity & Design",
  TECHNOLOGY_LOGIC: "Technology & Logic",
  SCIENCE_RESEARCH: "Science & Research",
  BUSINESS_LEADERSHIP: "Business & Leadership",
  COMMUNICATION_MEDIA: "Communication & Media",
  NATURE_ENVIRONMENT: "Nature & Environment",
  ENGINEERING_MAKING: "Engineering & Making",
  SOCIAL_HELPING: "Social & Helping",
};

const BATTLES = [
  {
    left: { label: "Design a poster", icon: "🎨", domain: "CREATIVITY_DESIGN" },
    right: {
      label: "Solve a robot path",
      icon: "🤖",
      domain: "TECHNOLOGY_LOGIC",
    },
    task: "What would you try first?",
    options: ["Pick colors and shapes", "Plan the robot steps"],
  },
  {
    left: {
      label: "Take a photo challenge",
      icon: "📸",
      domain: "CREATIVITY_DESIGN",
    },
    right: { label: "Analyze a chart", icon: "📊", domain: "SCIENCE_RESEARCH" },
    task: "Which tiny mission sounds fun?",
    options: ["Frame the perfect picture", "Find the pattern in the data"],
  },
  {
    left: { label: "Tell a story", icon: "🎤", domain: "COMMUNICATION_MEDIA" },
    right: { label: "Fix a machine", icon: "⚙️", domain: "ENGINEERING_MAKING" },
    task: "Choose your next mini-mission.",
    options: ["Create an exciting story", "Find what will make it work"],
  },
  {
    left: {
      label: "Save an ecosystem",
      icon: "🌱",
      domain: "NATURE_ENVIRONMENT",
    },
    right: {
      label: "Run a mini business",
      icon: "💼",
      domain: "BUSINESS_LEADERSHIP",
    },
    task: "Which challenge calls you?",
    options: ["Help plants and animals", "Plan products and prices"],
  },
];

const TRAIL_PATHS = [
  {
    label: "Build Something",
    icon: "🔨",
    domain: "ENGINEERING_MAKING",
    games: "Code the Robot or Build the City",
  },
  {
    label: "Create Something",
    icon: "🎨",
    domain: "CREATIVITY_DESIGN",
    games: "Dream Designer or Design an App",
  },
  {
    label: "Discover Something",
    icon: "🔍",
    domain: "SCIENCE_RESEARCH",
    games: "Science Lab or Data Detective",
  },
  {
    label: "Tell Something",
    icon: "🎤",
    domain: "COMMUNICATION_MEDIA",
    games: "Speak & Shine or News Reporter",
  },
  {
    label: "Help Someone",
    icon: "❤️",
    domain: "SOCIAL_HELPING",
    games: "Team Leader or Eco Rescue",
  },
  {
    label: "Lead Something",
    icon: "💼",
    domain: "BUSINESS_LEADERSHIP",
    games: "Mini Entrepreneur or Money Manager",
  },
];

function useDiscoverySession(game, level) {
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const saving = useRef(false);
  const started = useMemo(() => Date.now(), []);
  const [result, setResult] = useState(null);
  const finish = async (details) => {
    if (saving.current) return;
    saving.current = true;
    const payload = {
      sessionId,
      gameId: game.id,
      gameName: game.name,
      gameCategory: "Behavioral Discovery",
      careerDomains: game.domains.map((domain) => DOMAINS[domain]).join(","),
      level,
      startedAt: new Date(started).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Math.max(1, Math.round((Date.now() - started) / 1000)),
      completed: true,
      ...details,
    };
    try {
      const response = await api.post("/child/games/level-complete", payload);
      setResult(response.data || { saveFailed: true });
    } catch {
      setResult({ saveFailed: true });
    }
  };
  return { result, finish };
}

function Complete({ game, level, result, onBack }) {
  const [enjoyment, setEnjoyment] = useState("");
  const [status, setStatus] = useState("");
  const saveEnjoyment = async (value) => {
    if (status === "saving" || status === "saved") return;
    setEnjoyment(value);
    setStatus("saving");
    try {
      if (!result.recordId) throw new Error("Missing record");
      await api.post("/feedback", {
        activityType: "game",
        activityId: result.recordId,
        rating:
          value === "Loved it"
            ? 5
            : value === "It was fun"
              ? 4
              : value === "Not sure"
                ? 3
                : 2,
        comment: value,
      });
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  };
  return (
    <GameCelebration {...{ game, level, result, onBack }}>
      <h3>How was that?</h3>
      <div className="enjoyment-grid">
        {["Loved it", "It was fun", "Not sure", "Not for me"].map((value) => (
          <button
            type="button"
            key={value}
            className={
              enjoyment === value ? "btn btn-primary" : "btn btn-secondary"
            }
            onClick={() => saveEnjoyment(value)}
            disabled={status === "saving" || status === "saved"}
          >
            {value}
          </button>
        ))}
      </div>
      {status === "saved" && (
        <p className="feedback-saved" role="status">
          Thanks, your preference was saved.
        </p>
      )}
      {status === "failed" && (
        <p className="auth-error" role="alert">
          Preference not saved. Please try again.
        </p>
      )}
    </GameCelebration>
  );
}
function Battle({ game, level, onBack }) {
  const { result, finish } = useDiscoverySession(game, level);
  const [battleIndex, setBattleIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [activity, setActivity] = useState(null);
  const battle = BATTLES[battleIndex % BATTLES.length];
  if (result) return <Complete {...{ game, level, result, onBack }} />;
  const choose = (option, domain) => setActivity({ option, domain });
  const completeActivity = (answer) => {
    const next = [
      ...choices,
      {
        battle: battleIndex,
        selected: activity.domain,
        activityAnswer: answer,
      },
    ];
    if (battleIndex === BATTLES.length - 1)
      finish({
        choicesMade: next,
        pairwisePreferences: next,
        activityCompleted: true,
        interestSignal: "repeated-choice",
      });
    else {
      setChoices(next);
      setBattleIndex(battleIndex + 1);
      setActivity(null);
    }
  };
  return (
    <main className="card animate-fade-in discovery-panel game-shell">
      <button type="button" className="btn btn-secondary" onClick={onBack}>
        <ArrowLeft size={16} /> Exit
      </button>
      {!activity ? (
        <>
          <p className="eyebrow">
            INTEREST BATTLE {battleIndex + 1} OF {BATTLES.length}
          </p>
          <h1>What would you rather try?</h1>
          <div className="battle-options">
            <button
              type="button"
              onClick={() => choose(battle.left.label, battle.left.domain)}
            >
              <span>{battle.left.icon}</span>
              {battle.left.label}
            </button>
            <strong>OR</strong>
            <button
              type="button"
              onClick={() => choose(battle.right.label, battle.right.domain)}
            >
              <span>{battle.right.icon}</span>
              {battle.right.label}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">TINY MISSION</p>
          <h1>{activity.option}</h1>
          <p>{battle.task}</p>
          <div className="activity-options">
            {(activity.domain === "CREATIVITY_DESIGN"
              ? ["Try a bold color", "Try a calm color", "Mix two ideas"]
              : activity.domain === "TECHNOLOGY_LOGIC"
                ? ["Plan three steps", "Test one step", "Try a shortcut"]
                : ["Observe carefully", "Ask a question", "Make a small plan"]
            ).map((answer) => (
              <button
                type="button"
                className="btn btn-primary"
                key={answer}
                onClick={() => completeActivity(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function Trail({ game, level, onBack }) {
  const { result, finish } = useDiscoverySession(game, level);
  const [selected, setSelected] = useState(null);
  const [paths, setPaths] = useState([]);
  if (result) return <Complete {...{ game, level, result, onBack }} />;
  const choose = (path) => {
    const next = [...paths, path.domain];
    if (selected)
      finish({
        choicesMade: next,
        curiosityPath: next,
        recommendedGames: path.games,
        activityCompleted: true,
      });
    else {
      setPaths(next);
      setSelected(path);
    }
  };
  return (
    <main className="card animate-fade-in discovery-panel game-shell">
      <button type="button" className="btn btn-secondary" onClick={onBack}>
        <ArrowLeft size={16} /> Exit
      </button>
      {!selected ? (
        <>
          <p className="eyebrow">CURIOSITY TRAIL</p>
          <h1>What sounds fun next?</h1>
          <div className="trail-grid">
            {TRAIL_PATHS.map((path) => (
              <button
                type="button"
                key={path.domain}
                onClick={() => choose(path)}
              >
                <span>{path.icon}</span>
                <strong>{path.label}</strong>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">YOUR NEXT CLUE</p>
          <h1>
            {selected.icon} {selected.label}
          </h1>
          <p>
            Try a small step from this path: <strong>{selected.games}</strong>.
          </p>
          <div className="activity-options">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => choose(selected)}
            >
              I explored it
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSelected(null);
                setPaths([]);
              }}
            >
              Choose another path
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export function InterestDiscoveryGame({ game, level, onBack }) {
  return game.id === "interest_battle" ? (
    <Battle {...{ game, level, onBack }} />
  ) : (
    <Trail {...{ game, level, onBack }} />
  );
}
