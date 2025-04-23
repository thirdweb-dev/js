export function CreditCardIcon(props: {
  bg: string;
  className?: string;
}) {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={props.className}
    >
      <rect width={48} height={48} rx={16} fill={props.bg} />
      <rect
        x={1}
        y={1}
        width={46}
        height={46}
        rx={15}
        stroke="url(#paint0_linear_1315_3638)"
        strokeOpacity="0.2"
        strokeWidth={2}
      />
      <rect x={5} y={5} width={38} height={38} rx={11} fill={props.bg} />
      <rect
        x={5}
        y={5}
        width={38}
        height={38}
        rx={11}
        stroke="url(#paint1_linear_1315_3638)"
        strokeWidth={2}
      />
      <path
        d="M32.3337 22.3333H15.667M23.167 25.6666H19.0003M15.667 20.8333L15.667 27.1666C15.667 28.1 15.667 28.5668 15.8486 28.9233C16.0084 29.2369 16.2634 29.4918 16.577 29.6516C16.9335 29.8333 17.4002 29.8333 18.3337 29.8333L29.667 29.8333C30.6004 29.8333 31.0671 29.8333 31.4236 29.6516C31.7372 29.4918 31.9922 29.2369 32.152 28.9233C32.3337 28.5668 32.3337 28.1 32.3337 27.1666V20.8333C32.3337 19.8999 32.3337 19.4332 32.152 19.0766C31.9922 18.763 31.7372 18.5081 31.4236 18.3483C31.0671 18.1666 30.6004 18.1666 29.667 18.1666L18.3337 18.1666C17.4002 18.1666 16.9335 18.1666 16.577 18.3483C16.2634 18.5081 16.0084 18.763 15.8486 19.0766C15.667 19.4332 15.667 19.8999 15.667 20.8333Z"
        stroke="url(#paint2_linear_1315_3638)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1315_3638"
          x1="-3.26045"
          y1="15.4021"
          x2="45.7807"
          y2="50.1547"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1315_3638"
          x1="1.28296"
          y1="16.835"
          x2="42.1506"
          y2="45.7956"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1315_3638"
          x1="14.5349"
          y1="21.9102"
          x2="27.1676"
          y2="34.6989"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F213A4" />
          <stop offset="0.1517" stopColor="#E011A7" />
          <stop offset="0.4554" stopColor="#B20DAF" />
          <stop offset="0.8789" stopColor="#6806BB" />
          <stop offset={1} stopColor="#5204BF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
