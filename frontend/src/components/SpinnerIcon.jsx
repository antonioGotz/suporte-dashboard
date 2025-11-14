import React from 'react';

export default function SpinnerIcon({ style }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      style={style}
      aria-hidden="true"
    >
      <g>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(148,163,184,.4)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="rgba(148,163,184,1)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}
