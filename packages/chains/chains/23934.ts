import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 23934,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "ST 11-16 v7 Regression",
  "nativeCurrency": {
    "name": "ST 11-16 v7 Regression Token",
    "symbol": "WLA",
    "decimals": 18
  },
  "networkId": 23934,
  "redFlags": [],
  "rpc": [
    "https://23934.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "ST 11-16 v7 Regression",
  "slug": "st-11-16-v7-regression",
  "testnet": true
} as const satisfies Chain;