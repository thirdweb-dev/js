import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 313311,
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
  "name": "LT11",
  "nativeCurrency": {
    "name": "LT11 Token",
    "symbol": "LT",
    "decimals": 18
  },
  "networkId": 313311,
  "redFlags": [],
  "rpc": [
    "https://313311.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lt11/testnet/rpc"
  ],
  "shortName": "LT11",
  "slug": "lt11",
  "testnet": true
} as const satisfies Chain;