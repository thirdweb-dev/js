import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 56914,
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
  "name": "KK1223",
  "nativeCurrency": {
    "name": "KK1223 Token",
    "symbol": "KLK",
    "decimals": 18
  },
  "networkId": 56914,
  "redFlags": [],
  "rpc": [
    "https://56914.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/bf540c23-4601-4768-9e26-f2e5f0f89c18"
  ],
  "shortName": "KK1223",
  "slug": "kk1223",
  "testnet": true
} as const satisfies Chain;