import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 53383,
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
  "name": "Jambon's Testnet",
  "nativeCurrency": {
    "name": "Jambon's Testnet Token",
    "symbol": "GNF",
    "decimals": 18
  },
  "networkId": 53383,
  "redFlags": [],
  "rpc": [
    "https://53383.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/c37c3f83-6d95-4473-b5c7-626fad519f50"
  ],
  "shortName": "Jambon's Testnet",
  "slug": "jambon-s-testnet-jambon's testnet-53383",
  "testnet": true
} as const satisfies Chain;