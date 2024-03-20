import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 57021,
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
  "name": "QIM2403061",
  "nativeCurrency": {
    "name": "QIM2403061 Token",
    "symbol": "VVC",
    "decimals": 18
  },
  "networkId": 57021,
  "redFlags": [],
  "rpc": [
    "https://57021.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QIM2403061",
  "slug": "qim2403061",
  "testnet": true
} as const satisfies Chain;