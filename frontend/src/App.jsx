import React, { useState, useEffect } from "react";
import api from "./utils/api";
import {
  ChildDashboard,
  ParentDashboard,
  AdminDashboard,
} from "./components/Dashboards";
import { Games } from "./components/Games";
import { CareerLibrary } from "./components/CareerLibrary";
import { AIChatbot } from "./components/AIChatbot";
import { PublicHome } from "./components/PublicHome";
import { QuestyMascot } from "./components/QuestyMascot";
import {
  Brand,
  WorldScene,
  BadgeArtwork,
  LoadingState,
} from "./components/AdventureVisuals";

const AVATARS = [
  { id: "rocket", label: "🚀 Rocket" },
  { id: "star", label: "⭐ Star" },
  { id: "leaf", label: "🌿 Leaf" },
  { id: "planet", label: "🪐 Planet" },
  { id: "robot", label: "🤖 Robot" },
  { id: "palette", label: "🎨 Palette" },
  { id: "lion", label: "🦁 Lion" },
  { id: "doctor", label: "🩺 Doctor" },
  { id: "briefcase", label: "💼 Leader" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing"); // landing, student-entry, create-player, player-code-created, child-picker, login, register, dashboard, games, library
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "PARENT",
  });
  const [authError, setAuthError] = useState("");
  const [pendingAdventure, setPendingAdventure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = (destination, selection = null) => {
    setPendingAdventure(selection);
    setView(destination);
  };

  const [loading, setLoading] = useState(true);

  // Child registration 4 steps
  const [regStep, setRegStep] = useState(1);
  const [playerForm, setPlayerForm] = useState({
    nickname: "",
    avatar: "rocket",
    ageGroup: "11-13",
    pin: "",
  });
  const [createdPlayerCode, setCreatedPlayerCode] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    setAuthError("");
  }, [view, regStep]);

  useEffect(() => {
    const synchronizeSession = (event) => {
      if (event.storageArea !== localStorage || !["token", "user", null].includes(event.key)) return;
      // A role/account switch in another tab must not retain the previous child's view.
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      try {
        const next = token && stored ? JSON.parse(stored) : null;
        setUser(next);
        setPendingAdventure(null);
        setView(next?.role ? "dashboard" : "landing");
      } catch {
        setUser(null);
        setView("landing");
      }
    };
    window.addEventListener("storage", synchronizeSession);
    return () => window.removeEventListener("storage", synchronizeSession);
  }, []);

  // Child login
  const [childProfiles, setChildProfiles] = useState([]);
  const [selectedChildProfile, setSelectedChildProfile] = useState(null);
  const [loginPlayerCode, setLoginPlayerCode] = useState("");
  const [childPin, setChildPin] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role) {
          setUser(parsed);
          setView("dashboard");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setView("landing");
        }
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setView("landing");
      }
    }
    const storedProfiles = localStorage.getItem("careerquest-child-profiles");
    if (storedProfiles) {
      try {
        setChildProfiles(JSON.parse(storedProfiles));
      } catch (e) { /* Invalid local history is ignored; the next save starts a fresh history. */ }
    }
    setLoading(false);
  }, []);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleChildRegistrationSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;
    setAuthError("");
    if (!playerForm.nickname.trim()) {
      setAuthError("Please enter your name!");
      return;
    }
    if (!/^\d{4}$/.test(playerForm.pin)) {
      setAuthError("Please enter a 4-digit PIN!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/child/register", playerForm);
      const userData = res.data;
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      const newProf = {
        profileId: userData.childId,
        playerCode: userData.playerCode,
        nickname: userData.nickname,
        avatar: userData.avatar,
        ageGroup: userData.ageGroup,
        level: 1,
      };

      const updatedProfiles = [
        newProf,
        ...childProfiles.filter((p) => p.playerCode !== userData.playerCode),
      ];
      setChildProfiles(updatedProfiles);
      localStorage.setItem(
        "careerquest-child-profiles",
        JSON.stringify(updatedProfiles),
      );

      setUser(userData);
      setCreatedPlayerCode(userData.playerCode);
      setView("player-code-created");
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          (err.request
            ? "The game server is not running. Start the backend and try again."
            : "Could not create player profile. Try again!"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChildPinLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setAuthError("");
    const targetCode = selectedChildProfile
      ? selectedChildProfile.playerCode
      : loginPlayerCode;
    if (!targetCode) {
      setAuthError("Please enter your Player Code");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/auth/child/login", {
        playerCode: targetCode,
        pin: childPin,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setView(pendingAdventure ? "games" : "dashboard");
      setChildPin("");
    } catch (err) {
      setAuthError(
        err.response?.data?.message || "That PIN did not work. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setAuthError("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", {
        username: authForm.username,
        password: authForm.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setView("dashboard");
    } catch (err) {
      setAuthError(
        err.response?.data?.error || "Invalid credentials or connection error.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setAuthError("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/register", authForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setView("dashboard");
    } catch (err) {
      setAuthError(
        err.response?.data?.error ||
          "Registration failed. Try a different username/email.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPendingAdventure(null);
    setChildPin("");
    setSelectedChildProfile(null);
    setLoginPlayerCode("");
    setView("landing");
    setAuthForm({ username: "", password: "", email: "", role: "PARENT" });
  };

  if (loading) {
    return <LoadingState label="Opening your world of possibilities…" />;
  }

  // ----------------------------------------------------
  // PUBLIC VIEW: LANDING PAGE
  // ----------------------------------------------------
  if (view === "landing") {
    return (
      <PublicHome
        onStart={(selection) => {
          setPendingAdventure(selection || null);
          setView("student-entry");
        }}
        onParentLogin={() => setView("login")}
      />
    );
  }

  // ----------------------------------------------------
  // STUDENT ENTRY GATEWAY
  // ----------------------------------------------------
  if (view === "student-entry") {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel">
          <div className="child-gate__mark">
            <QuestyMascot
              className="gate-questy"
              expression={
                view === "create-player" && regStep === 4
                  ? "encouraging"
                  : "curious"
              }
            />
          </div>
          <p className="eyebrow">FUTUREQUEST AI</p>
          <h2>Ready to start your adventure?</h2>
          <p className="child-gate__hint">Choose an option to continue:</p>
          <div className="entry-actions">
            <button
              className="btn btn-primary hero-btn"
              onClick={() => {
                setRegStep(1);
                setView("create-player");
              }}
            >
              ✨ New Player
            </button>
            <button
              className="btn btn-secondary hero-btn"
              onClick={() => setView("child-picker")}
            >
              🚀 Continue My Adventure
            </button>
          </div>
          <button className="text-button" onClick={() => setView("landing")}>
            Back to Welcome
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SIMPLE 4-STEP CHILD REGISTRATION ("Create Your Player")
  // ----------------------------------------------------
  if (view === "create-player") {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel player-form">
          <div className="child-gate__mark">
            <QuestyMascot
              className="gate-questy"
              expression={
                view === "create-player" && regStep === 4
                  ? "encouraging"
                  : "curious"
              }
            />
          </div>
          <p className="eyebrow">YOUR EXPLORER PASSPORT</p>
          <ol className="wizard-route" aria-label="Setup progress">
            {[1, 2, 3, 4].map((step) => (
              <li
                key={step}
                aria-current={step === regStep ? "step" : undefined}
                className={step < regStep ? "complete" : ""}
                aria-label={`Step ${step}${step < regStep ? " complete" : ""}`}
              >
                {step < regStep ? "✓" : step}
              </li>
            ))}
          </ol>
          <h2>Create Your Player</h2>

          {authError && (
            <div className="auth-error" role="alert">
              {authError}
            </div>
          )}

          {regStep === 1 && (
            <div className="wizard-step animate-fade-in">
              <label
                htmlFor="player-nickname"
                className="form-label"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Step 1: What's your name?
              </label>
              <input
                className="form-input"
                style={{
                  fontSize: "18px",
                  textAlign: "center",
                  padding: "12px",
                }}
                id="player-nickname"
                maxLength={50}
                value={playerForm.nickname}
                onChange={(e) =>
                  setPlayerForm({ ...playerForm, nickname: e.target.value })
                }
                placeholder="Enter your nickname"
                autoFocus
              />
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "20px" }}
                onClick={() => {
                  if (!playerForm.nickname.trim()) {
                    setAuthError("Please enter your nickname");
                    return;
                  }
                  setAuthError("");
                  setRegStep(2);
                }}
              >
                Next Step →
              </button>
            </div>
          )}

          {regStep === 2 && (
            <div className="wizard-step animate-fade-in">
              <p className="form-label" style={{ fontSize: "20px" }}>
                Step 2: Choose your avatar
              </p>
              <div
                className="avatar-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  margin: "16px 0",
                }}
              >
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`avatar-tile ${playerForm.avatar === av.id ? "avatar-tile--selected" : ""}`}
                    onClick={() =>
                      setPlayerForm({ ...playerForm, avatar: av.id })
                    }
                    style={{
                      fontSize: "24px",
                      padding: "12px",
                      borderRadius: "12px",
                      border:
                        playerForm.avatar === av.id
                          ? "3px solid var(--color-primary)"
                          : "1px solid var(--color-border)",
                    }}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setRegStep(1)}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setRegStep(3)}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="wizard-step animate-fade-in">
              <p className="form-label" style={{ fontSize: "20px" }}>
                Step 3: Select your age group
              </p>
              <div
                className="age-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  margin: "16px 0",
                }}
              >
                {["8-10", "11-13", "14-16", "17+"].map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`age-tile ${playerForm.ageGroup === age ? "age-tile--selected" : ""}`}
                    onClick={() =>
                      setPlayerForm({ ...playerForm, ageGroup: age })
                    }
                    style={{
                      padding: "16px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      borderRadius: "12px",
                      border:
                        playerForm.ageGroup === age
                          ? "3px solid var(--color-primary)"
                          : "1px solid var(--color-border)",
                    }}
                  >
                    {age}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setRegStep(2)}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setRegStep(4)}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {regStep === 4 && (
            <form
              onSubmit={handleChildRegistrationSubmit}
              className="wizard-step animate-fade-in"
            >
              <label
                htmlFor="create-player-pin"
                className="form-label"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Step 4: Create a 4-digit PIN
              </label>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  margin: "8px 0",
                }}
              >
                "Use these 4 numbers next time you want to continue your
                adventure."
              </p>
              <input
                id="create-player-pin"
                className="pin-input"
                type="password"
                autoComplete="new-password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength="4"
                required
                value={playerForm.pin}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    pin: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="1234"
                style={{
                  fontSize: "24px",
                  letterSpacing: "8px",
                  textAlign: "center",
                  margin: "12px 0",
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setRegStep(3)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Start Playing 🚀
                </button>
              </div>
            </form>
          )}

          <button
            className="text-button"
            style={{ marginTop: "16px" }}
            onClick={() => setView("student-entry")}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PLAYER CODE CREATED DISPLAY MODAL
  // ----------------------------------------------------
  if (view === "player-code-created") {
    return (
      <div className="child-gate animate-fade-in">
        <div
          className="child-gate__panel"
          style={{ textAlign: "center", padding: "32px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌟</div>
          <h2>Welcome, {playerForm.nickname}!</h2>
          <p style={{ color: "var(--text-secondary)", margin: "12px 0" }}>
            Your player profile was created successfully!
          </p>

          <div
            className="card"
            style={{
              background: "var(--bg-app)",
              border: "2px dashed var(--color-primary)",
              padding: "20px",
              margin: "20px 0",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Your Unique Player Code
            </p>
            <h1
              style={{
                fontSize: "42px",
                color: "var(--color-primary)",
                letterSpacing: "4px",
                margin: "8px 0",
              }}
            >
              {createdPlayerCode}
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              "Remember this code. You can use it to continue your adventure
              later!"
            </p>
          </div>

          <button
            className="btn btn-primary hero-btn"
            style={{ width: "100%" }}
            onClick={() => setView(pendingAdventure ? "games" : "dashboard")}
          >
            🚀 Start My Adventure
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CHILD LOGIN ("Who's Playing?")
  // ----------------------------------------------------
  if (view === "child-picker") {
    return (
      <div className="child-gate animate-fade-in">
        <div className="child-gate__panel">
          <div className="child-gate__mark">
            <QuestyMascot
              className="gate-questy"
              expression={
                view === "create-player" && regStep === 4
                  ? "encouraging"
                  : "curious"
              }
            />
          </div>
          <p className="eyebrow">FUTUREQUEST AI</p>
          <h2>Who's Playing?</h2>

          {authError && (
            <div className="auth-error" role="alert">
              {authError}
            </div>
          )}

          {/* Profile Tiles */}
          {childProfiles.length > 0 && (
            <div
              className="profile-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px",
                margin: "16px 0",
              }}
            >
              {childProfiles.map((p) => (
                <button
                  key={p.playerCode || p.profileId}
                  className={`profile-tile ${selectedChildProfile?.playerCode === p.playerCode ? "profile-tile--selected" : ""}`}
                  onClick={() => {
                    setSelectedChildProfile(p);
                    setLoginPlayerCode(p.playerCode);
                    setAuthError("");
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      selectedChildProfile?.playerCode === p.playerCode
                        ? "3px solid var(--color-primary)"
                        : "1px solid var(--color-border)",
                  }}
                >
                  <span style={{ fontSize: "28px", display: "block" }}>
                    {p.avatar === "star"
                      ? "⭐"
                      : p.avatar === "leaf"
                        ? "🌿"
                        : p.avatar === "planet"
                          ? "🪐"
                          : p.avatar === "robot"
                            ? "🤖"
                            : p.avatar === "palette"
                              ? "🎨"
                              : "🚀"}
                  </span>
                  <strong
                    style={{
                      fontSize: "16px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {p.nickname}
                  </strong>
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {p.playerCode}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Player Code Input if profile not selected */}
          {!selectedChildProfile && (
            <div style={{ margin: "16px 0" }}>
              <label htmlFor="login-player-code" className="form-label">
                Enter your Player Code (e.g. CQ4821)
              </label>
              <input
                className="form-input"
                id="login-player-code"
                value={loginPlayerCode}
                onChange={(e) =>
                  setLoginPlayerCode(e.target.value.toUpperCase())
                }
                placeholder="CQ4821"
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  letterSpacing: "2px",
                }}
              />
            </div>
          )}

          {selectedChildProfile && (
            <button
              className="text-button"
              onClick={() => {
                setSelectedChildProfile(null);
                setLoginPlayerCode("");
                setChildPin("");
              }}
            >
              Use a different Player Code
            </button>
          )}
          {/* PIN Input */}
          {(selectedChildProfile || loginPlayerCode) && (
            <form
              onSubmit={handleChildPinLogin}
              className="pin-form animate-fade-in"
              style={{ marginTop: "16px" }}
            >
              <label className="form-label" htmlFor="child-pin">
                Enter your 4-digit PIN
              </label>
              <input
                id="child-pin"
                type="password"
                autoComplete="current-password"
                className="pin-input"
                inputMode="numeric"
                maxLength="4"
                pattern="[0-9]{4}"
                value={childPin}
                onChange={(e) => setChildPin(e.target.value.replace(/\D/g, ""))}
                placeholder="1234"
                style={{
                  fontSize: "24px",
                  letterSpacing: "6px",
                  textAlign: "center",
                  margin: "8px 0",
                }}
                autoFocus
                required
              />
              <button
                className="btn btn-primary"
                type="submit"
                style={{ width: "100%", marginTop: "12px" }}
              >
                Continue Adventure 🚀
              </button>
            </form>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              className="text-button"
              onClick={() => setView("student-entry")}
            >
              Back
            </button>
            <button
              className="text-button"
              onClick={() => {
                setRegStep(1);
                setView("create-player");
              }}
            >
              New Player
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PARENT LOGIN / REGISTER
  // ----------------------------------------------------
  if (view === "login" || view === "register") {
    const registering = view === "register";
    return (
      <main className="account-frame">
        <section className="account-story">
          <Brand
            onClick={(event) => {
              event.preventDefault();
              setView("landing");
            }}
          />
          <WorldScene kind="helping" tint="#e2ddf0" decorative />
          <p className="eyebrow">FOR THE GROWN-UPS CHEERING THEM ON</p>
          <h1>
            See what sparks
            <br />
            their curiosity.
          </h1>
          <p>
            Real activities. Growing interests.
            <br />A little more understanding, one adventure at a time.
          </p>
        </section>
        <section className="account-form">
          <p className="eyebrow">THE PARENT PERSPECTIVE</p>
          <h2>
            {registering ? "Create your parent account" : "Welcome back."}
          </h2>
          <p>
            {registering
              ? "A place to follow their exploration, without deciding their destination."
              : "Sign in to see your child’s saved adventures and available insights."}
          </p>
          {authError && (
            <div className="auth-error" role="alert">
              {authError}
            </div>
          )}
          <form
            onSubmit={registering ? handleParentRegister : handleParentLogin}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="parent-username">
                {registering ? "Username" : "Email or username"}
              </label>
              <input
                id="parent-username"
                type="text"
                name="username"
                autoComplete="username"
                className="form-input"
                required
                minLength={registering ? 3 : undefined}
                value={authForm.username}
                onChange={handleAuthChange}
              />
            </div>
            {registering && (
              <div className="form-group">
                <label className="form-label" htmlFor="parent-email">
                  Email address
                </label>
                <input
                  id="parent-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="form-input"
                  required
                  value={authForm.email}
                  onChange={handleAuthChange}
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="parent-password">
                Password
              </label>
              <input
                id="parent-password"
                type="password"
                name="password"
                autoComplete={registering ? "new-password" : "current-password"}
                className="form-input"
                required
                minLength={registering ? 6 : undefined}
                value={authForm.password}
                onChange={handleAuthChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Connecting…"
                : registering
                  ? "Create parent account"
                  : "Sign In"}
            </button>
          </form>
          <p>
            {registering ? "Already registered? " : "New to FutureQuest? "}
            <button
              className="text-button"
              onClick={() => setView(registering ? "login" : "register")}
            >
              {registering ? "Sign in" : "Create a parent account"}
            </button>
          </p>
          <button className="text-button" onClick={() => setView("landing")}>
            ← Back to welcome
          </button>
          <p className="fine-print">
            Use your child?s Player Code to link their profile after signing in.
            Keep account details private.
          </p>
        </section>
      </main>
    );
  }

  // ----------------------------------------------------
  // LOGGED IN USERS
  // ----------------------------------------------------
  if (user) {
    const role = (user.role || "").toUpperCase().replace(/^ROLE_/, "");

    if (role.includes("CHILD")) {
      const childView =
        view === "games" || view === "library" ? view : "dashboard";
      return (
        <div>
          {childView === "dashboard" && (
            <ChildDashboard
              user={user}
              onLogout={handleLogout}
              onNavigate={navigate}
            />
          )}
          {childView === "games" && (
            <Games
              initialSelection={pendingAdventure}
              onBack={() => navigate("dashboard")}
            />
          )}
          {childView === "library" && (
            <CareerLibrary onBack={() => setView("dashboard")} />
          )}
          {childView !== "games" && <AIChatbot />}
        </div>
      );
    }

    if (role.includes("PARENT")) {
      return <ParentDashboard user={user} onLogout={handleLogout} />;
    }

    if (role.includes("ADMIN")) {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    // Fallback: If user role is unrecognized or stale, auto-clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("landing");
    return null;
  }

  // Safe default fallback for non-logged in users
  if (view === "dashboard") {
    setView("landing");
    return null;
  }

  return <div>Access Denied or Unknown State.</div>;
}
