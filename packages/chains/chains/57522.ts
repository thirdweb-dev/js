import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 57522,
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
  "name": "Cohan Test",
  "nativeCurrency": {
    "name": "Cohan Test Token",
    "symbol": "NYU",
    "decimals": 18
  },
  "networkId": 57522,
  "redFlags": [],
  "rpc": [
    "https://57522.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/fc395ee3-9e2d-45ea-951a-233b4f3e367d"
  ],
  "shortName": "Cohan Test",
  "slug": "cohan-test",
  "testnet": true
} as const satisfies Chain;