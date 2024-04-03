import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 24867,
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
  "name": "QaUser45 Testnet",
  "nativeCurrency": {
    "name": "QaUser45 Testnet Token",
    "symbol": "ZAG",
    "decimals": 18
  },
  "networkId": 24867,
  "redFlags": [],
  "rpc": [
    "https://24867.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser45 Testnet",
  "slug": "qauser45-testnet",
  "testnet": true
} as const satisfies Chain;