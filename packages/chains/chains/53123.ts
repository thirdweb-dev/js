import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 53123,
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
  "name": "Metasky",
  "nativeCurrency": {
    "name": "Metasky Token",
    "symbol": "MSK",
    "decimals": 18
  },
  "networkId": 53123,
  "redFlags": [],
  "rpc": [
    "https://53123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/metasky/testnet/rpc"
  ],
  "shortName": "Metasky",
  "slug": "metasky",
  "testnet": true
} as const satisfies Chain;