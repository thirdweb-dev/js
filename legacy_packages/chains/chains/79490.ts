import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 79490,
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
  "name": "QaUser2672 Testnet",
  "nativeCurrency": {
    "name": "QaUser2672 Testnet Token",
    "symbol": "ENU",
    "decimals": 18
  },
  "networkId": 79490,
  "redFlags": [],
  "rpc": [
    "https://79490.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser2672 Testnet",
  "slug": "qauser2672-testnet",
  "testnet": true
} as const satisfies Chain;