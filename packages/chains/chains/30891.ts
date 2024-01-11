import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 30891,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Jambon's Testnet",
  "nativeCurrency": {
    "name": "Jambon's Testnet Token",
    "symbol": "CXY",
    "decimals": 18
  },
  "networkId": 30891,
  "redFlags": [],
  "rpc": [
    "https://jambon-s-testnet-jambon's testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://30891.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/e8b04790-d50c-4bb1-89ba-7bd140b674f3"
  ],
  "shortName": "Jambon's Testnet",
  "slug": "jambon-s-testnet-jambon's testnet",
  "testnet": true
} as const satisfies Chain;