import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 61514,
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
  "name": "QI011624I1",
  "nativeCurrency": {
    "name": "QI011624I1 Token",
    "symbol": "DGQ",
    "decimals": 18
  },
  "networkId": 61514,
  "redFlags": [],
  "rpc": [
    "https://qi011624i1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://61514.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/e81adde6-3c1b-46ce-8dfe-e7a689f8c7eb"
  ],
  "shortName": "QI011624I1",
  "slug": "qi011624i1",
  "testnet": true
} as const satisfies Chain;