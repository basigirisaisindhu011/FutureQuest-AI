import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Sparkles,
  Check,
  Compass,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { QuestyMascot } from "./QuestyMascot";
import {
  Brand,
  SectionHeading,
  UniverseIllustration,
  WorldScene,
  GameArtwork,
} from "./AdventureVisuals";
import { GAME_CATALOG, WORLDS, getGame, gameWorld } from "../data/catalog";

const FAQS = [
  [
    "What is FutureQuest AI?",
    "An interactive platform where children try career-inspired games, explore interests and practice developing skills. It opens possibilities without assigning a future.",
  ],
  [
    "Who can use it?",
    "The player setup offers age groups 8–10, 11–13, 14–16 and 17+. Parents can create a separate account and link a player profile.",
  ],
  [
    "How do children play?",
    "Choose a nickname, avatar, age group and four-digit PIN. Keep your Player Code for next time, then choose a game and any difficulty. No parent account is required to begin.",
  ],
  [
    "Are difficulty levels locked?",
    "No. Easy, Moderate, Medium and Hard are freely selectable from the start. Each activity has its own format and challenge length.",
  ],
  [
    "How are interests discovered?",
    "The current app uses rules to summarize recorded game sessions, categories and replays. Choosing an activity repeatedly can be a conversation starter about interest; it is not a fixed assessment.",
  ],
  [
    "Can parents track progress?",
    "Yes. After linking a child’s Player Code, parents can review saved sessions, XP, exploration areas and available evidence. An unplayed area is an invitation to explore, not a low ability score.",
  ],
  [
    "Does the platform decide a child’s career?",
    "Never. Interests and skills develop over time. We help children explore possibilities, not decide their futures for them.",
  ],
  [
    "How is children’s data protected?",
    "Children sign in with a Player Code and PIN; parents use a password and confirm a child’s PIN when linking a profile. Keep codes and PINs private. This local prototype stores records in a local database file; it is not a production privacy guarantee.",
  ],
];
const STEPS = [
  [
    "01",
    "Create your explorer",
    "A nickname, an avatar, an age group and a secret PIN. Ready for takeoff.",
    "tech",
  ],
  [
    "02",
    "Enter career worlds",
    "Visit laboratories, studios, forests and places full of big ideas.",
    "nature",
  ],
  [
    "03",
    "Play and discover",
    "Choose any difficulty. Experiment, make choices and try a different approach.",
    "art",
  ],
  [
    "04",
    "Explore your interests",
    "Look back at your adventures. Let grown-ups join the conversation.",
    "helping",
  ],
];
function GamePreview({ game, onClose, onStart }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="preview-dialog"
      aria-labelledby="preview-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Close game preview"
      >
        <X size={22} />
      </button>
      <div className="preview-dialog__art">
        <GameArtwork game={game} />
        <small>ACTIVITY ILLUSTRATION</small>
      </div>
      <div className="preview-dialog__copy">
        <p className="eyebrow">A LITTLE LOOK INSIDE</p>
        <h2 id="preview-title">{game.name}</h2>
        <p>{game.desc}</p>
        <ul className="check-list">
          <li>
            <Check size={17} /> Choose Easy, Moderate, Medium or Hard
          </li>
          <li>
            <Check size={17} /> Take your time and explore your own approach
          </li>
          <li>
            <Check size={17} /> Completed sessions become part of your journey
          </li>
        </ul>
        <button
          className="btn btn-primary"
          onClick={() => onStart({ gameId: game.id })}
        >
          Create an explorer to play <ArrowRight size={17} />
        </button>
        <p className="fine-print">
          Already have a Player Code? Choose Continue My Adventure on the next
          screen.
        </p>
      </div>
    </dialog>
  );
}
export function PublicHome({ onStart, onParentLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [world, setWorld] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const games = world
    ? world.games.map(getGame)
    : showAll
      ? GAME_CATALOG
      : [
          "code_robot",
          "spell_quest",
          "dream_designer",
          "photo_mission",
          "science_lab",
          "story_builder",
          "mini_entrepreneur",
        ].map(getGame);
  const exploreWorld = (item) => {
    setWorld(item);
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="public-home" id="top">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Brand />
          <nav
            className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
            aria-label="Main navigation"
          >
            {[
              ["Worlds", "#worlds"],
              ["How it works", "#how-it-works"],
              ["About us", "#about"],
              ["For parents", "#for-parents"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button
              className="mobile-parent text-button"
              onClick={onParentLogin}
            >
              Parent sign in
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="text-button parent-login"
              onClick={onParentLogin}
            >
              Parent login
            </button>
            <button
              className="btn btn-primary btn-small"
              onClick={() => onStart()}
            >
              Let’s explore <ArrowRight size={16} />
            </button>
            <button
              className="icon-button mobile-menu"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section className="atlas-hero page-width">
          <div className="atlas-hero__copy">
            <p className="pill-eyebrow">
              <span /> SMALL ADVENTURES. BIG POSSIBILITIES.
            </p>
            <h1>
              Every child has a <span>universe</span> of possibilities
              <span className="hero-asterisk" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p className="hero-description">
              Explore interests, discover growing strengths, and experience
              exciting career adventures through interactive games and
              thoughtful activity insights.
            </p>
            <div className="button-row">
              <button className="btn btn-primary" onClick={() => onStart()}>
                Start your adventure <ArrowRight size={18} />
              </button>
              <a className="btn btn-secondary" href="#worlds">
                Explore career worlds <Compass size={18} />
              </a>
            </div>
            <button
              className="hero-parent-link text-button"
              onClick={onParentLogin}
            >
              I’m a parent <ChevronRight size={16} />
            </button>
            <div className="hero-footnote">
              <span className="tiny-faces" aria-hidden="true">
                ✦ <span>☺</span> ✦
              </span>
              <p>
                For curious minds. At their own pace.
                <br />
                <strong>No locked levels. No fixed futures.</strong>
              </p>
            </div>
          </div>
          <div className="atlas-hero__visual">
            <span className="orbit-label orbit-label--one">
              <span>✧</span> A world of “what if?”
            </span>
            <UniverseIllustration />
            <div className="questy-intro">
              <QuestyMascot expression="happy" />
              <div>
                <strong>Hi, I’m Questy!</strong>
                <p>What will we discover today?</p>
              </div>
              <span aria-hidden="true">✦</span>
            </div>
            <span className="art-note">
              A LITTLE IMAGINATION GOES A LONG WAY
            </span>
          </div>
        </section>
        <div className="exploration-strip">
          <span>
            <Compass size={18} /> Follow your curiosity
          </span>
          <span>
            <Sparkles size={18} /> Make room for imagination
          </span>
          <span>
            <HeartHandshake size={18} /> Grow without pressure
          </span>
          <a href="#about">
            Meet FutureQuest <ArrowDown size={16} />
          </a>
        </div>
        <section className="section page-width about-section" id="about">
          <div>
            <SectionHeading
              eyebrow="A BIG IDEA, WITH A LITTLE PLAY"
              title="What is FutureQuest AI?"
            >
              An interactive platform where children explore their interests and
              developing skills by playing games inspired by different
              real-world activities.
            </SectionHeading>
            <p className="about-body">
              A science question today. A story tomorrow. We believe children
              deserve the space to try, wonder, change their minds, and discover
              what makes them light up.
            </p>
            <div className="purpose-note">
              <HeartHandshake size={25} />
              <strong>
                We help children explore possibilities,
                <br /> not decide their futures for them.
              </strong>
            </div>
          </div>
          <div className="about-mosaic">
            {[
              [
                "tech",
                "Try a different role",
                "Experience real-world ideas through play.",
              ],
              [
                "art",
                "Create something yours",
                "There is room for more than one answer.",
              ],
              [
                "nature",
                "Let curiosity grow",
                "Interest is a beginning, not a label.",
              ],
            ].map(([kind, title, text], index) => (
              <article
                key={kind}
                className={`mosaic-item mosaic-item--${index}`}
              >
                <WorldScene kind={kind} decorative />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section steps-section" id="how-it-works">
          <div className="page-width">
            <SectionHeading
              eyebrow="YOUR FIRST EXPEDITION STARTS HERE"
              title="A little wonder. Four simple steps."
              center
            >
              A journey children can make their own, with meaningful context for
              parents.
            </SectionHeading>
            <ol className="steps-grid">
              {STEPS.map(([number, title, text, kind]) => (
                <li key={number}>
                  <span className="step-number">{number}</span>
                  <WorldScene kind={kind} decorative />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section page-width" id="worlds">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="THE CURIOSITY ATLAS"
              title="Where will your curiosity take you?"
            >
              Nine places to begin. So many ways to think, create and explore.
            </SectionHeading>
            <span className="hand-note">
              Pick a world.
              <br />
              Find your next “what if?” ↙
            </span>
          </div>
          <div className="world-grid">
            {WORLDS.map((item, index) => (
              <article
                className="world-card"
                key={item.id}
                style={{
                  "--world-color": item.color,
                  "--world-tint": item.tint,
                  "--card-index": index,
                }}
              >
                <div className="world-card__art">
                  <span className="world-coordinate">
                    0{index + 1} / EXPLORE
                  </span>
                  <WorldScene kind={item.kind} tint={item.tint} decorative />
                </div>
                <div className="world-card__body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <small>
                    {item.games
                      .slice(0, 2)
                      .map((id) => getGame(id).name)
                      .join(" · ")}
                    {item.games.length > 2
                      ? ` + ${item.games.length - 2} more`
                      : ""}
                  </small>
                  <button
                    className="text-button"
                    onClick={() => exploreWorld(item)}
                  >
                    Explore this world <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section games-section" id="games">
          <div className="page-width">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="PLAY A LITTLE. DISCOVER A LOT."
                title="A new adventure every time."
              >
                Route a robot. Frame a photo. Dream up something entirely your
                own.
              </SectionHeading>
              <span className="catalog-count">
                {GAME_CATALOG.length}
                <small>activities in the collection</small>
              </span>
            </div>
            <div className="catalog-toolbar">
              <p>
                {world ? (
                  <>
                    <strong>{world.name}</strong> · {games.length} activities
                  </>
                ) : (
                  "A few places your adventure could begin"
                )}
              </p>
              {world ? (
                <button
                  className="text-button"
                  onClick={() => {
                    setWorld(null);
                    setShowAll(true);
                  }}
                >
                  See all games <X size={16} />
                </button>
              ) : (
                <button
                  className="text-button"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show highlights" : "See all 24 games"}{" "}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            <div className="preview-grid">
              {games.map((game) => (
                <button
                  className="game-preview"
                  key={game.id}
                  onClick={() => setPreview(game)}
                >
                  <div className="game-preview__art">
                    <GameArtwork game={game} />
                    <span className="preview-open">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                  <div className="game-preview__body">
                    <small>{gameWorld(game).category}</small>
                    <h3>{game.name}</h3>
                    <p>{game.desc}</p>
                    <span className="preview-link">
                      Take a peek <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="illustration-caption">
              Original activity illustrations. Previews describe the real games;
              they are not game screenshots.
            </p>
          </div>
        </section>
        <section className="section page-width">
          <div className="questy-feature">
            <div className="questy-feature__art">
              <div className="questy-orbit" />
              <QuestyMascot expression="encouraging" />
              <span className="questy-speech">
                “You don’t have to know.
                <br />
                You just have to wonder.”
              </span>
              <span className="questy-spark">✦</span>
            </div>
            <div>
              <p className="eyebrow">A FRIEND FOR THE WHAT-IFS</p>
              <h2>
                Meet Questy.
                <br />
                Your curiosity co-pilot.
              </h2>
              <p>
                A little encouragement when something feels new. A cheer when
                you give it a go. Questy is here for your next adventure,
                whatever you choose.
              </p>
              <div className="questy-expression-row">
                {["happy", "thinking", "celebrating", "curious"].map(
                  (expression) => (
                    <span key={expression}>
                      <QuestyMascot
                        expression={expression}
                        title={`Questy feeling ${expression}`}
                      />
                      <small>{expression}</small>
                    </span>
                  ),
                )}
              </div>
              <button className="btn btn-primary" onClick={() => onStart()}>
                Let’s go exploring <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
        <section className="section parents-section" id="for-parents">
          <div className="page-width">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="FOR THE GROWN-UPS CHEERING THEM ON"
                title="A clearer view of what sparks their interest."
              >
                Less pressure to have an answer. More reasons to start a
                conversation.
              </SectionHeading>
              <button className="btn btn-secondary" onClick={onParentLogin}>
                I’m a parent <ArrowRight size={17} />
              </button>
            </div>
            <div className="parent-promises">
              {[
                [
                  Compass,
                  "Interest is a starting point",
                  "Repeated choices can suggest an interest. A scored task offers different evidence about a developing skill. Neither defines a child.",
                ],
                [
                  Sparkles,
                  "See the story behind the insight",
                  "Review saved sessions, exploration areas and available scores. Empty areas mean there is more to explore.",
                ],
                [
                  ShieldCheck,
                  "A thoughtful account setup",
                  "Children use a nickname, age group, avatar and PIN. Parents register separately and link a Player Code. Keep account details private.",
                ],
              ].map(([Icon, title, text]) => (
                <article key={title}>
                  <Icon size={26} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="parent-conversation">
              <span>TRY ASKING</span>
              <p>“What did you enjoy about that adventure?”</p>
              <small>One good question can open a whole new world.</small>
            </div>
          </div>
        </section>
        <section className="section page-width ai-section" id="how-ai-works">
          <SectionHeading
            eyebrow="BEHIND THE LITTLE SPARKS"
            title="How the analysis works."
            center
          >
            Activity is a clue. A pattern is an invitation to explore further.
          </SectionHeading>
          <ol className="analysis-flow">
            {[
              ["01", "Game activities", "Try, choose and complete."],
              ["02", "Recorded signals", "Saved sessions and replays."],
              ["03", "Interest patterns", "Areas explored through play."],
              ["04", "Skill evidence", "Scored tasks, when available."],
              ["05", "Explore next", "Start a conversation."],
            ].map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="honesty-note">
            <Compass size={20} />
            <p>
              The current prototype uses rule-based activity summaries. It does
              not run a trained career-prediction model or determine a child’s
              future. Insights depend on the records available.
            </p>
          </div>
        </section>
        <section className="section page-width faq-section" id="faq">
          <SectionHeading
            eyebrow="A FEW THINGS YOU MIGHT WONDER"
            title="Good questions. Honest answers."
          >
            A little context before you set off.
          </SectionHeading>
          <div className="faq-list">
            {FAQS.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="page-width final-invitation">
          <div>
            <p className="eyebrow">THE NEXT CHAPTER IS YOURS</p>
            <h2>
              Big possibilities start
              <br />
              with a little curiosity.
            </h2>
            <p>You don’t need a plan for the future. Just a place to begin.</p>
            <button className="btn btn-sun" onClick={() => onStart()}>
              Start your adventure <ArrowRight size={18} />
            </button>
          </div>
          <UniverseIllustration />
        </section>
      </main>
      <footer className="site-footer page-width">
        <Brand />
        <p>For curious minds and the possibilities ahead.</p>
        <nav aria-label="Footer navigation">
          <a href="#about">About us</a>
          <a href="#how-ai-works">How AI works</a>
          <a href="#faq">FAQ</a>
          <button className="text-button" onClick={onParentLogin}>
            For parents
          </button>
        </nav>
        <small>
          © {new Date().getFullYear()} FutureQuest AI · Keep exploring.
        </small>
      </footer>
      {preview && (
        <GamePreview
          game={preview}
          onClose={() => setPreview(null)}
          onStart={onStart}
        />
      )}
    </div>
  );
}
