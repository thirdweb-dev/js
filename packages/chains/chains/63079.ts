import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 63079,
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
  "name": "MT 1121-2",
  "nativeCurrency": {
    "name": "MT 1121-2 Token",
    "symbol": "RCE",
    "decimals": 18
  },
  "networkId": 63079,
  "redFlags": [],
  "rpc": [
    "https://mt-1121-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://63079.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/d76ea66a-e423-49f6-8ef1-4355260b47f1"
  ],
  "shortName": "MT 1121-2",
  "slug": "mt-1121-2",
  "testnet": true
} as const satisfies Chain;