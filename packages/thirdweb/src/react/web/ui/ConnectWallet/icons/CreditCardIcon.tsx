import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const CreditCardIcon: IconFC = (props) => {
  return (
    <svg
      fill="none"
      height={props.size}
      role="presentation"
      stroke={props.color ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="14" rx="2" width="20" x="2" y="5" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
};
