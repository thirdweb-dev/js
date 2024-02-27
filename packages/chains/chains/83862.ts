import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 83862,
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
  "name": "ST 12-12 V1",
  "nativeCurrency": {
    "name": "ST 12-12 V1 Token",
    "symbol": "GXE",
    "decimals": 18
  },
  "networkId": 83862,
  "redFlags": [],
  "rpc": [
    "https://83862.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "ST 12-12 V1",
  "slug": "st-12-12-v1",
  "testnet": true
} as const satisfies Chain;