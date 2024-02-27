import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 88018,
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
  "name": "QI M 2402131",
  "nativeCurrency": {
    "name": "QI M 2402131 Token",
    "symbol": "CYB",
    "decimals": 18
  },
  "networkId": 88018,
  "redFlags": [],
  "rpc": [
    "https://88018.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI M 2402131",
  "slug": "qi-m-2402131",
  "testnet": true
} as const satisfies Chain;