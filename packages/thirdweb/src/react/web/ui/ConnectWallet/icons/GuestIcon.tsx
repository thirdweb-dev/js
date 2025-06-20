import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const GuestIcon: IconFC = (props) => {
  return (
    <svg
      fill="none"
      height={props.size}
      role="presentation"
      stroke={props.color ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};
