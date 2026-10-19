import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import api from "../utils/api";
import { GameCelebration } from "./AdventureVisuals";
import { QuestyMascot } from "./QuestyMascot";

const LEVELS = ["EASY", "MODERATE", "MEDIUM", "HARD"];
const DOMAINS = {
  CREATIVE_LIFESTYLE: "Creative & Lifestyle Careers",
  CREATIVITY_DESIGN: "Creativity & Design",
  COMMUNICATION_MEDIA: "Communication & Media",
  ENGINEERING_MAKING: "Engineering & Making",
  BUSINESS_LEADERSHIP: "Business & Leadership",
};
const PHOTO_PROMPTS = {
  EASY: "Choose the composition that shows the whole picnic scene.",
  MODERATE: "Choose the strongest frame for a photo of teamwork.",
  MEDIUM:
    "Build a photo that shows happiness using subject, angle, light, and background.",
  HARD: "Create a visual story: a team solving a problem together.",
};
const FASHION_PROMPTS = {
  EASY: "Choose colors that work together for a school event.",
  MODERATE: "Build a complete outfit for a cultural celebration.",
  MEDIUM: "Design a space-themed costume with a clear theme.",
  HARD: "Create a rainy-day outfit using only practical pieces.",
};
const DIRECTOR_PROMPTS = {
  EASY: "Arrange the opening, discovery, and ending of a mystery box scene.",
  MODERATE: "Choose how the camera introduces a child finding a box.",
  MEDIUM: "Storyboard a short scene with sound and character reaction.",
  HARD: "Direct a mystery scene using one location and three shots.",
};
const CHEF_PROMPTS = {
  EASY: "Choose ingredients for a healthy breakfast.",
  MODERATE: "Put the virtual sandwich steps in a sensible order.",
  MEDIUM: "Plan a balanced picnic menu.",
  HARD: "Plan a meal within ₹300 and a 20-minute virtual time limit.",
};
const INTERIOR_PROMPTS = {
  EASY: "Arrange a calm bedroom.",
  MODERATE: "Design a study room that is easy to use.",
  MEDIUM: "Arrange a small room with limited space.",
  HARD: "Create a useful room while staying under a ₹1,000 design budget.",
};
const PHOTO_OPTIONS = [
  ["Wide view", "Close detail", "Off-center crop"],
  ["Subject centered", "Subject cut off", "Distracting background"],
  ["Eye-level", "Low angle", "Top-down"],
  ["Soft morning light", "Harsh backlight", "Busy background"],
];
const FASHION_OPTIONS = [
  ["Blue and white", "Red and green", "All neon"],
  ["Top", "Bottom", "Accessory"],
  ["Space helmet", "Rain jacket", "Party hat"],
  ["Waterproof layer", "Open sandals", "Long trailing scarf"],
];
const DIRECTOR_OPTIONS = [
  ["Opening shot", "Discovery shot", "Closing shot"],
  ["Wide establishing shot", "Close reaction shot", "Camera pointed away"],
  ["Curious reaction", "Surprised reaction", "No reaction"],
  ["Soft mystery music", "Loud unrelated music", "No sound"],
];
const CHEF_OPTIONS = [
  ["Fruit", "Whole grain", "Yogurt", "Water"],
  ["Spread", "Filling", "Close sandwich", "Choose bread"],
  ["Fruit salad", "Vegetable wrap", "Water"],
  ["Affordable ingredients", "Extra decorations", "Skip the meal"],
];
const ROOM_ITEMS = ["Bed", "Desk", "Chair", "Lamp", "Storage", "Plant"];

function childKey() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").childId || "local";
  } catch {
    return "local";
  }
}
function remember(gameId, level, value) {
  const key = `fq-creative-${childKey()}`;
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(key) || "{}");
  } catch { /* Invalid local history is ignored; the next save starts a fresh history. */ }
  const slot = `${gameId}:${level}`;
  all[slot] = [value, ...(all[slot] || [])].slice(0, 30);
  localStorage.setItem(key, JSON.stringify(all));
}
function useCreativeSession(game, level) {
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
      gameCategory: DOMAINS[game.category],
      careerDomains: (game.domains || [game.category])
        .map((item) => DOMAINS[item] || item)
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
        <button type="button" className="btn btn-secondary" onClick={onBack}>
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
        <span>Try your idea. There?s room for your own style.</span>
      </div>
      {children}
    </main>
  );
}
function Complete({ game, level, result, onBack, replay }) {
  const [enjoyment, setEnjoyment] = useState("");
  const [status, setStatus] = useState("");
  const sendEnjoyment = async (value) => {
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
    <GameCelebration {...{ game, level, result, onBack, replay }}>
      <h3>How did it feel?</h3>
      <div className="enjoyment-grid">
        {["Loved it", "It was fun", "Not sure", "Not for me"].map((value) => (
          <button
            type="button"
            key={value}
            className={
              enjoyment === value ? "btn btn-primary" : "btn btn-secondary"
            }
            onClick={() => sendEnjoyment(value)}
            disabled={status === "saving" || status === "saved"}
          >
            {value}
          </button>
        ))}
      </div>
      {status === "saved" && (
        <p className="feedback-saved" role="status">
          Thanks. Your preference was saved.
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
function ChoiceFlow({ game, level, onBack, prompts, options, finishDetails }) {
  const total = options.length;
  const { result, finish } = useCreativeSession(game, level);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
        signals={finishDetails(choices)}
      />
    );
  const choose = (value) => {
    const next = [...choices, value];
    remember(game.id, level, `${step}-${value}`);
    if (step === total - 1) finish(finishDetails(next));
    else {
      setChoices(next);
      setStep(step + 1);
    }
  };
  return (
    <Frame {...{ game, level, step, total, onBack }}>
      <h2>{prompts[step]}</h2>
      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {options[step].map((value) => (
          <button
            type="button"
            className="btn btn-secondary"
            key={value}
            onClick={() => choose(value)}
            style={{ minHeight: 64, justifyContent: "flex-start" }}
          >
            {value}
          </button>
        ))}
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 18 }}>
        Try a different choice on replay. There is room for your own style.
      </p>
    </Frame>
  );
}
function PhotoMission({ game, level, onBack }) {
  return (
    <ChoiceFlow
      game={game}
      level={level}
      onBack={onBack}
      prompts={[
        PHOTO_PROMPTS[level],
        "Pick the subject that should lead the eye.",
        "Choose an angle.",
        "Choose the light and background.",
      ]}
      options={PHOTO_OPTIONS}
      finishDetails={(choices) => ({
        compositionChoices: choices,
        visualPreference: choices,
        observation: choices.length,
      })}
    />
  );
}
function FashionStudio({ game, level, onBack }) {
  return (
    <ChoiceFlow
      game={game}
      level={level}
      onBack={onBack}
      prompts={[
        FASHION_PROMPTS[level],
        "Choose the main clothing piece.",
        "Add a theme detail.",
        "Check the design against the brief.",
      ]}
      options={FASHION_OPTIONS}
      finishDetails={(choices) => ({
        styleChoices: choices,
        revisions: choices.length,
        themeConsistency: choices.filter(Boolean).length,
      })}
    />
  );
}
function DirectorsCut({ game, level, onBack }) {
  return (
    <ChoiceFlow
      game={game}
      level={level}
      onBack={onBack}
      prompts={[
        DIRECTOR_PROMPTS[level],
        "Choose the camera plan.",
        "Choose the character reaction.",
        "Choose the sound direction.",
      ]}
      options={DIRECTOR_OPTIONS}
      finishDetails={(choices) => ({
        narrativeChoices: choices,
        sequencing: choices,
        experimentation: choices.length,
      })}
    />
  );
}
function MusicMaker({ game, level, onBack }) {
  const total = level === "EASY" ? 3 : level === "MODERATE" ? 4 : 5;
  const { result, finish } = useCreativeSession(game, level);
  const [step, setStep] = useState(0);
  const [pattern, setPattern] = useState([]);
  const [instrument, setInstrument] = useState("");
  const audio = useRef(null);
  const audioTimers = useRef([]);
  const [audioError, setAudioError] = useState("");
  useEffect(() => () => { audioTimers.current.forEach(clearTimeout); if (audio.current && audio.current.state !== "closed") audio.current.close().catch(() => {}); }, []);
  const playBeat = (beat) => {
    if (beat === "Rest") return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error("unavailable");
      audio.current ||= new Audio();
      audio.current.resume().catch(() => setAudioError("Audio is blocked. Check browser sound permission; you can still create a pattern."));
      const oscillator = audio.current.createOscillator(), gain = audio.current.createGain();
      oscillator.type = instrument === "Drums" ? "triangle" : "sine";
      oscillator.frequency.value = { Kick: 110, Clap: 220, Bell: 660 }[beat] * ({ Drums: 1, Piano: 2, Guitar: 1.5, Marimba: 2.5 }[instrument] || 1);
      gain.gain.setValueAtTime(0.12, audio.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.current.currentTime + 0.18);
      oscillator.connect(gain); gain.connect(audio.current.destination);
      oscillator.start(); oscillator.stop(audio.current.currentTime + 0.2);
      setAudioError("");
    } catch { setAudioError("Sound is unavailable here. The pattern remains editable and can be saved."); }
  };
  const beats = ["Kick", "Clap", "Rest", "Bell"];
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
        signals={{ createdPattern: pattern, experimentation: pattern.length }}
      />
    );
  const toggle = (beat) => {
    playBeat(beat);
    const next = [...pattern, beat];
    setPattern(next);
    if (next.length >= total) {
      remember(game.id, level, `${level}-${next.join("-")}`);
      finish({
        createdPattern: next,
        instrument,
        beatsAdded: next.length,
        experimentRetries: step,
      });
    }
  };
  return (
    <Frame {...{ game, level, step, total, onBack }}>
      <h2>Build a rhythm one beat at a time</h2>
      <p>
        Instrument: {instrument || "choose one"} · Pattern:{" "}
        {pattern.join(" · ") || "empty"}
      </p>
      {audioError && <p role="status">{audioError}</p>}
      {!instrument ? (
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}
        >
          {["Drums", "Piano", "Guitar", "Marimba"].map((value) => (
            <button
              type="button"
              className="btn btn-secondary"
              key={value}
              onClick={() => setInstrument(value)}
            >
              {value}
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginTop: 24,
          }}
        >
          {beats.map((beat) => (
            <button
              type="button"
              className="btn btn-secondary"
              key={beat}
              onClick={() => toggle(beat)}
            >
              {beat}
            </button>
          ))}
        </div>
      )}
      {instrument && pattern.length > 0 && <div className="button-row" style={{ marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={() => { audioTimers.current.forEach(clearTimeout); audioTimers.current = pattern.map((beat, i) => setTimeout(() => playBeat(beat), i * 240)); }}>Play pattern</button>
        <button className="btn btn-secondary" onClick={() => setPattern(pattern.slice(0, -1))}>Undo last beat</button>
      </div>}
    </Frame>
  );
}
function JuniorChef({ game, level, onBack }) {
  return (
    <ChoiceFlow
      game={game}
      level={level}
      onBack={onBack}
      prompts={[
        CHEF_PROMPTS[level],
        "Choose the next virtual step.",
        "Choose the menu focus.",
        "Choose the planning trade-off.",
      ]}
      options={CHEF_OPTIONS}
      finishDetails={(choices) => ({
        ingredientChoices: choices,
        sequenceChoices: choices,
        planningChoices: choices,
        virtualOnly: true,
      })}
    />
  );
}
function InteriorDesigner({ game, level, onBack }) {
  const total = level === "EASY" ? 3 : level === "MODERATE" ? 4 : 5;
  const { result, finish } = useCreativeSession(game, level);
  const [placed, setPlaced] = useState([]);
  const [selected, setSelected] = useState("");
  const size = level === "HARD" ? 5 : 4;
  if (result)
    return (
      <Complete
        {...{ game, level, result, onBack }}
        replay={() => game.onReplay?.()}
        signals={{ layoutChanges: placed.length, layout: placed }}
      />
    );
  const place = (cell) => {
    if (!selected || placed.some((item) => item.cell === cell)) return;
    const next = [...placed, { cell, item: selected }];
    setPlaced(next);
    setSelected("");
    if (next.length >= total) {
      remember(
        game.id,
        level,
        `${level}-${next.map((item) => item.item).join("-")}`,
      );
      finish({
        layoutChanges: next.length,
        layout: next,
        revisions: next.length,
        spatialChoices: next,
      });
    }
  };
  return (
    <Frame {...{ game, level, step: placed.length, total, onBack }}>
      <h2>{INTERIOR_PROMPTS[level]}</h2>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}
      >
        {ROOM_ITEMS.map((item) => (
          <button
            type="button"
            className={
              selected === item ? "btn btn-primary" : "btn btn-secondary"
            }
            key={item}
            onClick={() => setSelected(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className="city-grid"
        style={{
          "--grid-size": size,
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 62px)`,
          gap: 5,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: size * size }, (_, cell) => {
          const entry = placed.find((item) => item.cell === cell);
          return (
            <button
              type="button"
              key={cell}
              onClick={() => place(cell)}
              style={{
                width: 62,
                height: 62,
                background: entry ? "#dcfce7" : "var(--bg-app)",
                border: "1px solid var(--color-border)",
                fontSize: entry ? 11 : 20,
              }}
            >
              {entry ? entry.item : "+"}
            </button>
          );
        })}
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 18 }}>
        No single correct layout. Experiment with purpose and space.
      </p>
    </Frame>
  );
}

export function CreativeLifestyleGame({ game, level, onBack }) {
  const props = { game, level, onBack };
  if (game.id === "photo_mission") return <PhotoMission {...props} />;
  if (game.id === "fashion_studio") return <FashionStudio {...props} />;
  if (game.id === "directors_cut") return <DirectorsCut {...props} />;
  if (game.id === "music_maker") return <MusicMaker {...props} />;
  if (game.id === "junior_chef") return <JuniorChef {...props} />;
  return <InteriorDesigner {...props} />;
}
