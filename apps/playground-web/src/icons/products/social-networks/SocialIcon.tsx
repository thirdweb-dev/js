export function SocialIcon(props: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <title>Social Networks</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.59027 8.53426C4.93342 8.53426 3.59027 9.8774 3.59027 11.5343V15.5343C3.59027 16.6417 4.19032 17.609 5.08303 18.1287C4.82081 18.6096 4.44087 19.1246 3.88841 19.6093C3.49875 19.9513 3.68292 20.5997 4.18954 20.4898C5.4482 20.2166 6.88438 19.6184 8.00756 18.5343H13.6009C15.2577 18.5343 16.6009 17.1911 16.6009 15.5343V11.5343C16.6009 9.8774 15.2577 8.53426 13.6009 8.53426H6.59027Z"
        fill="url(#paint0_linear_817_95)"
      />
      <g filter="url(#filter0_i_817_95)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.5728 3.49785C9.9159 3.49785 8.57275 4.84099 8.57275 6.49785V10.1561C8.57275 11.8129 9.9159 13.1561 11.5728 13.1561H17.1745C18.2957 14.2321 19.7254 14.8265 20.979 15.0986C21.4857 15.2086 21.6698 14.5601 21.2802 14.2182C20.7335 13.7385 20.3557 13.2293 20.0938 12.7527C20.9886 12.2335 21.5903 11.265 21.5903 10.1561V6.49785C21.5903 4.84099 20.2471 3.49785 18.5903 3.49785H11.5728Z"
          fill="#B9DDFF"
          fill-opacity="0.8"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_817_95"
          x="8.57275"
          y="3.49785"
          width="13.0175"
          height="11.7132"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
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
            result="effect1_innerShadow_817_95"
          />
        </filter>
        <linearGradient
          id="paint0_linear_817_95"
          x1="14.0222"
          y1="13.5478"
          x2="3.57389"
          y2="16.9919"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2567FF" />
          <stop offset="1" stop-color="#22A7FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
