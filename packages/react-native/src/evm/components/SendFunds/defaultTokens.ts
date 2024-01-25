export type TokenInfo = {
  name: string;
  symbol: string;
  address: string;
  icon: string;
};

const wrappedEthIcon =
  '<svg width="2500" height="2500" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF" fill-rule="nonzero"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>';

const tetherUsdIcon =
  '<svg id="Layer_1" data-name="Layer 1" viewBox="0 0 339.43 295.27"><title>tether-usdt-logo</title><path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" style="fill:#50af95;fill-rule:evenodd"/><path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" style="fill:#fff;fill-rule:evenodd"/></svg>';

const usdcIcon = `<svg data-name="86977684-12db-4850-8f30-233a7c267d11" viewBox="0 0 2000 2000">
  <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775ca"/>
  <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff"/>
  <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#fff"/>
</svg>
`;

const wrappedBtcIcon =
  '<svg viewBox="0 0 109.26 109.26"><title>wrapped-bitcoin-wbtc</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="Page-1"><g id="wbtc_colour" data-name="wbtc colour"><path id="Shape" fill="#5a5564" d="M89.09,22.93l-3,3a42.47,42.47,0,0,1,0,57.32l3,3a46.76,46.76,0,0,0,0-63.39Z"/><path id="Shape-2" data-name="Shape" fill="#5a5564" d="M26,23.19a42.47,42.47,0,0,1,57.32,0l3-3a46.76,46.76,0,0,0-63.39,0Z"/><path id="Shape-3" data-name="Shape" fill="#5a5564" d="M23.19,83.28a42.47,42.47,0,0,1,0-57.29l-3-3a46.76,46.76,0,0,0,0,63.39Z"/><path id="Shape-4" data-name="Shape" fill="#5a5564" d="M83.28,86.05a42.47,42.47,0,0,1-57.32,0l-3,3a46.76,46.76,0,0,0,63.39,0Z"/><path id="Shape-5" data-name="Shape" fill="#f09242" d="M73.57,44.62c-.6-6.26-6-8.36-12.83-9V27H55.46v8.46c-1.39,0-2.81,0-4.22,0V27H46v8.68H35.29v5.65s3.9-.07,3.84,0a2.73,2.73,0,0,1,3,2.32V67.41a1.85,1.85,0,0,1-.64,1.29,1.83,1.83,0,0,1-1.36.46c.07.06-3.84,0-3.84,0l-1,6.31H45.9v8.82h5.28V75.6H55.4v8.65h5.29V75.53c8.92-.54,15.14-2.74,15.92-11.09.63-6.72-2.53-9.72-7.58-10.93C72.1,52,74,49.2,73.57,44.62ZM66.17,63.4c0,6.56-11.24,5.81-14.82,5.81V57.57C54.93,57.58,66.17,56.55,66.17,63.4ZM63.72,47c0,6-9.38,5.27-12.36,5.27V41.69C54.34,41.69,63.72,40.75,63.72,47Z"/><path id="Shape-6" data-name="Shape" fill="#282138" d="M54.62,109.26a54.63,54.63,0,1,1,54.64-54.64A54.63,54.63,0,0,1,54.62,109.26Zm0-105A50.34,50.34,0,1,0,105,54.62,50.34,50.34,0,0,0,54.62,4.26Z"/></g></g></g></g></svg>';

const maticIcon = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" >
  <circle cx="512" cy="512" r="512" fill="#8247E5"/>
  <path d="M681.469 402.456C669.189 395.312 653.224 395.312 639.716 402.456L543.928 457.228L478.842 492.949L383.055 547.721C370.774 554.865 354.81 554.865 341.301 547.721L265.162 504.856C252.882 497.712 244.286 484.614 244.286 470.325V385.786C244.286 371.498 251.654 358.4 265.162 351.256L340.073 309.581C352.353 302.437 368.318 302.437 381.827 309.581L456.737 351.256C469.018 358.4 477.614 371.498 477.614 385.786V440.558L542.7 403.646V348.874C542.7 334.586 535.332 321.488 521.824 314.344L383.055 235.758C370.774 228.614 354.81 228.614 341.301 235.758L200.076 314.344C186.567 321.488 179.199 334.586 179.199 348.874V507.237C179.199 521.525 186.567 534.623 200.076 541.767L341.301 620.353C353.582 627.498 369.546 627.498 383.055 620.353L478.842 566.772L543.928 529.86L639.716 476.279C651.996 469.135 667.961 469.135 681.469 476.279L756.38 517.953C768.66 525.098 777.257 538.195 777.257 552.484V637.023C777.257 651.312 769.888 664.409 756.38 671.553L681.469 714.419C669.189 721.563 653.224 721.563 639.716 714.419L564.805 672.744C552.525 665.6 543.928 652.502 543.928 638.214V583.442L478.842 620.353V675.125C478.842 689.414 486.21 702.512 499.719 709.656L640.944 788.242C653.224 795.386 669.189 795.386 682.697 788.242L823.922 709.656C836.203 702.512 844.799 689.414 844.799 675.125V516.763C844.799 502.474 837.431 489.377 823.922 482.232L681.469 402.456Z" fill="white"/>
  </svg>
  `;

const binanceCoinIcon =
  '<svg width="32" height="32"><g fill="none"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"/></g></svg>';

const BUSDIcon =
  '<svg viewBox="0 0 336.41 337.42"><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path fill="#f0b90b" stroke="#f0b90b" d="M168.2.71l41.5,42.5L105.2,147.71l-41.5-41.5Z"/><path fill="#f0b90b" stroke="#f0b90b" d="M231.2,63.71l41.5,42.5L105.2,273.71l-41.5-41.5Z"/><path fill="#f0b90b" stroke="#f0b90b" d="M42.2,126.71l41.5,42.5-41.5,41.5L.7,169.21Z"/><path fill="#f0b90b" stroke="#f0b90b" d="M294.2,126.71l41.5,42.5L168.2,336.71l-41.5-41.5Z"/></g></g></svg>';

const fantomIcon =
  '<svg viewBox="0 0 32 32"><defs><mask id="mask" x="10" y="6" width="93.1" height="20" maskUnits="userSpaceOnUse"><g id="a"><path fill="#fff" fill-rule="evenodd" d="M10,6h93.1V26H10Z"/></g></mask></defs><title>fa</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle fill="#13b5ec" cx="16" cy="16" r="16"/><g mask="url(#mask)"><path fill="#fff" fill-rule="evenodd" d="M17.2,12.9l3.6-2.1V15Zm3.6,9L16,24.7l-4.8-2.8V17L16,19.8,20.8,17ZM11.2,10.8l3.6,2.1L11.2,15Zm5.4,3.1L20.2,16l-3.6,2.1Zm-1.2,4.2L11.8,16l3.6-2.1Zm4.8-8.3L16,12.2,11.8,9.8,16,7.3ZM10,9.4V22.5l6,3.4,6-3.4V9.4L16,6Z"/></g></g></g></svg>';

export type SupportedTokens = Record<number, TokenInfo[]>;

export const defaultTokens: SupportedTokens = {
  "1": [
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "Tether USD",
      symbol: "USDT",
      icon: tetherUsdIcon,
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
    {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      icon: wrappedBtcIcon,
    },
    {
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      name: "Polygon",
      symbol: "WMATIC",
      icon: maticIcon,
    },
  ],
  "5": [
    {
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
  ],
  "10": [
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
  ],
  "56": [
    {
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "Wrapped Binance Chain Token",
      symbol: "WBNB",
      icon: binanceCoinIcon,
    },
    {
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      name: "Binance USD",
      symbol: "BUSD",
      icon: BUSDIcon,
    },
  ],
  "97": [
    {
      address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      name: "Wrapped Binance Chain Testnet Token",
      symbol: "WBNB",
      icon: binanceCoinIcon,
    },
    {
      address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
      name: "Binance USD",
      symbol: "BUSD",
      icon: BUSDIcon,
    },
  ],
  "137": [
    {
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      name: "Wrapped Matic",
      symbol: "WMATIC",
      icon: maticIcon,
    },
    {
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      name: "USD Coin (Bridged)",
      symbol: "USDC.e",
      icon: usdcIcon,
    },
    {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      name: "Tether USD",
      symbol: "USDT",
      icon: tetherUsdIcon,
    },
    {
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      name: "Wrapped BTC",
      symbol: "WBTC",
      icon: wrappedBtcIcon,
    },
  ],
  "250": [
    {
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      name: "Wrapped Fantom",
      symbol: "WFTM",
      icon: fantomIcon,
    },
    {
      name: "Wrapped Ether",
      address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      name: "USD Coin",
      address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      symbol: "USDC",
      icon: usdcIcon,
    },
    {
      name: "Wrapped Bitcoin",
      address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      symbol: "WBTC",
      icon: wrappedBtcIcon,
    },
  ],
  "420": [
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
  ],
  "4002": [
    {
      address: "0xf1277d1Ed8AD466beddF92ef448A132661956621",
      name: "Wrapped Fantom",
      symbol: "WFTM",
      icon: fantomIcon,
    },
  ],
  "42161": [
    {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
  ],
  "43113": [
    {
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      icon: `<svg width="1503" height="1504" viewBox="0 0 1503 1504" fill="none">
      <rect x="287" y="258" width="928" height="844" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1502.5 752C1502.5 1166.77 1166.27 1503 751.5 1503C336.734 1503 0.5 1166.77 0.5 752C0.5 337.234 336.734 1 751.5 1C1166.27 1 1502.5 337.234 1502.5 752ZM538.688 1050.86H392.94C362.314 1050.86 347.186 1050.86 337.962 1044.96C327.999 1038.5 321.911 1027.8 321.173 1015.99C320.619 1005.11 328.184 991.822 343.312 965.255L703.182 330.935C718.495 303.999 726.243 290.531 736.021 285.55C746.537 280.2 759.083 280.2 769.599 285.55C779.377 290.531 787.126 303.999 802.438 330.935L876.42 460.079L876.797 460.738C893.336 489.635 901.723 504.289 905.385 519.669C909.443 536.458 909.443 554.169 905.385 570.958C901.695 586.455 893.393 601.215 876.604 630.549L687.573 964.702L687.084 965.558C670.436 994.693 661.999 1009.46 650.306 1020.6C637.576 1032.78 622.263 1041.63 605.474 1046.62C590.161 1050.86 573.004 1050.86 538.688 1050.86ZM906.75 1050.86H1115.59C1146.4 1050.86 1161.9 1050.86 1171.13 1044.78C1181.09 1038.32 1187.36 1027.43 1187.92 1015.63C1188.45 1005.1 1181.05 992.33 1166.55 967.307C1166.05 966.455 1165.55 965.588 1165.04 964.706L1060.43 785.75L1059.24 783.735C1044.54 758.877 1037.12 746.324 1027.59 741.472C1017.08 736.121 1004.71 736.121 994.199 741.472C984.605 746.453 976.857 759.552 961.544 785.934L857.306 964.891L856.949 965.507C841.69 991.847 834.064 1005.01 834.614 1015.81C835.352 1027.62 841.44 1038.5 851.402 1044.96C860.443 1050.86 875.94 1050.86 906.75 1050.86Z" fill="#E84142"/>
      </svg>
      `,
    },
    {
      address: "0x5425890298aed601595a70AB815c96711a31Bc65",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
  ],
  "43114": [
    {
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      icon: `<svg width="1503" height="1504" viewBox="0 0 1503 1504" fill="none">
      <rect x="287" y="258" width="928" height="844" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1502.5 752C1502.5 1166.77 1166.27 1503 751.5 1503C336.734 1503 0.5 1166.77 0.5 752C0.5 337.234 336.734 1 751.5 1C1166.27 1 1502.5 337.234 1502.5 752ZM538.688 1050.86H392.94C362.314 1050.86 347.186 1050.86 337.962 1044.96C327.999 1038.5 321.911 1027.8 321.173 1015.99C320.619 1005.11 328.184 991.822 343.312 965.255L703.182 330.935C718.495 303.999 726.243 290.531 736.021 285.55C746.537 280.2 759.083 280.2 769.599 285.55C779.377 290.531 787.126 303.999 802.438 330.935L876.42 460.079L876.797 460.738C893.336 489.635 901.723 504.289 905.385 519.669C909.443 536.458 909.443 554.169 905.385 570.958C901.695 586.455 893.393 601.215 876.604 630.549L687.573 964.702L687.084 965.558C670.436 994.693 661.999 1009.46 650.306 1020.6C637.576 1032.78 622.263 1041.63 605.474 1046.62C590.161 1050.86 573.004 1050.86 538.688 1050.86ZM906.75 1050.86H1115.59C1146.4 1050.86 1161.9 1050.86 1171.13 1044.78C1181.09 1038.32 1187.36 1027.43 1187.92 1015.63C1188.45 1005.1 1181.05 992.33 1166.55 967.307C1166.05 966.455 1165.55 965.588 1165.04 964.706L1060.43 785.75L1059.24 783.735C1044.54 758.877 1037.12 746.324 1027.59 741.472C1017.08 736.121 1004.71 736.121 994.199 741.472C984.605 746.453 976.857 759.552 961.544 785.934L857.306 964.891L856.949 965.507C841.69 991.847 834.064 1005.01 834.614 1015.81C835.352 1027.62 841.44 1038.5 851.402 1044.96C860.443 1050.86 875.94 1050.86 906.75 1050.86Z" fill="#E84142"/>
      </svg>
      `,
    },
    {
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
      name: "Tether USD",
      symbol: "USDT",
      icon: tetherUsdIcon,
    },
    {
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
    {
      address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
      name: "Wrapped BTC",
      symbol: "WBTC",
      icon: wrappedBtcIcon,
    },
  ],
  "80001": [
    {
      address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      name: "Wrapped Matic",
      symbol: "WMATIC",
      icon: maticIcon,
    },
    {
      name: "Wrapped Ether",
      address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
    {
      name: "Tether USD",
      address: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      symbol: "USDT",
      icon: tetherUsdIcon,
    },
  ],
  "421613": [
    {
      address: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
      name: "Wrapped Ether",
      symbol: "WETH",
      icon: wrappedEthIcon,
    },
    {
      address: "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63",
      name: "USD Coin",
      symbol: "USDC",
      icon: usdcIcon,
    },
  ],
};
