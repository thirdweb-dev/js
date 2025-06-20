import type { IconFC } from "../types.js";

export const JPYIcon: IconFC = (props) => {
  return (
    <svg
      height={props.size}
      role="presentation"
      viewBox="0 0 32 32"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" fill="#a81b1b" r="16" />
        <path
          d="M17.548 18.711v1.878h5.063v2.288h-5.063V25.5h-3.096v-2.623H9.389v-2.288h5.063v-1.878H9.389v-2.288h4.171L7.5 7.5h3.752l4.8 7.534L20.853 7.5H24.5l-6.086 8.923h4.197v2.288z"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
};
