import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 31338,
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
  "name": "LT8 Testnet",
  "nativeCurrency": {
    "name": "LT8 Testnet Token",
    "symbol": "LT",
    "decimals": 18
  },
  "networkId": 31338,
  "redFlags": [],
  "rpc": [
    "https://31338.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lt8/testnet/rpc"
  ],
  "shortName": "LT8 Testnet",
  "slug": "lt8-testnet",
  "testnet": true
} as const satisfies Chain;