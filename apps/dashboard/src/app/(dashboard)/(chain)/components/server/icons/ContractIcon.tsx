export function ContractIcon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Contract</title>
      <g>
        <rect
          x="3"
          y="21"
          width="14.9988"
          height="10.6499"
          rx="1.5"
          transform="rotate(-90 3 21)"
          fill="url(#paint0_linear_281_45147)"
        />
        <g filter="url(#filter0_bi_281_45147)">
          <path
            d="M7.39429 4.5C7.39429 3.67157 8.06586 3 8.89429 3H19.5C20.3285 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3285 21 19.5 21H8.89429C8.06586 21 7.39429 20.3284 7.39429 19.5V4.5Z"
            fill="#EBA4D2"
            fillOpacity="0.8"
          />
        </g>
        <path
          d="M11.1971 7L17.1971 7.0001"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11.1971 10L14.1971 10.0001"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_bi_281_45147"
          x="5.39429"
          y="1"
          width="17.6057"
          height="22"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_281_45147"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_281_45147"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.2" />
          <feGaussianBlur stdDeviation="0.05" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_281_45147"
          />
        </filter>
        <linearGradient
          id="paint0_linear_281_45147"
          x1="-2.77663"
          y1="30.016"
          x2="10.9305"
          y2="13.6496"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4009F" />
          <stop offset="1" stopColor="#F856C8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
