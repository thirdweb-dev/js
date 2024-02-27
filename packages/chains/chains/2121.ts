import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 2121,
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
  "name": "M TEST 1103-2",
  "nativeCurrency": {
    "name": "M TEST 1103-2 Token",
    "symbol": "RJI",
    "decimals": 18
  },
  "networkId": 2121,
  "redFlags": [],
  "rpc": [
    "https://2121.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/cb82eb40-2d0d-4188-905b-d50c4b09b40b"
  ],
  "shortName": "M TEST 1103-2",
  "slug": "m-test-1103-2",
  "testnet": true
} as const satisfies Chain;