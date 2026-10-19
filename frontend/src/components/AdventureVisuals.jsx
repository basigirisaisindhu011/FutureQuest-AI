import React, { useId } from "react";
import { Compass, ArrowRight, AlertCircle, RotateCcw } from "lucide-react";
import { QuestyArtwork, QuestyMascot } from "./QuestyMascot";
import { ActivityLandmark } from "./ActivityLandmarks";

export function Brand({ onClick, light = false }) {
  return (
    <a
      className={`brand ${light ? "brand--light" : ""}`}
      href="#top"
      onClick={onClick}
    >
      <span className="brand-mark">
        <Compass size={22} />
      </span>
      <span>
        FutureQuest<span className="brand-ai"> AI</span>
        <small>A WORLD OF POSSIBILITIES</small>
      </span>
    </a>
  );
}
export function SectionHeading({ eyebrow, title, children, center = false }) {
  return (
    <div
      className={`section-heading ${center ? "section-heading--center" : ""}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

// Original code-native artwork. The same shapes and palette connect every environment.
function Landmark({ kind }) {
  const ink = "#30385f";
  if (["fashion", "music", "cooking", "room"].includes(kind)) {
    return <ActivityLandmark kind={kind} />;
  }
  if (kind === "tech")
    return (
      <g>
        <path
          d="M91 113V60l35-19 35 19v53"
          fill="#c8ddff"
          stroke={ink}
          strokeWidth="3"
        />
        <path d="M111 111V77h30v34" fill="#648bed" />
        <path d="M126 43V25m-9 0h18" stroke={ink} strokeWidth="4" />
        <rect x="102" y="60" width="48" height="13" rx="5" fill="#fff" />
        <circle cx="114" cy="66" r="3" fill="#7795d8" />
        <circle cx="138" cy="66" r="3" fill="#7795d8" />
        <path d="M68 96h20m78 0h19" stroke={ink} strokeWidth="4" />
        <circle cx="62" cy="96" r="8" fill="#ffc878" />
        <circle cx="191" cy="96" r="8" fill="#ffc878" />
      </g>
    );
  if (kind === "science")
    return (
      <g>
        <path
          d="M95 111V78a31 31 0 0162 0v33"
          fill="#f9fffc"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M93 77a33 33 0 0166 0z"
          fill="#4ba9ad"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M126 44V31m0 0l31-18 9 15-32 18"
          stroke={ink}
          strokeWidth="4"
          fill="#b4e9de"
        />
        <path d="M115 111V91h22v20" fill="#b1dfe5" />
        <path
          d="M62 77v14l-12 20q10 11 26 0L64 91V77"
          fill="#f9cf76"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M181 78v16l-8 17h25l-9-17V78"
          fill="#9ce5db"
          stroke={ink}
          strokeWidth="3"
        />
      </g>
    );
  if (kind === "nature" || kind === "helping")
    return (
      <g>
        <path d="M82 117V71m82 46V64" stroke="#876a53" strokeWidth="7" />
        <path d="M54 91l28-60 28 60z" fill="#75af7b" />
        <path d="M134 83l30-62 30 62z" fill="#579d78" />
        <path d="M80 72l-20 34h44z" fill="#4e9568" />
        <path d="M145 65l-16 31h70l-17-31" fill="#579d78" />
        {kind === "helping" ? (
          <g>
            <path
              d="M96 113V77l29-20 29 20v36"
              fill="#fff6e2"
              stroke={ink}
              strokeWidth="3"
            />
            <path d="M118 83h14v25h-14z" fill="#dfa884" />
            <path
              d="M111 63q-10-14 0-20t14 6q5-12 14-6t0 20l-14 12z"
              fill="#e68f8e"
            />
          </g>
        ) : (
          <g>
            <path d="M107 118q7-27 22-34" stroke="#82b4df" strokeWidth="16" />
            <path d="M111 109l33 2" stroke="#fff" strokeWidth="2" />
            <circle cx="119" cy="63" r="9" fill="#fff4bd" />
          </g>
        )}
      </g>
    );
  if (kind === "business" || kind === "engineering")
    return (
      <g>
        <path
          d="M80 111V62h91v49"
          fill="#fff6e4"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M74 62l11-23h80l11 23z"
          fill="#eea278"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M93 40v22m22-22v22m22-22v22m22-22v22"
          stroke="#fff4e0"
          strokeWidth="9"
        />
        <path d="M94 87h61v23H94z" fill="#d3e2df" />
        {kind === "engineering" ? (
          <g>
            <path
              d="M184 110V39h-46m14 0v-9h43v14"
              stroke={ink}
              strokeWidth="4"
              fill="none"
            />
            <path d="M155 42v22" stroke={ink} strokeWidth="3" />
            <rect
              x="145"
              y="65"
              width="21"
              height="19"
              rx="3"
              fill="#d0adf1"
              stroke={ink}
              strokeWidth="2"
            />
          </g>
        ) : (
          <g>
            <circle
              cx="124"
              cy="85"
              r="11"
              fill="#f4c35f"
              stroke={ink}
              strokeWidth="2"
            />
            <path d="M124 78v14m-4-11h6m-6 8h7" stroke={ink} strokeWidth="2" />
            <path d="M58 113V86m-9 14h18" stroke="#7eaa83" strokeWidth="5" />
          </g>
        )}
      </g>
    );
  if (kind === "photo")
    return (
      <g>
        <rect
          x="74"
          y="61"
          width="105"
          height="55"
          rx="12"
          fill="#f6f3ff"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M89 61l8-17h39l8 17"
          fill="#9c8ad3"
          stroke={ink}
          strokeWidth="3"
        />
        <circle
          cx="125"
          cy="87"
          r="24"
          fill="#829ed8"
          stroke={ink}
          strokeWidth="3"
        />
        <circle cx="125" cy="87" r="15" fill="#bfebed" />
        <path
          d="M116 83l9-7"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="163" cy="73" r="4" fill="#efbd72" />
      </g>
    );
  if (kind === "media")
    return (
      <g>
        <rect
          x="75"
          y="52"
          width="102"
          height="62"
          rx="8"
          fill="#fff4f4"
          stroke={ink}
          strokeWidth="3"
        />
        <path
          d="M75 65h102m-84-12 8 12m17-12 8 12m18-12 8 12"
          stroke={ink}
          strokeWidth="4"
        />
        <path d="M112 78l25 13-25 13z" fill="#dc7e9b" />
        <path
          d="M190 77v30m-7-26q7 9 14 0m-7 26v8m-8 0h16"
          stroke={ink}
          strokeWidth="3"
        />
        <rect
          x="184"
          y="63"
          width="12"
          height="20"
          rx="6"
          fill="#e7b474"
          stroke={ink}
          strokeWidth="2"
        />
      </g>
    );
  return (
    <g>
      <path
        d="M91 111V57l35-23 35 23v54"
        fill="#ece0fc"
        stroke={ink}
        strokeWidth="3"
      />
      <path
        d="M101 54l9-26 11 26m12 0 10-26 10 26"
        fill="#ac86d3"
        stroke={ink}
        strokeWidth="2"
      />
      <path d="M114 111V82q12-15 24 0v29" fill="#bf9edc" />
      <path
        d="M63 105q-25-3-17-22t32-15 6 24q-1 7-10 1t-11 12"
        fill="#f7c67a"
        stroke={ink}
        strokeWidth="2"
      />
      <circle cx="59" cy="80" r="4" fill="#e68b91" />
      <circle cx="74" cy="79" r="4" fill="#7aa7ce" />
      <path
        d="M178 108l13-44 6 2-11 44"
        fill="#86b9b4"
        stroke={ink}
        strokeWidth="2"
      />
    </g>
  );
}
export function WorldScene({
  kind = "tech",
  tint = "#e8efff",
  className = "",
  title,
  decorative = false,
}) {
  return (
    <svg
      viewBox="0 0 250 165"
      className={`world-scene ${className}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={title || `${kind} world illustration`}
    >
      <ellipse cx="126" cy="145" rx="78" ry="7" fill="#30385f" opacity=".07" />
      <circle cx="126" cy="79" r="69" fill={tint} />
      <path d="M37 114q90-26 178 0l-29 24-63 15-60-15z" fill="#b2bbc8" />
      <path d="M37 114q90-26 178 0-28 33-90 15-58 16-88-15" fill="#f9f6ee" />
      <path
        d="M65 135l18 4m77 3 19-5"
        stroke="#e3e7ed"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Landmark kind={kind} />
      <path
        d="M34 49l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM207 30l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"
        fill="#f5c26f"
      />
      <circle cx="199" cy="79" r="3" fill="#a5acc8" />
    </svg>
  );
}
export function UniverseIllustration({ className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`universe-art ${className}`}
      viewBox="0 0 700 590"
      role="img"
      aria-labelledby={`${id}-title`}
    >
      <title id={`${id}-title`}>
        Questy and two young explorers visit floating worlds of science, art and
        technology
      </title>
      <defs>
        <radialGradient id={id}>
          <stop stopColor="#e2e5ff" />
          <stop offset="1" stopColor="#f9f8fe" />
        </radialGradient>
      </defs>
      <circle cx="364" cy="278" r="255" fill={`url(#${id})`} />
      <ellipse
        cx="362"
        cy="288"
        rx="285"
        ry="186"
        fill="none"
        stroke="#cfd1ea"
        strokeDasharray="4 10"
        transform="rotate(-18 362 288)"
      />
      <circle cx="550" cy="81" r="29" fill="#f6cb8b" />
      <ellipse
        cx="550"
        cy="81"
        rx="46"
        ry="10"
        fill="none"
        stroke="#ddaf6d"
        strokeWidth="6"
        transform="rotate(-25 550 81)"
      />
      <circle cx="123" cy="153" r="11" fill="#b2a5e0" />
      <path
        d="M97 350l5 12 13 5-13 5-5 13-5-13-13-5 13-5M449 57l4 10 10 4-10 4-4 10-4-10-10-4 10-4M617 330l5 11 11 5-11 4-5 12-4-12-12-4 12-5"
        fill="#eeb960"
      />
      <svg x="76" y="52" width="234" height="176" viewBox="0 0 250 165">
        <WorldScene kind="science" tint="#dff2ed" decorative />
      </svg>
      <svg x="436" y="145" width="242" height="181" viewBox="0 0 250 165">
        <WorldScene kind="art" tint="#f2e4f7" decorative />
      </svg>
      <svg x="377" y="376" width="242" height="181" viewBox="0 0 250 165">
        <WorldScene kind="tech" tint="#e2ecff" decorative />
      </svg>
      <svg x="17" y="229" width="143" height="108" viewBox="0 0 250 165">
        <WorldScene kind="photo" tint="#e8e6f7" decorative />
      </svg>
      <path d="M130 397q128-54 265-14l31 33-139 58-143-25z" fill="#a2b9b4" />
      <ellipse cx="273" cy="398" rx="146" ry="43" fill="#dce8cb" />
      <path
        d="M204 422q61-29 128-8"
        fill="none"
        stroke="#f8f2df"
        strokeWidth="12"
      />
      <svg x="237" y="228" width="125" height="177" viewBox="0 0 120 170">
        <QuestyArtwork expression="curious" />
      </svg>
      <g
        stroke="#30385f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M183 355l-7 43m26-44 11 43" strokeWidth="9" />
        <path d="M180 312l-15 45h47l-11-45" fill="#f3b877" />
        <path
          d="M178 322l-15 23m41-22 21-14"
          fill="none"
          stroke="#c79072"
          strokeWidth="8"
        />
        <circle cx="192" cy="293" r="17" fill="#dca37d" />
        <path d="M175 292q-4-26 20-23 21 5 13 25l-10-16z" fill="#353456" />
        <circle cx="195" cy="294" r="2" fill="#30385f" stroke="none" />
        <path d="M371 360l-6 42m24-42 10 38" strokeWidth="9" />
        <path d="M368 316l-8 44h41l-9-44" fill="#a99ad8" />
        <circle cx="381" cy="297" r="17" fill="#b77f61" />
        <path d="M365 298q-7-30 19-25 21 3 13 26l-10-15-21 5" fill="#2e3047" />
        <path
          d="M366 324l-13-11m40 13 21-15"
          stroke="#b77f61"
          strokeWidth="8"
          fill="none"
        />
        <circle cx="386" cy="298" r="2" fill="#30385f" stroke="none" />
        <path d="M399 304l22-8 5 17-21 6z" fill="#fcf4dd" />
      </g>
      <path
        d="M226 412l-7-25m-3 11-7-11m12 5 8-11"
        stroke="#769f7e"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="330" cy="174" r="6" fill="#f3be83" />
      <circle cx="621" cy="415" r="6" fill="#9ec7b0" />
      <path d="M330 470l3 7 8 3-8 3-3 8-3-8-8-3 8-3" fill="#c0afd9" />
    </svg>
  );
}
export function GameArtwork({ game, className = "" }) {
  const specific = {
    fashion_studio: "fashion",
    music_maker: "music",
    junior_chef: "cooking",
    interior_designer: "room",
  };
  const kind =
    specific[game.id] ||
    (/photo/.test(game.id)
      ? "photo"
      : /science|data/.test(game.id)
        ? "science"
        : /robot|puzzle/.test(game.id)
          ? "tech"
          : /business|entrepreneur|money/.test(game.id)
            ? "business"
            : /city|invent/.test(game.id)
              ? "engineering"
              : /eco/.test(game.id)
                ? "nature"
                : /story|speak|director|spell/.test(game.id)
                  ? "media"
                  : "art");
  return (
    <WorldScene
      kind={kind}
      tint={`${game.color}15`}
      className={className}
      title={`${game.name} activity illustration`}
    />
  );
}
export function BadgeArtwork({ className = "" }) {
  return (
    <svg
      viewBox="0 0 160 150"
      className={`badge-art ${className}`}
      role="img"
      aria-label="Explorer star badge illustration"
    >
      <path d="M49 91l-8 50 39-18 38 18-8-50" fill="#8f83d0" />
      <circle
        cx="80"
        cy="64"
        r="48"
        fill="#f5d397"
        stroke="#e5b564"
        strokeWidth="5"
      />
      <circle
        cx="80"
        cy="64"
        r="36"
        fill="#fff1ce"
        stroke="#e5b564"
        strokeWidth="2"
        strokeDasharray="3 5"
      />
      <path
        d="M80 39l8 17 19 3-14 14 3 19-16-9-17 9 4-19-14-14 19-3z"
        fill="#d29632"
      />
      <path
        d="M26 27l-7-7m117 18 9-3M28 106l-8 5"
        stroke="#c9a5cc"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function LoadingState({ label = "Loading your adventure…" }) {
  return (
    <div className="state-panel" role="status">
      <QuestyMascot expression="thinking" />
      <p>{label}</p>
      <div className="skeleton" />
      <div className="skeleton skeleton--short" />
    </div>
  );
}
export function ErrorState({ message, onRetry, onLogout }) {
  return (
    <div className="state-panel error-panel" role="alert">
      <AlertCircle size={32} />
      <h2>Let’s reconnect</h2>
      <p>{message}</p>
      <div className="button-row">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            <RotateCcw size={16} /> Try again
          </button>
        )}
        {onLogout && (
          <button className="btn btn-secondary" onClick={onLogout}>
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}
export function EmptyState({ title, children, action, onAction }) {
  return (
    <div className="empty-state">
      <WorldScene kind="nature" decorative />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
        {action && (
          <button className="text-button" onClick={onAction}>
            {action} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
export function GameCelebration({
  game,
  level,
  result,
  onBack,
  replay,
  children,
}) {
  return (
    <main className="game-celebration animate-fade-in">
      {result?.saveFailed ? (
        <>
          <QuestyMascot expression="thinking" className="celebration-questy" />
          <p className="eyebrow">A LITTLE CONNECTION HICCUP</p>
          <h1>Progress not saved</h1>
          <p>
            Your adventure couldn’t reach the server. No saved reward has been
            confirmed. Try again when you’re connected.
          </p>
        </>
      ) : (
        <>
          <div className="celebration-art">
            <BadgeArtwork />
            <QuestyMascot expression="celebrating" />
          </div>
          <p className="eyebrow">ANOTHER POSSIBILITY EXPLORED</p>
          <h1>Adventure complete</h1>
          <p>
            {game.name} · {level[0] + level.slice(1).toLowerCase()}
          </p>
          <div className="xp-reward">
            +{result?.xpEarned ?? 0} <span>XP saved</span>
          </div>
          <p>
            Your adventure is now part of your journey. What would you like to
            try next?
          </p>
          {children}
        </>
      )}
      <div className="button-row">
        {replay && !result?.saveFailed && (
          <button className="btn btn-primary" onClick={replay}>
            <RotateCcw size={17} /> Play again
          </button>
        )}
        <button className="btn btn-secondary" onClick={game.onChooseAnother || onBack}>
          Choose another game <ArrowRight size={17} />
        </button>
      </div>
    </main>
  );
}
