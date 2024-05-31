import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 14255,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QI0521S2T",
  "nativeCurrency": {
    "name": "QI0521S2T Token",
    "symbol": "YFT",
    "decimals": 18
  },
  "networkId": 14255,
  "redFlags": [],
  "rpc": [
    "https://14255.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0521S2T",
  "slug": "qi0521s2t",
  "testnet": true
} as const satisfies Chain;