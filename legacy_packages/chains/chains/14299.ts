import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 14299,
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
  "name": "Diego's",
  "nativeCurrency": {
    "name": "Diego's Token",
    "symbol": "VMF",
    "decimals": 18
  },
  "networkId": 14299,
  "redFlags": [],
  "rpc": [
    "https://14299.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/diegos/testnet/rpc"
  ],
  "shortName": "Diego's",
  "slug": "diego-s",
  "testnet": true
} as const satisfies Chain;