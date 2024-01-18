import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 39098,
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
  "name": "QI 20240108",
  "nativeCurrency": {
    "name": "QI 20240108 Token",
    "symbol": "COZ",
    "decimals": 18
  },
  "networkId": 39098,
  "redFlags": [],
  "rpc": [
    "https://qi-20240108.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://39098.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f575b5b1-8b60-47f3-af28-13f3f3de2ba5"
  ],
  "shortName": "QI 20240108",
  "slug": "qi-20240108",
  "testnet": true
} as const satisfies Chain;