import { useId } from "react";

export function GiftIcon(props: { bg: string; className?: string }) {
  const linearGradientId = useId();
  const linearGradientId2 = useId();
  const linearGradientId3 = useId();
  const clipPathId = useId();

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={48}
      viewBox="0 0 48 48"
      width={48}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={props.bg} height={48} rx={16} width={48} />
      <rect
        height={46}
        rx={15}
        stroke={`url(#${linearGradientId})`}
        strokeOpacity="0.2"
        strokeWidth={2}
        width={46}
        x={1}
        y={1}
      />
      <rect fill={props.bg} height={38} rx={11} width={38} x={5} y={5} />
      <rect
        height={38}
        rx={11}
        stroke={`url(#${linearGradientId2})`}
        strokeWidth={2}
        width={38}
        x={5}
        y={5}
      />
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M23.9993 19.0001V32.3334M23.9993 19.0001H21.0529C20.6188 19.0001 20.2024 18.8245 19.8955 18.5119C19.5885 18.1994 19.416 17.7754 19.416 17.3334C19.416 16.8914 19.5885 16.4675 19.8955 16.1549C20.2024 15.8423 20.6188 15.6667 21.0529 15.6667C23.3446 15.6667 23.9993 19.0001 23.9993 19.0001ZM23.9993 19.0001H26.9458C27.3799 19.0001 27.7963 18.8245 28.1032 18.5119C28.4102 18.1994 28.5827 17.7754 28.5827 17.3334C28.5827 16.8914 28.4102 16.4675 28.1032 16.1549C27.7963 15.8423 27.3799 15.6667 26.9458 15.6667C24.6541 15.6667 23.9993 19.0001 23.9993 19.0001ZM30.666 23.1667V29.6667C30.666 30.6002 30.666 31.0669 30.4844 31.4234C30.3246 31.737 30.0696 31.992 29.756 32.1518C29.3995 32.3334 28.9328 32.3334 27.9993 32.3334L19.9993 32.3334C19.0659 32.3334 18.5992 32.3334 18.2427 32.1518C17.9291 31.992 17.6741 31.737 17.5143 31.4234C17.3327 31.0669 17.3327 30.6002 17.3327 29.6667V23.1667M15.666 20.3334L15.666 21.8334C15.666 22.3001 15.666 22.5335 15.7568 22.7117C15.8367 22.8685 15.9642 22.996 16.121 23.0759C16.2993 23.1667 16.5326 23.1667 16.9993 23.1667L30.9994 23.1667C31.4661 23.1667 31.6994 23.1667 31.8777 23.0759C32.0345 22.996 32.162 22.8685 32.2419 22.7117C32.3327 22.5335 32.3327 22.3001 32.3327 21.8334V20.3334C32.3327 19.8667 32.3327 19.6333 32.2419 19.4551C32.162 19.2983 32.0345 19.1708 31.8777 19.0909C31.6994 19.0001 31.4661 19.0001 30.9993 19.0001L16.9993 19.0001C16.5326 19.0001 16.2993 19.0001 16.121 19.0909C15.9642 19.1708 15.8367 19.2983 15.7568 19.4551C15.666 19.6333 15.666 19.8667 15.666 20.3334Z"
          stroke={`url(#${linearGradientId3})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId}
          x1="-3.26045"
          x2="45.7807"
          y1="15.4021"
          y2="50.1547"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId2}
          x1="1.28296"
          x2="42.1506"
          y1="16.835"
          y2="45.7956"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={linearGradientId3}
          x1="14.5339"
          x2="31.5621"
          y1="21.0147"
          y2="33.0816"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect
            fill="white"
            height={20}
            transform="translate(14 14)"
            width={20}
          />
        </clipPath>
      </defs>
    </svg>
  );
}
