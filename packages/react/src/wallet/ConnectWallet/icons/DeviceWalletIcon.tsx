import { IconFC } from "./types";

export const DeviceWalletIcon: IconFC = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_903_3342)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.086302 1.68277C-0.232625 0.873883 0.361739 0 1.23154 0H6.63155C7.13894 0 7.58833 0.303331 7.77679 0.772772L12.0751 11.5483C12.191 11.8371 12.191 12.1621 12.0751 12.4582L9.37142 19.2254C8.95827 20.2582 7.4941 20.2582 7.08095 19.2254L0.086302 1.68277ZM10.5172 1.64666C10.2273 0.844994 10.8217 0 11.677 0H16.3811C16.903 0 17.3669 0.324998 17.5409 0.808883L21.4477 11.5844C21.5419 11.8516 21.5419 12.1477 21.4477 12.4221L19.0993 18.9004C18.7078 19.9838 17.1712 19.9838 16.7798 18.9004L10.5172 1.64666ZM21.0781 0C20.2083 0 19.6139 0.873883 19.9328 1.68277L26.9275 19.2254C27.3406 20.2582 28.8048 20.2582 29.218 19.2254L31.9216 12.4582C32.0376 12.1621 32.0376 11.8371 31.9216 11.5483L27.6233 0.772772C27.4349 0.303331 26.9855 0 26.4781 0H21.0781Z"
          fill="url(#paint0_linear_903_3342)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_903_3342"
          x1="16.0256"
          y1="-4.72222"
          x2="38.2848"
          y2="25.0829"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <clipPath id="clip0_903_3342">
          <rect width={32} height={20} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
