import type { IconFC } from "./types.js";

/**
 * @internal
 */
export const CryptoIcon: IconFC = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      <path
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="#627EEA"
      />
      <path
        d="M8.24902 1.99902V6.43423L11.9975 8.10947L8.24902 1.99902Z"
        fill="white"
        fillOpacity="0.602"
      />
      <path
        d="M8.24947 1.99902L4.50098 8.10947L8.24947 6.43423V1.99902Z"
        fill="white"
      />
      <path
        d="M8.24902 10.9829V13.9966L11.9997 8.80688L8.24902 10.9829Z"
        fill="white"
        fillOpacity="0.602"
      />
      <path
        d="M8.24947 13.9966V10.9829L4.50098 8.80688L8.24947 13.9966Z"
        fill="white"
      />
      <path
        d="M8.24902 10.2854L11.9975 8.10931L8.24902 6.43408V10.2854Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M4.50098 8.10931L8.24947 10.2854V6.43408L4.50098 8.10931Z"
        fill="white"
        fillOpacity="0.602"
      />
    </svg>
  );
};
