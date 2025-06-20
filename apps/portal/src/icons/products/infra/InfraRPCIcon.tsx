import { useId } from "react";

export function InfraRPCIcon(props: { className?: string }) {
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
      <title>rpc</title>
      <rect
        fill={`url(#${linearGradientId})`}
        height="8.99854"
        rx="1.5"
        width="8.99854"
        x="12.0015"
        y="12.5007"
      />
      <g filter={`url(#${filterId})`}>
        <path
          d="M5 18C3.89543 18 3 17.1046 3 16L3 5C3 3.89543 3.89543 3 5 3L16 3C17.1046 3 18 3.89543 18 5L18 16C18 17.1046 17.1046 18 16 18L5 18Z"
          fill="#BFB5FF"
          fillOpacity="0.8"
        />
      </g>
      <path
        d="M6.10608 9.20007C7.27946 8.04993 8.85702 7.4057 10.5001 7.4057C12.1431 7.4057 13.7207 8.04993 14.8941 9.20007"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.30289 11.3971C8.88958 10.822 9.67836 10.4999 10.4999 10.4999C11.3214 10.4999 12.1102 10.822 12.6969 11.3971"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 13.5941H10.5058"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="15.2764"
          id={filterId}
          width="15"
          x="3"
          y="3"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.276368" />
          <feGaussianBlur stdDeviation="0.138184" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            in2="shape"
            mode="normal"
            result="effect1_innerShadow_195_3994"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="13.5087"
          x2="30.3227"
          y1="19.8752"
          y2="14.0648"
        >
          <stop stopColor="#3F2DAF" />
          <stop offset="1" stopColor="#917FFB" />
        </linearGradient>
      </defs>
    </svg>
  );
}
