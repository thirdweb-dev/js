import { useId } from "react";

export function ContractPublishIcon(props: { className?: string }) {
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
      <title>publish contract</title>
      <path
        d="M5.64838 4.5C5.64838 3.67157 6.31995 3 7.14838 3H16.8411C18.0294 3 18.7459 4.31597 18.101 5.31406L8.40826 20.315C7.59677 21.571 5.64838 20.9963 5.64838 19.501V4.5Z"
        fill="url(#paint0_linear_195_3964)"
      />
      <g filter="url(#filter0_bi_195_3964)">
        <path
          d="M18.3516 4.5C18.3516 3.67157 17.6801 3 16.8516 3H7.15889C5.97057 3 5.2541 4.31597 5.899 5.31406L15.5917 20.315C16.4032 21.571 18.3516 20.9963 18.3516 19.501V4.5Z"
          fill="#EBA4D2"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="22.0037"
          id={filterId}
          width="16.6952"
          x="3.65643"
          y="1"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_195_3964"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_195_3964"
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
            result="effect2_innerShadow_195_3964"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="0.758951"
          x2="21.4914"
          y1="18.2415"
          y2="5.84722"
        >
          <stop stopColor="#F4009F" />
          <stop offset="1" stopColor="#F856C8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
