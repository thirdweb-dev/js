import { useId } from "react";

export function ContractModularContractIcon(props: { className?: string }) {
  const linearGradientId = useId();
  const filterId = useId();

  return (
    <svg
      className={props.className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>modular contracts</title>
      <rect
        fill={`url(#${linearGradientId})`}
        height="10"
        rx="1.5"
        width="10"
        x="7"
        y="3"
      />
      <g filter={`url(#${filterId})`}>
        <rect
          fill="#EBA4D2"
          fillOpacity="0.8"
          height="10"
          rx="1.5"
          width="18"
          x="3"
          y="11"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="14"
          id={filterId}
          width="22"
          x="1"
          y="9"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_195_4064"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_195_4064"
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
            result="effect2_innerShadow_195_4064"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="3.1486"
          x2="16.0459"
          y1="11.4658"
          y2="0.531421"
        >
          <stop stopColor="#F4009F" />
          <stop offset="1" stopColor="#F856C8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
