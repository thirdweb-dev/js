import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 37767,
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
  "name": "Tnet 01-15",
  "nativeCurrency": {
    "name": "Tnet 01-15 Token",
    "symbol": "LFC",
    "decimals": 18
  },
  "networkId": 37767,
  "redFlags": [],
  "rpc": [
    "https://37767.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Tnet 01-15",
  "slug": "tnet-01-15",
  "testnet": true
} as const satisfies Chain;