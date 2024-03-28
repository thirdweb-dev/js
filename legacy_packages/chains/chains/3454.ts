import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 3454,
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
  "name": "Masa",
  "nativeCurrency": {
    "name": "Masa Token",
    "symbol": "MASA",
    "decimals": 18
  },
  "networkId": 3454,
  "redFlags": [],
  "rpc": [
    "https://3454.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/masa/mainnet/rpc"
  ],
  "shortName": "Masa",
  "slug": "masa",
  "testnet": false
} as const satisfies Chain;