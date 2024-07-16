import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 86225,
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
  "name": "ava privacy solutions",
  "nativeCurrency": {
    "name": "ava privacy solutions Token",
    "symbol": "APS",
    "decimals": 18
  },
  "networkId": 86225,
  "redFlags": [],
  "rpc": [
    "https://86225.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-avaprivacy-d7360.avax-test.network/ext/bc/oWGrJRSSqrR4EozHy36aJbQcVRc5kCGHm2DzvuWVFVpKq3Q3R/rpc?token=8023bf037deaad0a0fa472760da4fc9e7d66efcf343038d09871bfbd54bcd725"
  ],
  "shortName": "ava privacy solutions",
  "slug": "ava-privacy-solutions",
  "testnet": true
} as const satisfies Chain;