import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 37375,
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
  "name": "QI M 2402057",
  "nativeCurrency": {
    "name": "QI M 2402057 Token",
    "symbol": "ACI",
    "decimals": 18
  },
  "networkId": 37375,
  "redFlags": [],
  "rpc": [
    "https://qi-m-2402057.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://37375.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/c908add6-74c5-4407-8091-18762786a0b9"
  ],
  "shortName": "QI M 2402057",
  "slug": "qi-m-2402057",
  "testnet": true
} as const satisfies Chain;