import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 87815,
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
  "name": "QI M 2402056",
  "nativeCurrency": {
    "name": "QI M 2402056 Token",
    "symbol": "ACI",
    "decimals": 18
  },
  "networkId": 87815,
  "redFlags": [],
  "rpc": [
    "https://87815.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/c908add6-74c5-4407-8091-18762786a0b9"
  ],
  "shortName": "QI M 2402056",
  "slug": "qi-m-2402056",
  "testnet": true
} as const satisfies Chain;