import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70457,
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
  "name": "QaUser9604",
  "nativeCurrency": {
    "name": "QaUser9604 Token",
    "symbol": "CEB",
    "decimals": 18
  },
  "networkId": 70457,
  "redFlags": [],
  "rpc": [
    "https://70457.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9604",
  "slug": "qauser9604",
  "testnet": true
} as const satisfies Chain;