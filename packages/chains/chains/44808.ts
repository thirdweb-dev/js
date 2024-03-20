import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 44808,
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
  "name": "klCohan Testnet",
  "nativeCurrency": {
    "name": "klCohan Testnet Token",
    "symbol": "DBM",
    "decimals": 18
  },
  "networkId": 44808,
  "redFlags": [],
  "rpc": [
    "https://44808.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/d2b6bd35-89f7-4019-bc88-643c31221e5c"
  ],
  "shortName": "klCohan Testnet",
  "slug": "klcohan-testnet",
  "testnet": true
} as const satisfies Chain;