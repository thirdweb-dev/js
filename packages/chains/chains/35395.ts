import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 35395,
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
  "name": "Found 1-4-23",
  "nativeCurrency": {
    "name": "Found 1-4-23 Token",
    "symbol": "TVJ",
    "decimals": 18
  },
  "networkId": 35395,
  "redFlags": [],
  "rpc": [
    "https://35395.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Found 1-4-23",
  "slug": "found-1-4-23",
  "testnet": true
} as const satisfies Chain;