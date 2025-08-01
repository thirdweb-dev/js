import { useId } from "react";

function prefixId(id: string, prefix?: string) {
  return prefix ? `${prefix}_${id}` : id;
}

export function ThirdwebMiniLogo(props: {
  className?: string;
  isMonoChrome?: boolean;
}) {
  const id = useId();
  return (
    <svg className={props.className} fill="none" viewBox="0 0 516 321">
      <title>thirdweb</title>
      <g clipPath={`url(#${prefixId("clip0_3:35)", id)}`}>
        <path
          d="M1.40497 27.0011C-3.73633 14.022 5.84519 0 19.8669 0H106.919C115.098 0 122.342 4.86715 125.381 12.3996L194.671 185.299C196.541 189.935 196.541 195.149 194.671 199.901L151.087 308.484C144.427 325.056 120.823 325.056 114.163 308.484L1.40497 27.0011Z"
          fill={
            props.isMonoChrome
              ? "currentColor"
              : `url(#${prefixId("paint0_linear_3:35)", id)}`
          }
        />
        <path
          d="M169.547 26.4217C164.873 13.5585 174.454 0 188.242 0H264.077C272.49 0 279.968 5.2148 282.772 12.9791L345.753 185.879C347.272 190.166 347.272 194.918 345.753 199.321L307.894 303.27C301.585 320.652 276.813 320.652 270.503 303.27L169.547 26.4217Z"
          fill={
            props.isMonoChrome
              ? "currentColor"
              : `url(#${prefixId("paint1_linear_3:35)", id)}`
          }
        />
        <path
          d="M321.331 27.0011C316.19 14.022 325.771 0 339.793 0H426.845C435.024 0 442.269 4.86715 445.307 12.3996L514.597 185.299C516.467 189.935 516.467 195.149 514.597 199.901L471.013 308.484C464.353 325.056 440.75 325.056 434.089 308.484L321.331 27.0011Z"
          fill={
            props.isMonoChrome
              ? "currentColor"
              : `url(#${prefixId("paint2_linear_3:35)", id)}`
          }
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={prefixId("paint0_linear_3:35", id)}
          x1="7.40492"
          x2="260.485"
          y1="55.24"
          y2="164.437"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={prefixId("paint1_linear_3:35", id)}
          x1="175.093"
          x2="410.968"
          y1="54.447"
          y2="148.471"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={prefixId("paint2_linear_3:35", id)}
          x1="327.331"
          x2="580.411"
          y1="55.24"
          y2="164.437"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset="1" stopColor="#5204BF" />
        </linearGradient>
        <clipPath id={prefixId("clip0_3:35", id)}>
          <rect fill="white" height="321" width="516" />
        </clipPath>
      </defs>
    </svg>
  );
}
