import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 94565,
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
  "name": "T 0117",
  "nativeCurrency": {
    "name": "T 0117 Token",
    "symbol": "RUI",
    "decimals": 18
  },
  "networkId": 94565,
  "redFlags": [],
  "rpc": [
    "https://t-0117.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://94565.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "T 0117",
  "slug": "t-0117",
  "testnet": true
} as const satisfies Chain;