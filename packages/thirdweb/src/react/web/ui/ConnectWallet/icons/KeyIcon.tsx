import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const KeyIcon: IconFC = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
    >
      <path
        d="M2 5.99999L2 2.99999C2 2.39999 2.4 1.99999 3 1.99999H7L7 4.99999H10V7.99999H12L13.4 9.39999C14.7898 8.91585 16.3028 8.9177 17.6915 9.40524C19.0801 9.89278 20.2622 10.8372 21.0444 12.0839C21.8265 13.3306 22.1624 14.8058 21.9971 16.2683C21.8318 17.7307 21.1751 19.0937 20.1344 20.1344C19.0937 21.1751 17.7307 21.8318 16.2683 21.9971C14.8058 22.1624 13.3306 21.8265 12.0839 21.0444C10.8372 20.2622 9.89279 19.0801 9.40525 17.6915C8.91771 16.3028 8.91585 14.7898 9.4 13.4L2 5.99999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 15C15.7761 15 16 15.2239 16 15.5C16 15.7761 15.7761 16 15.5 16C15.2239 16 15 15.7761 15 15.5C15 15.2239 15.2239 15 15.5 15Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
