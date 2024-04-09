import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 43125,
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
  "name": "QaUser3950 Testnet",
  "nativeCurrency": {
    "name": "QaUser3950 Testnet Token",
    "symbol": "SZL",
    "decimals": 18
  },
  "networkId": 43125,
  "redFlags": [],
  "rpc": [
    "https://43125.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser3950 Testnet",
  "slug": "qauser3950-testnet",
  "testnet": true
} as const satisfies Chain;