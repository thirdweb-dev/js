import { useId } from "react";

export function ContractExploreIcon(props: { className?: string }) {
  const filterId = useId();
  const linearGradientId = useId();
  const clipPathId = useId();

  return (
    <svg
      className={props.className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>explore</title>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M10.9709 11.527C11.4283 10.7348 12.5718 10.7348 13.0292 11.527L17.4763 19.2296C17.9337 20.0218 17.3619 21.0121 16.4471 21.0121H7.55296C6.63816 21.0121 6.06641 20.0218 6.52381 19.2296L10.9709 11.527Z"
          fill={`url(#${linearGradientId})`}
        />
        <g filter={`url(#${filterId})`}>
          <circle
            cx="12.0001"
            cy="10.25"
            fill="#EBA4D2"
            fillOpacity="0.8"
            r="7.25"
          />
        </g>
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="18.5"
          id={filterId}
          width="18.5"
          x="2.75006"
          y="1"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_195_3911"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_195_3911"
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
            result="effect2_innerShadow_195_3911"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="-1.29787"
          x2="18.0785"
          y1="22.463"
          y2="6.03583"
        >
          <stop stopColor="#F4009F" />
          <stop offset="1" stopColor="#F856C8" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
}
