import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const CreditCardIcon: IconFC = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color ?? "currentColor"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
};
