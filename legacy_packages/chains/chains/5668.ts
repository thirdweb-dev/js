import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 5668,
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
  "name": "JONO122",
  "nativeCurrency": {
    "name": "JONO122 Token",
    "symbol": "JONO",
    "decimals": 18
  },
  "networkId": 5668,
  "redFlags": [],
  "rpc": [
    "https://5668.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jono122/testnet/rpc"
  ],
  "shortName": "JONO122",
  "slug": "jono122",
  "testnet": true
} as const satisfies Chain;