import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { PayModalButton } from "./PayModal";

export function BuyFundsSection() {
  return (
    <div className="border roudned-lg border-border px-4 py-10 rounded-lg flex justify-center">
      <div className="max-w-[520px] flex flex-col items-center ">
        <BridgeIcon bg="hsl(var(--background))" className="h-12" />

        <div className="h-6" />

        <h2 className="text-lg tracking-tight font-semibold text-center">
          Buy Funds using thirdweb Pay
        </h2>

        <div className="h-2" />

        <p className="text-secondary-foreground text-sm max-w-[520px] text-center">
          Pay allows you to purchase cryptocurrencies and execute transactions
          with their credit card or debit card, or with any token via
          cross-chain routing.
        </p>

        <div className="h-8" />

        <PayModalButton />

        <div className="h-4" />

        <Link
          href="https://portal.thirdweb.com/connect/pay/overview"
          className="inline-flex gap-2 items-center text-sm text-secondary-foreground hover:foreground"
        >
          Learn more about thirdweb Pay <ExternalLinkIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
}

function BridgeIcon(props: {
  bg: string;
  className?: string;
}) {
  return (
    <svg
      width={80}
      height={48}
      viewBox="0 0 80 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z"
        fill="#171717"
      />
      <path
        d="M23.9971 8V19.8291L33.9952 24.2968L23.9971 8Z"
        fill="white"
        fillOpacity="0.602"
      />
      <path d="M23.9975 8L13.998 24.2968L23.9975 19.8291V8Z" fill="white" />
      <path
        d="M23.9971 31.9621V39.9998L34.0018 26.1582L23.9971 31.9621Z"
        fill="white"
        fillOpacity="0.602"
      />
      <path
        d="M23.9975 39.9998V31.9608L13.998 26.1582L23.9975 39.9998Z"
        fill="white"
      />
      <path
        d="M23.9971 30.1022L33.9952 24.297L23.9971 19.832V30.1022Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M13.998 24.297L23.9975 30.1022V19.832L13.998 24.297Z"
        fill="white"
        fillOpacity="0.602"
      />
      <rect x={32} width={48} height={48} rx={16} fill={props.bg} />
      <rect
        x={33}
        y={1}
        width={46}
        height={46}
        rx={15}
        stroke="url(#paint0_linear_1262_7918)"
        strokeOpacity="0.2"
        strokeWidth={2}
      />
      <rect x={37} y={5} width={38} height={38} rx={11} fill={props.bg} />
      <rect
        x={37}
        y={5}
        width={38}
        height={38}
        rx={11}
        stroke="url(#paint1_linear_1262_7918)"
        strokeWidth={2}
      />
      <path
        d="M64.3337 22.3332H47.667M55.167 25.6665H51.0003M47.667 20.8332L47.667 27.1665C47.667 28.0999 47.667 28.5666 47.8486 28.9232C48.0084 29.2368 48.2634 29.4917 48.577 29.6515C48.9335 29.8332 49.4002 29.8332 50.3337 29.8332L61.667 29.8332C62.6004 29.8332 63.0671 29.8332 63.4236 29.6515C63.7372 29.4917 63.9922 29.2368 64.152 28.9232C64.3337 28.5666 64.3337 28.0999 64.3337 27.1665V20.8332C64.3337 19.8998 64.3337 19.433 64.152 19.0765C63.9922 18.7629 63.7372 18.5079 63.4236 18.3482C63.0671 18.1665 62.6004 18.1665 61.667 18.1665L50.3337 18.1665C49.4002 18.1665 48.9335 18.1665 48.577 18.3482C48.2634 18.5079 48.0084 18.7629 47.8486 19.0765C47.667 19.433 47.667 19.8997 47.667 20.8332Z"
        stroke="url(#paint2_linear_1262_7918)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1262_7918"
          x1="28.7396"
          y1="15.4021"
          x2="77.7807"
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
          id="paint1_linear_1262_7918"
          x1="33.283"
          y1="16.835"
          x2="74.1506"
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
          id="paint2_linear_1262_7918"
          x1="46.5349"
          y1="21.9101"
          x2="59.1676"
          y2="34.6987"
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
