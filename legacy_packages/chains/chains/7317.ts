import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 7317,
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
  "name": "QaUser5017 Testnet",
  "nativeCurrency": {
    "name": "QaUser5017 Testnet Token",
    "symbol": "IHS",
    "decimals": 18
  },
  "networkId": 7317,
  "redFlags": [],
  "rpc": [
    "https://7317.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser5017 Testnet",
  "slug": "qauser5017-testnet",
  "testnet": true
} as const satisfies Chain;