import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Gamepad2,
  Home,
  Map,
  Sparkles,
  Route,
  LogOut,
  ShieldCheck,
  Plus,
  BarChart3,
  Layers,
  Lightbulb,
} from "lucide-react";
import api from "../utils/api";
import { QuestyMascot } from "./QuestyMascot";
import {
  Brand,
  UniverseIllustration,
  WorldScene,
  BadgeArtwork,
  EmptyState,
  LoadingState,
  ErrorState,
} from "./AdventureVisuals";
import { WORLDS } from "../data/catalog";
export { AdminDashboard } from "./AdminDashboard";
const AVATAR = {
  rocket: "🚀",
  star: "⭐",
  leaf: "🌿",
  planet: "🪐",
  robot: "🤖",
  palette: "🎨",
  lion: "🦁",
  doctor: "🩺",
  briefcase: "💼",
};
function AppHeader({ user, onLogout, parent = false }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Brand />
        <div className="app-header__right">
          <span>
            {parent ? "THE PARENT PERSPECTIVE" : "YOUR CURIOSITY, YOUR COMPASS"}
          </span>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
const isSkillResult = (record) =>
  record.score != null &&
  !["interest_battle", "curiosity_trail"].includes(record.gameType);
function Stat({ Icon, value, label }) {
  return (
    <div className="summary-stat">
      <Icon size={24} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
export function ChildDashboard({ onNavigate, user, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [tab, setTab] = useState("home");
  useEffect(() => {
    let active = true;
    setError("");
    setData(null);
    Promise.all(
      [
        "/child/profile",
        "/child/analysis",
        "/child/timeline",
        "/child/achievements",
      ].map((path) => api.get(path)),
    )
      .then(([profile, analysis, timeline, achievements]) => {
        if (active)
          setData({
            profile: profile.data,
            analysis: analysis.data,
            timeline: timeline.data,
            achievements: achievements.data,
          });
      })
      .catch(() => {
        if (active)
          setError(
            "Your saved adventure couldn’t load. Check the connection or sign in again if the local server has restarted.",
          );
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (!data)
    return (
      <>
        <AppHeader user={user} onLogout={onLogout} />
        {error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetry(retry + 1)}
            onLogout={onLogout}
          />
        ) : (
          <LoadingState />
        )}
      </>
    );
  const { profile, analysis, timeline, achievements: availableBadges } = data;
  const achievements = availableBadges.filter(
    (badge) => badge.earned === true && (analysis.totalGamesPlayed || 0) > 0,
  );
  const sessions = analysis.totalGamesPlayed || 0;
  const areas = analysis.topInterests || [];
  const entries = [...timeline].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );
  const nav = [
    ["home", Home, "My adventure"],
    ["map", Map, "My Discovery Map"],
    ["rewards", Award, "My Rewards"],
    ["interests", Sparkles, "My Interests"],
    ["journey", Route, "My Journey"],
  ];
  return (
    <>
      <AppHeader user={user} onLogout={onLogout} />
      <div className="app-layout">
        <nav className="side-nav" aria-label="Explorer navigation">
          {nav.map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => setTab(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
          <button onClick={() => onNavigate("games")}>
            <Gamepad2 /> Explore games
          </button>
          <button onClick={() => onNavigate("library")}>
            <BookOpen /> Career library
          </button>
          <div className="sidebar-note">
            <QuestyMascot expression="encouraging" />
            <p>You don’t have to be good at something to give it a go.</p>
          </div>
        </nav>
        <main className="app-content" id="adventure-content">
          <div className="welcome-row">
            <div className="explorer-identity">
              <span className="avatar-orb" aria-hidden="true">
                {AVATAR[profile.avatar] || "🧭"}
              </span>
              <div>
                <h1>Welcome back, Explorer!</h1>
                <p>Hi, {profile.nickname}. Where will you wander today?</p>
              </div>
            </div>
            <span className="level-pill">
              Level {profile.level} · {profile.points} XP
            </span>
          </div>
          {tab === "home" && (
            <div className="animate-fade-in">
              <section className="adventure-banner">
                <div>
                  <p className="eyebrow">YOUR NEXT WHAT-IF IS WAITING</p>
                  <h2>
                    A little play.
                    <br />A whole new possibility.
                  </h2>
                  <p>Questy says: try something that makes you curious.</p>
                  <div className="button-row">
                    <button
                      className="btn btn-primary"
                      onClick={() => onNavigate("games")}
                    >
                      Continue Adventure <ArrowRight size={16} />
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setTab("map")}
                    >
                      Explore career worlds
                    </button>
                  </div>
                </div>
                <UniverseIllustration />
              </section>
              <div className="dashboard-summary">
                <Stat
                  Icon={Gamepad2}
                  value={sessions}
                  label="saved adventures"
                />
                <Stat
                  Icon={Award}
                  value={profile.points}
                  label="XP collected"
                />
                <Stat
                  Icon={Compass}
                  value={achievements.length}
                  label="badges earned"
                />
              </div>
              <div className="dashboard-heading">
                <div>
                  <h2>Your next little world</h2>
                  <p>
                    Take a different path. There is no wrong place to begin.
                  </p>
                </div>
                <button className="text-button" onClick={() => setTab("map")}>
                  See the atlas <ArrowRight size={15} />
                </button>
              </div>
              <div className="mini-world-grid">
                {WORLDS.slice(0, 6).map((world) => (
                  <button
                    key={world.id}
                    className="mini-world"
                    style={{ "--world-tint": world.tint }}
                    onClick={() => onNavigate("games", { worldId: world.id })}
                  >
                    <WorldScene
                      kind={world.kind}
                      tint={world.tint}
                      decorative
                    />
                    <span>
                      {world.name}
                      <ArrowRight size={15} />
                    </span>
                  </button>
                ))}
              </div>
              <div className="evidence-note">
                <Lightbulb />
                <div>
                  <h3>
                    {sessions
                      ? "Every adventure adds a little context."
                      : "Your story is just beginning."}
                  </h3>
                  <p>
                    {sessions
                      ? "The areas you explore can change. Visit My Interests to see what your saved activity shows so far."
                      : "Play a few different activities. Your saved adventures will help you look back at what you enjoyed."}
                  </p>
                </div>
              </div>
            </div>
          )}
          {tab === "map" && (
            <section className="animate-fade-in">
              <div className="dashboard-heading">
                <div>
                  <h2>My Discovery Map</h2>
                  <p>
                    Nine worlds, one curious explorer. Every difficulty is open.
                  </p>
                </div>
              </div>
              <div className="discovery-map">
                {WORLDS.map((world) => (
                  <article
                    key={world.id}
                    className="map-world"
                    style={{ "--world-tint": world.tint }}
                  >
                    <WorldScene
                      kind={world.kind}
                      tint={world.tint}
                      decorative
                    />
                    <h3>{world.name}</h3>
                    <p>{world.games.length} activities to try</p>
                    <button
                      className="text-button"
                      onClick={() => onNavigate("games", { worldId: world.id })}
                    >
                      Explore world <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
              <p className="fine-print" style={{ marginTop: 20 }}>
                Worlds are places to browse, not a measure of your ability.
                Player Code: {profile.playerCode}
              </p>
            </section>
          )}
          {tab === "rewards" && (
            <section className="animate-fade-in">
              <div className="dashboard-heading">
                <div>
                  <h2>My Rewards</h2>
                  <p>A little celebration for your exploring.</p>
                </div>
              </div>
              {achievements.length ? (
                <div className="reward-grid">
                  {achievements.map((badge) => (
                    <article key={badge.id} className="reward-card">
                      <BadgeArtwork />
                      <h3>{badge.name}</h3>
                      <p>
                        A progress badge recorded by the app. Keep exploring at
                        your own pace.
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Your first badge is still ahead"
                  action="Find an adventure"
                  onAction={() => onNavigate("games")}
                >
                  Your earned badges will appear here when the server awards
                  them. Keep trying things you enjoy.
                </EmptyState>
              )}
              <div className="evidence-note">
                <Award />
                <div>
                  <h3>{profile.points} XP saved</h3>
                  <p>
                    XP reflects recorded activity rewards. It is not a score of
                    your future potential.
                  </p>
                </div>
              </div>
            </section>
          )}
          {tab === "interests" && (
            <section className="animate-fade-in">
              <div className="dashboard-heading">
                <div>
                  <h2>My Interests</h2>
                  <p>
                    A snapshot of the places you’ve explored. Always room for
                    more.
                  </p>
                </div>
              </div>
              {areas.length ? (
                <div className="card">
                  <p className="fine-print">
                    Areas with the most completed sessions recorded so far
                  </p>
                  <div className="interest-chips">
                    {areas.map((area) => (
                      <span key={area}>{area}</span>
                    ))}
                  </div>
                  <div className="evidence-note">
                    <Sparkles />
                    <div>
                      <h3>Interest grows. So do you.</h3>
                      <p>
                        These are patterns in your activity, not labels about
                        what you can do. A new adventure could spark a new
                        interest.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Curiosity starts with a try"
                  action="Explore games"
                  onAction={() => onNavigate("games")}
                >
                  No activity areas to show yet. Choose any world to begin.
                </EmptyState>
              )}
              <div className="dashboard-heading">
                <h2>Developing strengths</h2>
              </div>
              <p className="fine-print">
                Trying different activities practices different ways of
                thinking. Your activity choices alone cannot show mastery.
                Scored task results, where available, give parents more context.
              </p>
            </section>
          )}
          {tab === "journey" && (
            <section className="animate-fade-in">
              <div className="dashboard-heading">
                <div>
                  <h2>My Journey</h2>
                  <p>Your exploration story, one saved adventure at a time.</p>
                </div>
              </div>
              {entries.length ? (
                <ol className="timeline">
                  {entries.map((entry, index) => (
                    <li key={`${entry.timestamp}-${index}`}>
                      <time dateTime={entry.timestamp}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </time>
                      <h3>{entry.title}</h3>
                      <p>{entry.detail}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState
                  title="A fresh page in your story"
                  action="Start exploring"
                  onAction={() => onNavigate("games")}
                >
                  Finish a game and your saved session will appear here.
                </EmptyState>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export function ParentDashboard({ user, onLogout }) {
  const [children, setChildren] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [code, setCode] = useState("");
  const [linkPin, setLinkPin] = useState("");
  const [linkError, setLinkError] = useState("");
  const [success, setSuccess] = useState("");
  const [linking, setLinking] = useState(false);
  const [reload, setReload] = useState(0);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoadError("");
    api
      .get("/parent/children")
      .then((response) => {
        if (!active) return;
        setChildren(response.data);
        setSelected(
          (previous) =>
            response.data.find(
              (child) => child.profileId === previous?.profileId,
            ) ||
            response.data[0] ||
            null,
        );
      })
      .catch(() => {
        if (active)
          setLoadError(
            "Your linked profiles couldn’t load. Check the connection or sign in again.",
          );
      });
    return () => {
      active = false;
    };
  }, [reload]);
  useEffect(() => {
    if (!selected) return;
    let active = true;
    setDetail(null);
    setDetailError("");
    Promise.all([
      api.get(`/parent/children/${selected.profileId}/activity`),
      api.get(`/parent/children/${selected.profileId}/insights`),
    ])
      .then(([activity, insights]) => {
        if (active)
          setDetail({ activity: activity.data, insights: insights.data });
      })
      .catch(() => {
        if (active)
          setDetailError(
            "The activity record couldn’t load. No insight is being shown until the saved data is available.",
          );
      });
    return () => {
      active = false;
    };
  }, [selected, refresh]);
  const link = async (event) => {
    event.preventDefault();
    if (linking) return;
    setLinkError("");
    setSuccess("");
    setLinking(true);
    try {
      const response = await api.post("/parent/link-child", {
        playerCode: code.trim().toUpperCase(),
        pin: linkPin,
      });
      setSuccess(response.data.message || "Child linked successfully.");
      setCode("");
      setLinkPin("");
      setReload((value) => value + 1);
    } catch (error) {
      setLinkError(
        error.response?.data?.error ||
          "The profile could not be linked. Check the code and your connection.",
      );
    } finally {
      setLinking(false);
    }
  };
  const games = detail?.activity?.games || [];
  const recent = [...games]
    .sort((a, b) => new Date(b.datePlay) - new Date(a.datePlay))
    .slice(0, 5);
  // Count actual records for charts. Backend default interest/skill values are not measured percentages.
  const counts = {};
  for (const game of games)
    for (const category of new Set(
      (game.careerDomains || game.gameCategory || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ))
      counts[category] = (counts[category] || 0) + 1;
  const chart = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const scored = games.filter(isSkillResult);
  const insights = detail?.insights;
  const maxCount = Math.max(1, ...chart.map(([, count]) => count));
  const topArea = chart[0]?.[0];
  return (
    <>
      <AppHeader user={user} onLogout={onLogout} parent />
      <main className="parent-workspace">
        <div className="parent-title">
          <div>
            <p className="eyebrow">THE BIGGER PICTURE, GENTLY</p>
            <h1>Child exploration overview</h1>
            <p>
              Welcome, {user.username || user.email}. Let curiosity lead the
              conversation.
            </p>
          </div>
          <span className="parent-account-note">
            <ShieldCheck size={18} /> Linked profiles only
          </span>
        </div>
        {loadError ? (
          <ErrorState
            message={loadError}
            onRetry={() => setReload(reload + 1)}
            onLogout={onLogout}
          />
        ) : children === null ? (
          <LoadingState label="Loading linked profiles…" />
        ) : (
          <div className="parent-grid">
            <aside
              className="parent-sidebar"
              aria-label="Linked child profiles"
            >
              <h2>Your explorers</h2>
              <div className="child-selector">
                {children.map((child) => (
                  <button
                    key={child.profileId}
                    aria-pressed={selected?.profileId === child.profileId}
                    onClick={() => setSelected(child)}
                  >
                    <span aria-hidden="true">
                      {AVATAR[child.avatar] || "🧭"}
                    </span>
                    <span>
                      <strong>{child.nickname}</strong>
                      <small>{child.playerCode}</small>
                    </span>
                  </button>
                ))}
              </div>
              {!children.length && (
                <p className="fine-print">No linked profiles yet.</p>
              )}
              <form className="link-form" onSubmit={link}>
                <p>
                  Link a child’s profile to review their recorded adventures
                  together.
                </p>
                <label className="form-label" htmlFor="link-player-code">
                  Player Code
                </label>
                <input
                  id="link-player-code"
                  className="form-input"
                  placeholder="e.g. CQ4821"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.toUpperCase())
                  }
                  required
                />
                <label className="form-label" htmlFor="link-child-pin">Child PIN</label>
                <input id="link-child-pin" className="form-input" type="password" inputMode="numeric"
                  autoComplete="off" pattern="[0-9]{4}" maxLength={4} required value={linkPin}
                  onChange={(event) => setLinkPin(event.target.value.replace(/\D/g, ""))} />
                <p className="fine-print">Enter the PIN with your child to confirm access to this profile.</p>
                <button className="btn btn-primary" disabled={linking}>
                  <Plus size={15} />
                  {linking ? "Linking…" : "Link Child"}
                </button>
                {linkError && (
                  <p className="auth-error" role="alert">
                    {linkError}
                  </p>
                )}
                {success && (
                  <p className="link-success" role="status">
                    {success}
                  </p>
                )}
              </form>
            </aside>
            <div className="parent-main">
              {!selected ? (
                <EmptyState title="A window into their world">
                  Enter your child’s Player Code to see saved adventures and the
                  evidence behind available insights. A child can begin playing
                  independently.
                </EmptyState>
              ) : detailError ? (
                <ErrorState
                  message={detailError}
                  onRetry={() => setRefresh(refresh + 1)}
                />
              ) : !detail ? (
                <LoadingState
                  label={`Loading ${selected.nickname}’s saved activity…`}
                />
              ) : (
                <div className="animate-fade-in">
                  <section className="parent-overview">
                    <p className="eyebrow">
                      ACTIVITY SNAPSHOT · {selected.ageGroup}
                    </p>
                    <h2>What has {selected.nickname} explored?</h2>
                    <p>
                      {selected.playerCode} · Explorer level {selected.level} ·{" "}
                      {selected.points} XP
                    </p>
                    <p>
                      A record of play, not a prediction of future interests or
                      ability.
                    </p>
                    <button
                      className="text-button"
                      onClick={() => {
                        setRefresh(refresh + 1);
                        setReload(reload + 1);
                      }}
                    >
                      Refresh saved activity <ArrowRight size={14} />
                    </button>
                  </section>
                  <div className="parent-stats">
                    <Stat
                      Icon={Gamepad2}
                      value={games.length}
                      label="saved sessions"
                    />
                    <Stat
                      Icon={Compass}
                      value={chart.length}
                      label="areas explored"
                    />
                    <Stat
                      Icon={BarChart3}
                      value={scored.length}
                      label="scored sessions"
                    />
                  </div>
                  <section className="parent-section">
                    <h2>Recently played</h2>
                    {recent.length ? (
                      <ul className="recent-session-list">
                        {recent.map((game) => (
                          <li key={game.id}>
                            <div>
                              <strong>{game.gameName || game.gameType}</strong>
                              <p>
                                {game.gameCategory} · {game.difficulty}
                                {game.datePlay
                                  ? ` · ${new Date(game.datePlay).toLocaleDateString()}`
                                  : ""}
                              </p>
                            </div>
                            <span className="session-score">
                              {!isSkillResult(game)
                                ? "Open-ended"
                                : `Score ${game.score}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="section-subtitle">
                        No completed sessions yet. Try a game and return to see
                        the saved record.
                      </p>
                    )}
                  </section>
                  <section className="parent-section">
                    <h2>Interest exploration</h2>
                    <p className="section-subtitle">
                      Completed sessions by exploration area. This shows
                      activity frequency, not aptitude or a probability.
                    </p>
                    {chart.length ? (
                      <div
                        className="activity-chart"
                        role="img"
                        aria-label={chart
                          .map(([name, count]) => `${name}: ${count} sessions`)
                          .join("; ")}
                      >
                        {chart.map(([name, count]) => (
                          <div className="activity-bar" key={name}>
                            <span>{name}</span>
                            <div className="activity-bar__track">
                              <div
                                className="activity-bar__fill"
                                style={{
                                  width: `${(count / maxCount) * 100}%`,
                                }}
                              />
                            </div>
                            <strong>{count}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState title="Room for discovery">
                        There is no activity evidence to chart yet. Unplayed
                        areas are possibilities, not weaknesses.
                      </EmptyState>
                    )}
                    <p className="fine-print">
                      A session can belong to more than one area. Counts are a
                      snapshot; no time trend is inferred from an empty history.
                    </p>
                  </section>
                  <section className="parent-section">
                    <h2>Developing skills & evidence</h2>
                    <p className="section-subtitle">
                      Open an area to see the actual sessions behind it.
                      Open-ended choices are not scored skill evidence.
                    </p>
                    {(insights?.categories || []).map((category) => {
                      const records = games.filter((game) =>
                        (game.careerDomains || game.gameCategory || "")
                          .split(",")
                          .map((item) => item.trim())
                          .includes(category),
                      );
                      const scoredRecords = records.filter(isSkillResult);
                      return (
                        <details className="domain-evidence" key={category}>
                          <summary>
                            {category}
                            <span>
                              {records.length} sessions · {scoredRecords.length}{" "}
                              scored +
                            </span>
                          </summary>
                          <div className="domain-evidence__body">
                            {records.length ? (
                              <>
                                <p>
                                  <strong>Activity evidence:</strong>{" "}
                                  {records.length} saved sessions in this area.
                                </p>
                                <p>
                                  <strong>Scored results:</strong>{" "}
                                  {scoredRecords.length
                                    ? scoredRecords
                                        .map(
                                          (record) =>
                                            `${record.gameName || record.gameType}: ${record.score}`,
                                        )
                                        .join("; ")
                                    : "Not enough evidence yet. These activities record choices, not skill scores."}
                                </p>
                                {scoredRecords.length > 0 && (
                                  <p>
                                    <strong>Current summary:</strong>{" "}
                                    {insights.skillLevels?.[category]}. This is
                                    a rule-based summary of tasks, not a
                                    standardized assessment.
                                  </p>
                                )}
                                <p>
                                  <strong>Difficulties recorded:</strong>{" "}
                                  {[
                                    ...new Set(
                                      records.map(
                                        (record) => record.difficulty,
                                      ),
                                    ),
                                  ].join(", ")}
                                </p>
                                <span className="evidence-tag">
                                  {insights.evidenceConfidence?.[category] ||
                                    "Recorded activity"}
                                </span>
                              </>
                            ) : (
                              <p>
                                Not enough evidence yet. No completed sessions
                                are recorded in this area.
                              </p>
                            )}
                          </div>
                        </details>
                      );
                    })}
                  </section>
                  <section className="parent-section">
                    <h2>What the record shows</h2>
                    {insights?.parentInsights?.map((text, index) => (
                      <p className="record-insight" key={index}>
                        {text}
                      </p>
                    ))}
                    {games.length > 0 && insights?.whatChanged?.length > 0 && (
                      <>
                        <h3 style={{ marginTop: 22, fontSize: 16 }}>
                          Recent activity notes
                        </h3>
                        {insights.whatChanged.map((text) => (
                          <p className="record-insight" key={text}>
                            {text}
                          </p>
                        ))}
                      </>
                    )}
                    <p className="fine-print">
                      These summaries use the current app’s rules and available
                      records. They cannot establish why a child chose an
                      activity.
                    </p>
                  </section>
                  {games.length > 0 && insights?.careerClusters && (
                    <section className="parent-section">
                      <h2>Career clusters to explore</h2>
                      <p className="section-subtitle">
                        Activity groupings for conversation, not recommended
                        careers or predictions.
                      </p>
                      <div className="cluster-grid">
                        {Object.entries(insights.careerClusters).map(
                          ([name, text]) => (
                            <article className="cluster-item" key={name}>
                              <h3>{name}</h3>
                              <p>{text}</p>
                            </article>
                          ),
                        )}
                      </div>
                    </section>
                  )}
                  <section className="exploration-suggestion">
                    <WorldScene kind="nature" decorative />
                    <div>
                      <h3>A small invitation for next time</h3>
                      <p>
                        {topArea
                          ? `You’ve recorded activity in ${topArea}. Ask what felt enjoyable, then let your child choose a familiar activity or a completely different world.`
                          : "Offer two different activities and let your child choose. Ask what they enjoyed; there is no need to turn a first attempt into a label."}
                      </p>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
