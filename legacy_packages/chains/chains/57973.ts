import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 57973,
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
  "name": "QaUser5524 Testnet",
  "nativeCurrency": {
    "name": "QaUser5524 Testnet Token",
    "symbol": "ADN",
    "decimals": 18
  },
  "networkId": 57973,
  "redFlags": [],
  "rpc": [
    "https://57973.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser5524 Testnet",
  "slug": "qauser5524-testnet",
  "testnet": true
} as const satisfies Chain;