import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 37195,
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
  "name": "Thari",
  "nativeCurrency": {
    "name": "Thari Token",
    "symbol": "THARI",
    "decimals": 18
  },
  "networkId": 37195,
  "redFlags": [],
  "rpc": [
    "https://thari.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://37195.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/thari/testnet/rpc"
  ],
  "shortName": "Thari",
  "slug": "thari",
  "testnet": true
} as const satisfies Chain;