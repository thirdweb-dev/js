import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 5042,
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
  "name": "OMOCHI",
  "nativeCurrency": {
    "name": "OMOCHI Token",
    "symbol": "OMCH",
    "decimals": 18
  },
  "networkId": 5042,
  "redFlags": [],
  "rpc": [
    "https://5042.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/omochi/testnet/rpc"
  ],
  "shortName": "OMOCHI",
  "slug": "omochi",
  "testnet": true
} as const satisfies Chain;