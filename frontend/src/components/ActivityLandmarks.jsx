import React from "react";
// Companion scenes in the same ink, pastel and floating-island style as the atlas.
export function ActivityLandmark({ kind }) {
  const ink = "#30385f";
  if (kind === "fashion")
    return (
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <path
          d="M111 35q14 17 28 0l17 15-14 25 20 38H90l20-38-15-25z"
          fill="#ccaddd"
        />
        <path d="M111 35l3 24h24l1-24" fill="#f9edf5" />
        <path d="M110 75h32" stroke="#fff3e4" strokeWidth="7" />
        <path d="M184 58v51h-17V68" fill="#f4d391" />
        <path d="M173 72h11m-6 10h6m-11 10h11m-6 10h6" strokeWidth="2" />
        <path d="M62 112V49m-11 0h22" fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === "music")
    return (
      <g
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M78 111V60l63-15v53" fill="none" strokeWidth="6" />
        <ellipse cx="65" cy="111" rx="16" ry="10" fill="#b2a0d2" />
        <ellipse cx="128" cy="99" rx="16" ry="10" fill="#b2a0d2" />
        <path d="M79 76l62-14" strokeWidth="6" />
        <rect x="160" y="83" width="39" height="31" rx="5" fill="#eac08b" />
        <path d="M161 92h38m-32 0v21m9-21v21m9-21v21m9-21v21" strokeWidth="2" />
        <path
          d="M177 63l15-17m-10 21 17-10"
          fill="none"
          stroke="#9fc4bd"
          strokeWidth="5"
        />
      </g>
    );
  if (kind === "cooking")
    return (
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <ellipse cx="126" cy="108" rx="50" ry="15" fill="#f8f5e9" />
        <ellipse cx="126" cy="108" rx="34" ry="9" fill="#cce0cf" />
        <path
          d="M103 86V64q-20-3-11-19 8-10 19-3 10-21 25-7 21-5 26 10t-14 19v22z"
          fill="#fffdf5"
        />
        <path d="M105 76h41m-27-28v18m14-20v20" stroke="#d9d7e1" />
        <path
          d="M63 80v37m-8-54v19h16V63m-8 0v19m124-19v54m0-54q14 10 0 24"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  if (kind === "room")
    return (
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <path d="M76 64h99v47H76z" fill="#e3d0e6" />
        <rect x="66" y="78" width="119" height="28" rx="7" fill="#b7a2d0" />
        <path d="M80 107v12m92-12v12" strokeWidth="5" />
        <rect x="83" y="68" width="30" height="22" rx="5" fill="#fff0ce" />
        <rect x="124" y="68" width="30" height="22" rx="5" fill="#c0d9d6" />
        <path
          d="M191 68h23l-6-25h-12zM202 69v43m-10 0h20"
          fill="#f4d18d"
          strokeLinecap="round"
        />
        <path
          d="M54 109V72m0 13q-16-18-14-27 17 7 14 27m0 7q17-16 18-28-18 4-18 28"
          fill="#a7c6a0"
          stroke="#668a67"
        />
        <path d="M44 108h21l-3 14H47z" fill="#e9b69e" />
      </g>
    );
  return null;
}
