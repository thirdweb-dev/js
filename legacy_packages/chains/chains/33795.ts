import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 33795,
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
  "name": "QaUser9260",
  "nativeCurrency": {
    "name": "QaUser9260 Token",
    "symbol": "SBM",
    "decimals": 18
  },
  "networkId": 33795,
  "redFlags": [],
  "rpc": [
    "https://33795.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9260",
  "slug": "qauser9260",
  "testnet": true
} as const satisfies Chain;