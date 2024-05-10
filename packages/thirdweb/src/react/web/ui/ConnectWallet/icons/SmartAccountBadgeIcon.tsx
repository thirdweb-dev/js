import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const SmartWalletBadgeIcon: IconFC = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 12 12"
      width={props.size}
      height={props.size}
      role="presentation"
    >
      <g clipPath="url(#clip0_5539_26604)">
        <path
          d="M10 6.85691C10 9.35691 8.25 10.6069 6.17 11.3319C6.06108 11.3688 5.94277 11.3671 5.835 11.3269C3.75 10.6069 2 9.35691 2 6.85691V3.35691C2 3.22431 2.05268 3.09713 2.14645 3.00336C2.24021 2.90959 2.36739 2.85691 2.5 2.85691C3.5 2.85691 4.75 2.25691 5.62 1.49691C5.72593 1.40641 5.86068 1.35669 6 1.35669C6.13932 1.35669 6.27407 1.40641 6.38 1.49691C7.255 2.26191 8.5 2.85691 9.5 2.85691C9.63261 2.85691 9.75979 2.90959 9.85355 3.00336C9.94732 3.09713 10 3.22431 10 3.35691V6.85691Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 6.35693L5.5 7.35693L7.5 5.35693"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_5539_26604">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(0 0.356934)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
