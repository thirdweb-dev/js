import type { IconFC } from "./types.js";

export const MoveDownIcon: IconFC = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 18L12 22L16 18" />
      <path d="M12 2V22" />
    </svg>
  );
};
