import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, RotateCcw } from "lucide-react";
import api from "../utils/api";
import { ageBand, takeChallenges } from "../utils/challenges";
import { GameCelebration } from "./AdventureVisuals";
import { QuestyMascot } from "./QuestyMascot";

const LEVELS = ["EASY", "MODERATE", "MEDIUM", "HARD"];
const DOMAIN_NAMES = {
  TECHNOLOGY_LOGIC: "Technology & Logic",
  ENGINEERING_MAKING: "Engineering & Making",
  SCIENCE_RESEARCH: "Science & Research",
  CREATIVITY_DESIGN: "Creativity & Design",
  COMMUNICATION_MEDIA: "Communication & Media",
  SOCIAL_HELPING: "Social & Helping",
  BUSINESS_LEADERSHIP: "Business & Leadership",
  NATURE_ENVIRONMENT: "Nature & Environment",
  ALL_DOMAINS: "Cross-domain Exploration",
};
const TASKS = {
  career_role_challenge: {
    career_role_challenge: [
      "Design a bridge that connects two parks.",
      "Explain a science idea to Questy.",
      "Plan how to spend a school budget.",
      "Create a poster for a community event.",
    ],
  },
  build_the_city: {
    build_the_city: [
      "Plan a safe neighborhood.",
      "Connect homes to a school and hospital.",
      "Add services while protecting green space.",
      "Balance a growing city with limited land.",
    ],
  },
  science_lab: {
    science_lab: [
      "Test which surface lets a toy car travel farthest.",
      "Predict which soil helps a seed sprout.",
      "Explore how magnets affect different objects.",
      "Investigate how light changes a shadow.",
    ],
  },
  data_detective: {
    data_detective: [
      "Which product became more popular?",
      "Which month changed most?",
      "Which pattern would you investigate?",
      "What evidence supports your conclusion?",
    ],
  },
  design_an_app: {
    design_an_app: [
      "Help students remember homework.",
      "Make the main screen easy to scan.",
      "Improve a screen users find confusing.",
      "Design a flow for two different users.",
    ],
  },
  invent_something: {
    invent_something: [
      "Students forget their water bottles.",
      "The classroom loses small supplies.",
      "A park needs less waste.",
      "An elderly neighbor needs help carrying books.",
    ],
  },
  team_leader: {
    team_leader: [
      "Your team has four people and three tasks.",
      "A teammate needs help before the deadline.",
      "Two useful ideas conflict.",
      "One team member finishes early.",
    ],
  },
  money_manager: {
    money_manager: [
      "Plan a budget for school supplies, savings, fun, and a gift.",
      "Your school bag needs repair.",
      "Prices rise before the event.",
      "Choose a trade-off without losing your main goal.",
    ],
  },
};
const CITY_ITEMS = [
  "House",
  "School",
  "Hospital",
  "Park",
  "Road",
  "Fire station",
];
const APP_OPTIONS = [
  ["Warm colors", "Calm colors", "High contrast"],
  ["Homework", "Calendar", "Messages"],
  ["Bottom navigation", "Large home buttons", "Search first"],
  ["Add a reminder", "Remove a feature", "Ask users to test it"],
];
const TEAM_OPTIONS = [
  ["Planner", "Builder", "Communicator", "Checker"],
  ["Pair them with a helper", "Move the task", "Ask an adult to decide"],
  ["Listen to both ideas", "Choose quickly", "Skip the decision"],
  ["Give them a new task", "Let them teach someone", "End the project"],
];

function childKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.childId || "local";
  } catch {
    return "local";
  }
}
function history(gameId, level) {
  try {
    return (
      JSON.parse(localStorage.getItem(`fq-discovery-${childKey()}`) || "{}")[
        `${gameId}:${level}`
      ] || []
    );
  } catch {
    return [];
  }
}
function remember(gameId, level, id) {
  const key = `fq-discovery-${childKey()}`;
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(key) || "{}");
  } catch { /* Invalid local history is ignored; the next save starts a fresh history. */ }
  const slot = `${gameId}:${level}`;
  all[slot] = [id, ...(all[slot] || [])].slice(0, 30);
  localStorage.setItem(key, JSON.stringify(all));
}

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
      gameCategory: DOMAIN_NAMES[game.category],
      careerDomains: (game.domains || [game.category])
        .map((domain) => DOMAIN_NAMES[domain] || domain)
        .join(","),
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
function Frame({ game, level, step, total, onBack, children }) {
  return (
    <main
      className="card animate-fade-in game-shell"
      style={{
        maxWidth: 860,
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
        }}
      >
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Exit
        </button>
        <strong>
          {game.icon} {game.name} · {level}
        </strong>
        <span>
          {step + 1}/{total}
        </span>
      </div>
      <div
        style={{
          height: 8,
          margin: "22px 0 28px",
          background: "var(--color-border)",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((step + 1) / total) * 100}%`,
            background: game.color,
            borderRadius: 4,
          }}
        />
      </div>
      <div className="game-questy-tip">
        <QuestyMascot className="game-questy__mascot" expression="curious" />
        <span>Take your time. Your approach is part of the adventure.</span>
      </div>
      {children}
    </main>
  );
}
function Complete({ game, level, result, onBack, replay }) {
  return <GameCelebration {...{ game, level, result, onBack, replay }} />;
}
function ChoiceStep({
  game,
  level,
  step,
  total,
  prompt,
  options,
  onChoose,
  onBack,
}) {
  return (
    <Frame {...{ game, level, step, total, onBack }}>
      <h2>{prompt}</h2>
      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {options.map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => onChoose(option)}
            style={{ minHeight: 64, justifyContent: "flex-start" }}
          >
            {option}
          </button>
        ))}
      </div>
    </Frame>
  );
}

function CareerRole({ game, level, onBack, onDone }) {
  const total = 5;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [favorite, setFavorite] = useState("");
  const prompts = TASKS.career_role_challenge.career_role_challenge;
  const options = [
    ["Plan the route", "Build a model", "Decorate it"],
    ["Speak with examples", "Draw a diagram", "Ask a question"],
    ["Save most money", "Support the biggest need", "Try a creative idea"],
    ["Bold headline", "Helpful instructions", "Interesting picture"],
  ];
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );
  if (step === 4)
    return (
      <Frame {...{ game, level, step, total, onBack }}>
        <h2>Which challenge did you enjoy most?</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          There is no right choice. This preference is one signal among many.
        </p>
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          {prompts.map((prompt) => (
            <button
              className="btn btn-secondary"
              key={prompt}
              onClick={() => {
                remember(game.id, level, prompt);
                finish({
                  choicesMade: choices,
                  enjoyedChallenge: prompt,
                  activityCount: total,
                  voluntaryPreference: true,
                });
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </Frame>
    );
  return (
    <ChoiceStep
      game={game}
      level={level}
      step={step}
      total={total}
      prompt={prompts[step]}
      options={options[step]}
      onBack={onBack}
      onChoose={(choice) => {
        setChoices([...choices, choice]);
        setStep(step + 1);
      }}
    />
  );
}

function CityGame({ game, level, onBack }) {
  const required = level === "EASY" ? ["House", "School", "Park"] : level === "MODERATE" ? ["House", "School", "Park", "Road"] : ["House", "School", "Hospital", "Park", "Road"];
  const total = required.length;
  const { result, finish } = useDiscoverySession(game, level);
  const [placed, setPlaced] = useState([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const size = level === "HARD" ? 5 : 4;
  const resources = { EASY: 6, MODERATE: 7, MEDIUM: 9, HARD: 10 }[level];
  const costs = { House: 1, School: 2, Hospital: 3, Park: 1, Road: 1, "Fire station": 3 };
  const spent = placed.reduce((sum, item) => sum + costs[item.item], 0);
  if (result) return <Complete {...{ game, level, result, onBack }} replay={() => game.onReplay?.()} />;
  const place = cell => {
    if (!selected) return;
    const next = placed.filter(item => item.cell !== cell);
    if (selected !== "Remove") next.push({ cell, item: selected });
    if (next.reduce((sum, item) => sum + costs[item.item], 0) > resources) { setMessage("That exceeds your budget. Replace or remove a building first."); return; }
    setPlaced(next); setSelected(""); setMessage("");
  };
  const complete = () => {
    const missing = required.filter(type => !placed.some(item => item.item === type));
    if (missing.length) { setMessage(`Still needed: ${missing.join(", ")}.`); return; }
    const house = placed.find(item => item.item === "House").cell;
    const school = placed.find(item => item.item === "School").cell;
    const allowed = new Set(placed.filter(item => ["House", "School", "Road"].includes(item.item)).map(item => item.cell));
    const visited = new Set([house]), queue = [house];
    while (queue.length) {
      const cell = queue.shift();
      for (const next of [cell - size, cell + size, ...(cell % size ? [cell - 1] : []), ...(cell % size < size - 1 ? [cell + 1] : [])])
        if (allowed.has(next) && !visited.has(next)) { visited.add(next); queue.push(next); }
    }
    if (!visited.has(school)) { setMessage("Connect the house to the school using touching cells and roads."); return; }
    finish({ planningChoices: placed, choicesMade: placed, resourcesUsed: spent, resourceLimit: resources, constraintsMet: required, completed: true });
  };
  return <Frame {...{ game, level, step: Math.min(placed.length, total - 1), total, onBack }}>
    <h2>Build a neighborhood people can reach easily</h2>
    <p>Mission: {required.join(", ")}. Connect House to School through touching cells or roads.</p>
    <p>Budget {resources} - Used {spent} - Remaining {resources - spent}. Costs: House 1, School 2, Hospital 3, Park/Road 1, Fire station 3.</p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}>{[...CITY_ITEMS, "Remove"].map(item => <button className={`btn ${selected === item ? "btn-primary" : "btn-secondary"}`} key={item} onClick={() => setSelected(item)}>{item}</button>)}</div>
    <div className="city-grid" style={{ "--grid-size": size, display: "grid", gridTemplateColumns: `repeat(${size}, 62px)`, gap: 5, justifyContent: "center" }}>
      {Array.from({ length: size * size }, (_, cell) => <button type="button" aria-label={`City cell ${cell + 1}`} key={cell} onClick={() => place(cell)} style={{ width: 62, height: 62, background: "var(--bg-app)", border: "1px solid var(--color-border)", fontSize: 12 }}>{placed.find(item => item.cell === cell)?.item || "+"}</button>)}
    </div>
    {message && <p role="alert">{message}</p>}
    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={complete}>Finish neighborhood</button>
    <p>You can replace or remove a piece before finishing. Different layouts can meet the same mission.</p>
  </Frame>;
}

function ScienceLab({ game, level, onBack }) {
  const total = 4;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const variation = useMemo(() => takeChallenges(game.id, level, Array.from({ length: 12 }, (_, i) => i), 1)[0], [game.id, level]);
  const config = {
    EASY: { title: "Test how surfaces change a toy car's travel", options: ["Wood", "Metal", "Fabric"], values: [60, 90, 25], unit: "cm travelled", control: "same car and release height" },
    MODERATE: { title: "Compare seed growth in different soils", options: ["Sandy soil", "Clay soil", "Compost soil"], values: [2, 1, 4], unit: "cm growth", control: "same seed, water, light and seven days" },
    MEDIUM: { title: "Investigate which objects a magnet attracts", options: ["Steel clip", "Aluminium foil", "Wood block"], values: [1, 0, 0], unit: "attraction (1=yes, 0=no)", control: "same magnet and distance" },
    HARD: { title: "Investigate how light distance changes a shadow", options: ["Light 10 cm from object", "Light 20 cm from object", "Light 40 cm from object"], values: [30, 15, 7.5], unit: "cm shadow height", control: "same object and screen, 60 cm from light" },
  }[level];
  const measured = config.values[config.options.indexOf(choices[0])];
  const multiplier = level === "EASY" ? 1 + variation / 20 : 1;
  const measurement = Math.round(measured * multiplier * 10) / 10;
  const prompts = [`${config.title} ? Trial ${variation + 1}. Choose the variable.`, "Make a prediction before running the experiment", "Run a controlled comparison", "Describe the evidence, or ask to investigate again"];
  const options = [config.options, ["The first condition will have the largest result", "The last condition will have the largest result", "I predict the conditions differ"], ["Run once", "Run again to compare"], ["The changed variable affected the result", "The result surprised me", "I need more evidence"]];
  if (result) return <Complete {...{ game, level, result, onBack }} replay={() => game.onReplay?.()} />;
  return <Frame {...{ game, level, step, total, onBack }}>
    <h2>{prompts[step]}</h2>
    <p>Controlled conditions: {config.control}. This is a simplified classroom model.</p>
    {step === 3 && <div role="status" style={{ padding: 16, background: "var(--bg-app)" }}><strong>Observed result: {choices[0]} : {measurement} {config.unit}</strong><p>Compare conditions: {config.options.map((item, i) => `${item}: ${Math.round(config.values[i] * multiplier * 10) / 10}`).join("; ")}. Only the chosen variable changes.</p></div>}
    <div style={{ display: "grid", gap: 12, marginTop: 24 }}>{options[step].map(choice => <button className="btn btn-secondary" key={choice} onClick={() => {
      const next = [...choices, choice];
      if (step === total - 1) finish({ predictions: next[1], observations: next[3], choicesMade: next, experiment: { variable: next[0], measurement, unit: config.unit, control: config.control, trial: variation + 1 }, experimentRetries: next[2] === "Run again to compare" ? 1 : 0 });
      else { setChoices(next); setStep(step + 1); }
    }}>{choice}</button>)}</div>
  </Frame>;
}

function DataDetective({ game, level, onBack }) {
  const total = 4;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const data = useMemo(() => {
    const difficulty = LEVELS.indexOf(level), age = ageBand();
    const bank = Array.from({ length: 24 }, (_, i) => {
      const values = [3 + i + age, 8 + i * 2 + age, 5 + i + difficulty * 3];
      for (let r = 0; r < i % 3; r++) values.push(values.shift());
      const labels = ["A", "B", "C"];
      let prompt, answer, options;
      if (difficulty === 0) {
        prompt = `Community survey ${i + 1}: which group recorded the most items?`;
        answer = labels[values.indexOf(Math.max(...values))]; options = labels;
      } else {
        const sorted = [...values].sort((a, b) => a - b);
        const target = difficulty === 1 ? sorted[2] - sorted[0] : difficulty === 2 ? values.reduce((sum, n) => sum + n, 0) : sorted[2] + sorted[1] - sorted[0];
        prompt = `Survey ${i + 1}: ` + (difficulty === 1 ? "How many more items does the largest group have than the smallest?" : difficulty === 2 ? "How many items did all three groups record together?" : "How many more items did the two largest groups record together than the smallest group?");
        answer = String(target); options = [String(target), String(target + 3), String(target - 2)];
        for (let r = 0; r < i % 3; r++) options.push(options.shift());
      }
      return { labels, values, prompt, options, answer };
    });
    return takeChallenges(game.id, level, bank, total);
  }, [game.id, level]);

  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );

  const item = data[step];
  return (
    <Frame {...{ game, level, step, total, onBack }}>
      <h2>{item.prompt}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: 18,
          height: 170,
          padding: 20,
          background: "var(--bg-app)",
          margin: "20px 0",
        }}
      >
        {item.values.map((value, index) => (
          <div
            key={item.labels[index]}
            style={{ textAlign: "center", flex: 1 }}
          >
            <div
              style={{
                height: (value / Math.max(...item.values)) * 110,
                background: game.color,
                marginBottom: 8,
              }}
            />
            <small>
              {item.labels[index]}
              <br />
              {value}
            </small>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {item.options.map((option) => (
          <button
            className="btn btn-secondary"
            key={option}
            onClick={() => {
              const nextAnswers = [...answers, option];
              const nextCorrectAnswers =
                correctAnswers + (option === item.answer ? 1 : 0);
              remember(game.id, level, `${step}-${option}`);
              if (step === total - 1)
                finish({
                  accuracy: Math.round((nextCorrectAnswers / total) * 100),
                  patternChoices: nextAnswers,
                  attempts: total,
                });
              else {
                setAnswers(nextAnswers);
                setCorrectAnswers(nextCorrectAnswers);
                setStep(step + 1);
              }
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </Frame>
  );
}

function AppDesign({ game, level, onBack }) {
  const total = 4;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <ChoiceStep
      game={game}
      level={level}
      step={step}
      total={total}
      prompt={
        TASKS.design_an_app.design_an_app[Math.min(LEVELS.indexOf(level), 3)]
      }
      options={APP_OPTIONS[step]}
      onBack={onBack}
      onChoose={(choice) => {
        const next = [...choices, choice];
        remember(game.id, level, `${step}-${choice}`);
        if (step === total - 1)
          finish({
            featureChoices: next,
            revisions: next.filter((item) => item === "Ask users to test it")
              .length,
            logicalFlow: next,
          });
        else {
          setChoices(next);
          setStep(step + 1);
        }
      }}
    />
  );
}

function InventGame({ game, level, onBack }) {
  const total = 2;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState("");
  const [choices, setChoices] = useState([]);
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );
  if (step === 0)
    return (
      <Frame {...{ game, level, step, total, onBack }}>
        <h2>
          {
            TASKS.invent_something.invent_something[
              Math.min(LEVELS.indexOf(level), 3)
            ]
          }
        </h2>
        <p>What might you invent? There is no single correct solution.</p>
        <textarea
          aria-label="Your invention"
          className="form-input"
          rows="6"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Name it and describe how it helps..."
        />
        <button
          className="btn btn-primary"
          disabled={!idea.trim()}
          onClick={() => setStep(1)}
          style={{ marginTop: 16 }}
        >
          Develop the idea
        </button>
      </Frame>
    );
  return (
    <ChoiceStep
      game={game}
      level={level}
      step={step}
      total={total}
      prompt="How would you improve your first idea?"
      options={[
        "Make it easier to use",
        "Make it stronger",
        "Ask someone to test it",
      ]}
      onBack={onBack}
      onChoose={(choice) => {
        const next = [...choices, choice];
        remember(game.id, level, `${idea}-${choice}`);
        finish({
          invention: idea,
          iteration: choice,
          originalitySignal: idea.trim().split(/\s+/).length,
          practicalThinking: next,
        });
      }}
    />
  );
}

function TeamLeader({ game, level, onBack }) {
  const total = 4;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );
  return (
    <ChoiceStep
      game={game}
      level={level}
      step={step}
      total={total}
      prompt={TASKS.team_leader.team_leader[Math.min(LEVELS.indexOf(level), 3)]}
      options={TEAM_OPTIONS[step]}
      onBack={onBack}
      onChoose={(choice) => {
        const next = [...choices, choice];
        remember(game.id, level, `${step}-${choice}`);
        if (step === total - 1)
          finish({
            delegation: next[0],
            empathy: next[1],
            conflictResolution: next[2],
            planning: next[3],
            choicesMade: next,
          });
        else {
          setChoices(next);
          setStep(step + 1);
        }
      }}
    />
  );
}

function MoneyManager({ game, level, onBack }) {
  const total = 3;
  const { result, finish } = useDiscoverySession(game, level);
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState({
    supplies: 400,
    savings: 250,
    fun: 200,
    gift: 150,
  });
  const [choices, setChoices] = useState([]);
  const totalBudget = Object.values(budget).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
      />
    );
  if (step === 0)
    return (
      <Frame {...{ game, level, step, total, onBack }}>
        <h2>Allocate your ₹1,000 budget</h2>
        <p>Move each amount. The total must equal ₹1,000.</p>
        {Object.entries(budget).map(([key, value]) => (
          <label className="form-group" key={key}>
            {key}: ₹{value}
            <input
              type="range"
              min="0"
              max="700"
              step="50"
              value={value}
              onChange={(event) =>
                setBudget({ ...budget, [key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
        <strong>Total: ₹{totalBudget}</strong>
        <br />
        <button
          className="btn btn-primary"
          disabled={totalBudget !== 1000}
          onClick={() => setStep(1)}
          style={{ marginTop: 16 }}
        >
          Set the plan
        </button>
      </Frame>
    );
  const options =
    step === 1
      ? [
          "Repair the bag and reduce entertainment",
          "Use savings first",
          "Skip school supplies",
        ]
      : [
          "Protect the main goal",
          "Change the plan and explain why",
          "Spend without checking",
        ];
  return (
    <ChoiceStep
      game={game}
      level={level}
      step={step}
      total={total}
      prompt={
        step === 1
          ? "A school bag needs repair. What do you adjust?"
          : "A price rises unexpectedly. What do you do?"
      }
      options={options}
      onBack={onBack}
      onChoose={(choice) => {
        const next = [...choices, choice];
        remember(game.id, level, `${step}-${choice}`);
        if (step === total - 1)
          finish({
            allocation: budget,
            adaptationChoices: next,
            prioritization: next,
          });
        else {
          setChoices(next);
          setStep(step + 1);
        }
      }}
    />
  );
}

export function CareerDiscoveryGame({ game, level, onBack }) {
  const props = { game, level, onBack };
  if (game.id === "career_role_challenge") return <CareerRole {...props} />;
  if (game.id === "build_the_city") return <CityGame {...props} />;
  if (game.id === "science_lab") return <ScienceLab {...props} />;
  if (game.id === "data_detective") return <DataDetective {...props} />;
  if (game.id === "design_an_app") return <AppDesign {...props} />;
  if (game.id === "invent_something") return <InventGame {...props} />;
  if (game.id === "team_leader") return <TeamLeader {...props} />;
  return <MoneyManager {...props} />;
}
