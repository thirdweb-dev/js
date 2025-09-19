import type { IconFC } from "./types.js";

export const ArrowUpDownIcon: IconFC = (props) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      width={props.size}
      height={props.size}
    >
      <g
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.599 2.4v11.2l3.2-3.476M6.4 13.6V2.4L3.2 5.875"></path>
      </g>
    </svg>
  );
};
