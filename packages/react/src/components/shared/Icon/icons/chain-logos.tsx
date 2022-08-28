export const chainLogos = {
  ethereum: {
    svgProps: {
      viewBox: "0 0 28 28",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
    },
    paths: (
      <>
        <path
          fill="#25292E"
          fillRule="evenodd"
          d="M14 28a14 14 0 1 0 0-28 14 14 0 0 0 0 28Z"
          clipRule="evenodd"
        />
        <path
          fill="url(#a)"
          fillOpacity=".3"
          fillRule="evenodd"
          d="M14 28a14 14 0 1 0 0-28 14 14 0 0 0 0 28Z"
          clipRule="evenodd"
        />
        <path
          fill="url(#b)"
          d="M8.19 14.77 14 18.21l5.8-3.44-5.8 8.19-5.81-8.19Z"
        />
        <path fill="#fff" d="m14 16.93-5.81-3.44L14 4.34l5.81 9.15L14 16.93Z" />
        <defs>
          <linearGradient
            id="a"
            x1="0"
            x2="14"
            y1="0"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="14"
            x2="14"
            y1="14.77"
            y2="22.96"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity=".9" />
          </linearGradient>
        </defs>
      </>
    ),
  },
  arbitrum: {
    svgProps: {
      viewBox: "0 0 28 28",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
    },
    paths: (
      <>
        <rect
          width="26.6"
          height="26.6"
          x=".7"
          y=".7"
          fill="#2D374B"
          stroke="#96BEDC"
          strokeWidth="1.4"
          rx="13.3"
        />
        <mask
          id="a"
          width="28"
          height="28"
          x="0"
          y="0"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <rect width="28" height="28" fill="#C4C4C4" rx="14" />
        </mask>
        <g mask="url(#a)">
          <path
            fill="#28A0F0"
            d="m14.0861 18.6041 6.5014 10.2239 4.0057-2.3213-7.86-12.3943-2.6471 4.4917Zm13.0744 3.4692-.003-1.8599-7.3064-11.407-2.3087 3.9173 7.091 11.4303 2.172-1.2586a.9628.9628 0 0 0 .3555-.7009l-.0004-.1212Z"
          />
          <rect
            width="25.9"
            height="25.9"
            x="1.05"
            y="1.05"
            fill="url(#b)"
            fillOpacity=".3"
            stroke="#96BEDC"
            strokeWidth="2.1"
            rx="12.95"
          />
          <path
            fill="#fff"
            d="m.3634 28.2207-3.07-1.7674-.234-.8333L7.7461 9.0194c.7298-1.1913 2.3197-1.575 3.7957-1.5541l1.7323.0457L.3634 28.2207ZM19.1655 7.511l-4.5653.0166L2.24 27.9533l3.6103 2.0788.9818-1.6652L19.1655 7.511Z"
          />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1="0"
            x2="14"
            y1="0"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </>
    ),
  },
  avalanche: {
    svgProps: {
      viewBox: "0 0 28 28",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
    },
    paths: (
      <>
        <path fill="#fff" d="M23 5H5v18h18V5Z" />
        <path
          fill="#E84142"
          fillRule="evenodd"
          d="M14 28c-7.513.008-14-6.487-14-14C0 6.196 6.043-.008 14 0c7.95.008 14 6.196 14 14 0 7.505-6.495 13.992-14 14Zm-3.971-7.436H7.315c-.57 0-.851 0-1.023-.11a.69.69 0 0 1-.313-.54c-.01-.202.13-.45.412-.944l6.7-11.809c.285-.501.43-.752.612-.845.195-.1.429-.1.625 0 .182.093.326.344.611.845l1.377 2.404.007.013c.308.538.464.81.533 1.097a2.04 2.04 0 0 1 0 .954c-.07.289-.224.564-.536 1.11l-3.52 6.22-.009.017c-.31.542-.467.817-.684 1.024a2.048 2.048 0 0 1-.835.485c-.285.079-.604.079-1.243.079Zm6.852 0h3.888c.574 0 .862 0 1.034-.113a.687.687 0 0 0 .313-.543c.01-.196-.128-.434-.398-.9a8.198 8.198 0 0 1-.028-.048l-1.948-3.332-.022-.037c-.274-.463-.412-.697-.59-.787a.684.684 0 0 0-.621 0c-.179.093-.323.337-.608.828l-1.94 3.331-.007.012c-.284.49-.426.735-.416.936.014.22.127.423.313.543.168.11.456.11 1.03.11Z"
          clipRule="evenodd"
        />
      </>
    ),
  },
  optimism: {
    svgProps: {
      viewBox: "0 0 28 28",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
    },
    paths: (
      <>
        <rect width="28" height="28" fill="#FF3131" rx="14" />
        <rect width="28" height="28" fill="url(#a)" fillOpacity=".3" rx="14" />
        <path
          fill="#fff"
          d="M9.22 18.35c2.7 0 4.86-2.2 4.86-5.38 0-2.19-1.47-3.8-3.98-3.8-2.72 0-4.85 2.2-4.85 5.38 0 2.2 1.5 3.8 3.97 3.8Zm.83-7.35c1.06 0 1.74.81 1.74 2.1 0 1.9-1.11 3.42-2.51 3.42-1.06 0-1.74-.82-1.74-2.1 0-1.89 1.11-3.42 2.5-3.42Zm6.38-1.68-1.88 8.88h2.26l.55-2.6h1.47c2.43 0 4.01-1.38 4.01-3.6 0-1.61-1.17-2.68-3.1-2.68h-3.3Zm1.9 1.74h.94c.83 0 1.3.38 1.3 1.14 0 1-.68 1.7-1.74 1.7h-1.11l.6-2.84Z"
        />
        <defs>
          <linearGradient
            id="a"
            x1="0"
            x2="14"
            y1="0"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </>
    ),
  },
  polygon: {
    svgProps: {
      viewBox: "0 0 28 28",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
    },
    paths: (
      <>
        <rect width="28" height="28" fill="#8247E5" rx="14" />
        <rect width="28" height="28" fill="url(#a)" fillOpacity=".3" rx="14" />
        <path
          fill="#fff"
          d="M18.28 10.92a1.06 1.06 0 0 0-1.06 0l-2.41 1.42-1.65.93-2.41 1.43c-.31.19-.72.19-1.06 0l-1.92-1.12a1.07 1.07 0 0 1-.53-.9v-2.2a1 1 0 0 1 .53-.9l1.9-1.08c.3-.18.7-.18 1.04 0l1.9 1.09c.3.18.52.52.52.9v1.42l1.64-.96V9.52a1 1 0 0 0-.52-.9l-3.5-2.04a1.06 1.06 0 0 0-1.06 0L6.13 8.63a1 1 0 0 0-.53.9v4.12a1 1 0 0 0 .53.9l3.56 2.04c.31.19.71.19 1.06 0l2.41-1.4 1.65-.95 2.41-1.4c.31-.19.72-.19 1.06 0l1.89 1.09c.3.18.53.52.53.9v2.2a1 1 0 0 1-.53.9l-1.9 1.11c-.3.19-.7.19-1.05 0l-1.89-1.08a1.07 1.07 0 0 1-.52-.9v-1.43l-1.65.96v1.43a1 1 0 0 0 .53.9l3.56 2.04c.31.19.72.19 1.06 0l3.56-2.04c.31-.19.53-.53.53-.9v-4.13a1 1 0 0 0-.53-.9l-3.6-2.07Z"
        />
        <defs>
          <linearGradient
            id="a"
            x1="0"
            x2="14"
            y1="0"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </>
    ),
  },
  fantom: {
    svgProps: {
      viewBox: "0 0 32 32",
      xmlns: "http://www.w3.org/2000/svg",
    },
    paths: (
      <>
        <defs>
          <style>{".cls-1{fill:#fff;fill-rule:evenodd}"}</style>
          <mask
            id="mask"
            width={93.1}
            height={20}
            x={10}
            y={6}
            maskUnits="userSpaceOnUse"
          >
            <path id="a" d="M10 6h93.1v20H10Z" className="cls-1" />
          </mask>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <circle cx={16} cy={16} r={16} fill="#13b5ec" />
            <path
              d="m17.2 12.9 3.6-2.1V15Zm3.6 9L16 24.7l-4.8-2.8V17l4.8 2.8 4.8-2.8Zm-9.6-11.1 3.6 2.1-3.6 2.1Zm5.4 3.1 3.6 2.1-3.6 2.1Zm-1.2 4.2L11.8 16l3.6-2.1Zm4.8-8.3L16 12.2l-4.2-2.4L16 7.3ZM10 9.4v13.1l6 3.4 6-3.4V9.4L16 6Z"
              className="cls-1"
            />
          </g>
        </g>
      </>
    ),
  },
} as const;
