import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 45979,
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
  "name": "QaUser5277 Testnet",
  "nativeCurrency": {
    "name": "QaUser5277 Testnet Token",
    "symbol": "LWR",
    "decimals": 18
  },
  "networkId": 45979,
  "redFlags": [],
  "rpc": [
    "https://45979.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser5277 Testnet",
  "slug": "qauser5277-testnet",
  "testnet": true
} as const satisfies Chain;