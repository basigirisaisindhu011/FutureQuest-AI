import React from "react";

export function QuestyArtwork({ expression = "happy" }) {
  return (
    <g stroke="#5267a8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 23V13" fill="none" strokeWidth="6" />
      <circle cx="60" cy="10" r="7" fill="#ffb85d" strokeWidth="4" />
      <rect
        x="16"
        y="25"
        width="88"
        height="86"
        rx="28"
        fill="#e7f2ff"
        strokeWidth="5"
      />
      <rect
        x="25"
        y="42"
        width="70"
        height="51"
        rx="17"
        fill="#334774"
        stroke="none"
      />
      {expression === "celebrating" ? (
        <path
          d="M37 64q7-12 14 0m18 0q7-12 14 0"
          fill="none"
          stroke="#86f4de"
          strokeWidth="4"
        />
      ) : (
        <>
          <ellipse
            cx="44"
            cy="63"
            rx="5"
            ry={expression === "curious" ? 10 : 8}
            fill="#86f4de"
            stroke="none"
          />
          {expression === "encouraging" ? (
            <path
              d="M70 64q6-7 12 0"
              fill="none"
              stroke="#86f4de"
              strokeWidth="4"
            />
          ) : (
            <ellipse
              cx="76"
              cy="63"
              rx="5"
              ry="8"
              fill="#86f4de"
              stroke="none"
            />
          )}
        </>
      )}
      <path
        d={expression === "thinking" ? "M51 81h18" : "M47 78q13 11 26 0"}
        fill="none"
        stroke="#f5c56d"
        strokeWidth="4"
      />
      <path d="M60 112v8" fill="none" strokeWidth="6" />
      <rect
        x="35"
        y="118"
        width="50"
        height="31"
        rx="12"
        fill="#a8d8f2"
        strokeWidth="5"
      />
      <path
        d="M31 125l-12 9m70-9 12-9M46 150v10m28-10v10"
        fill="none"
        strokeWidth="7"
      />
      <path
        d="M42 135h36"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity=".8"
      />
    </g>
  );
}

export function QuestyMascot({
  className = "",
  title = "Questy, your friendly adventure guide",
  expression = "happy",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 170"
      role="img"
      aria-label={title}
    >
      <QuestyArtwork expression={expression} />
    </svg>
  );
}
