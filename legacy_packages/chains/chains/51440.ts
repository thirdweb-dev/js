import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51440,
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
  "name": "QI0430s4",
  "nativeCurrency": {
    "name": "QI0430s4 Token",
    "symbol": "SWS",
    "decimals": 18
  },
  "networkId": 51440,
  "redFlags": [],
  "rpc": [
    "https://51440.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0430s4",
  "slug": "qi0430s4",
  "testnet": true
} as const satisfies Chain;