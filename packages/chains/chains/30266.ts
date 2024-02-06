import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 30266,
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
  "name": "Tnet02-06",
  "nativeCurrency": {
    "name": "Tnet02-06 Token",
    "symbol": "LFC",
    "decimals": 18
  },
  "networkId": 30266,
  "redFlags": [],
  "rpc": [
    "https://tnet02-06.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://30266.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Tnet02-06",
  "slug": "tnet02-06",
  "testnet": true
} as const satisfies Chain;