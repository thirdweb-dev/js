import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 3070,
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
  "name": "QaUser9054",
  "nativeCurrency": {
    "name": "QaUser9054 Token",
    "symbol": "QFE",
    "decimals": 18
  },
  "networkId": 3070,
  "redFlags": [],
  "rpc": [
    "https://3070.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9054",
  "slug": "qauser9054",
  "testnet": true
} as const satisfies Chain;