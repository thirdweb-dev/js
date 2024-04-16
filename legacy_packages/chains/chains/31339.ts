import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 31339,
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
  "name": "LT9",
  "nativeCurrency": {
    "name": "LT9 Token",
    "symbol": "LT",
    "decimals": 18
  },
  "networkId": 31339,
  "redFlags": [],
  "rpc": [
    "https://31339.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lt9/testnet/rpc"
  ],
  "shortName": "LT9",
  "slug": "lt9",
  "testnet": true
} as const satisfies Chain;