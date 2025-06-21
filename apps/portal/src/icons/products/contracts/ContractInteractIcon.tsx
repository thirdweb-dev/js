import { useId } from "react";

export function ContractInteractIcon(props: { className?: string }) {
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
      <title>contract interaction</title>
      <path
        d="M3.66284 8.02624V4.9941C3.66284 3.30429 5.62864 2.37603 6.93354 3.44965L19.6081 13.8777C20.0698 14.2576 20.3374 14.8242 20.3374 15.4221V18.8923C20.3374 20.6011 18.3329 21.5229 17.0356 20.4107L4.36111 9.54463C3.91791 9.16466 3.66284 8.61002 3.66284 8.02624Z"
        fill={`url(#${linearGradientId})`}
      />
      <g filter={`url(#${filterId})`}>
        <path
          d="M20.3372 8.02624V4.9941C20.3372 3.30429 18.3714 2.37603 17.0665 3.44965L4.39195 13.8777C3.93019 14.2576 3.66265 14.8242 3.66265 15.4221V18.8923C3.66265 20.6011 5.66708 21.5229 6.96439 20.4107L19.6389 9.54463C20.0821 9.16466 20.3372 8.61002 20.3372 8.02624Z"
          fill="#EBA4D2"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="21.9059"
          id={filterId}
          width="20.6745"
          x="1.66265"
          y="0.990295"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_195_4132"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_195_4132"
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
            result="effect2_innerShadow_195_4132"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="-2.75917"
          x2="23.7308"
          y1="19.7919"
          y2="3.1356"
        >
          <stop stopColor="#F4009F" />
          <stop offset="1" stopColor="#F856C8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
