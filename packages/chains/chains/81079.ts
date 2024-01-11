import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 81079,
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
  "name": "QI M 21343243",
  "nativeCurrency": {
    "name": "QI M 21343243 Token",
    "symbol": "JZW",
    "decimals": 18
  },
  "networkId": 81079,
  "redFlags": [],
  "rpc": [
    "https://qi-m-21343243.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://81079.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f575b5b1-8b60-47f3-af28-13f3f3de2ba5"
  ],
  "shortName": "QI M 21343243",
  "slug": "qi-m-21343243",
  "testnet": true
} as const satisfies Chain;