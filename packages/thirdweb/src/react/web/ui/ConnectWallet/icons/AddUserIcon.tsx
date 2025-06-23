import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const AddUserIcon: IconFC = (props) => {
  return (
    <svg
      fill="none"
      height={props.size}
      role="presentation"
      viewBox="0 0 24 24"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};
