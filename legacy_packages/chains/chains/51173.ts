import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51173,
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
  "name": "QaUser1544",
  "nativeCurrency": {
    "name": "QaUser1544 Token",
    "symbol": "ECX",
    "decimals": 18
  },
  "networkId": 51173,
  "redFlags": [],
  "rpc": [
    "https://51173.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser1544",
  "slug": "qauser1544",
  "testnet": true
} as const satisfies Chain;