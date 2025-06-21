import { useId } from "react";

export function InfraStorageIcon(props: { className?: string }) {
  const filterId = useId();
  const linearGradientId = useId();

  return (
    <svg
      className={props.className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>storage</title>
      <circle
        cx="7.60706"
        cy="12.5001"
        fill={`url(#${linearGradientId})`}
        r="4.60706"
      />
      <g filter={`url(#${filterId})`}>
        <path
          clipRule="evenodd"
          d="M21 7.36067C20.9998 4.95232 18.2081 3 14.7644 3C11.3206 3 8.52887 4.95242 8.52887 7.36085C8.52887 7.36402 8.52887 7.36718 8.52888 7.37035V16.639C8.52888 16.6391 8.52888 16.6391 8.52888 16.6392C8.52888 19.0476 11.3206 21 14.7644 21C18.2082 21 21 19.0476 21 16.6392C21 16.6391 21 16.6391 21 16.639V7.36067H21Z"
          fill="#BFB5FF"
          fillOpacity="0.8"
          fillRule="evenodd"
        />
      </g>
      <path
        d="M10.6782 9.802V9.802C13.1432 11.482 16.3855 11.482 18.8505 9.80197V9.80197"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.6782 14.5669V14.5669C13.1432 16.2469 16.3855 16.2469 18.8505 14.5669V14.5669"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="22"
          id={filterId}
          width="16.4711"
          x="6.52887"
          y="1"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_195_4078"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_195_4078"
            mode="normal"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.2" />
          <feGaussianBlur stdDeviation="0.05" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            in2="shape"
            mode="normal"
            result="effect2_innerShadow_195_4078"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="4.5433"
          x2="21.7601"
          y1="15.4442"
          y2="9.49462"
        >
          <stop stopColor="#3F2DAF" />
          <stop offset="1" stopColor="#917FFB" />
        </linearGradient>
      </defs>
    </svg>
  );
}
