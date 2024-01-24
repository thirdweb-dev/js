import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 23812,
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
  "name": "kjCohan Testnet",
  "nativeCurrency": {
    "name": "kjCohan Testnet Token",
    "symbol": "DBM",
    "decimals": 18
  },
  "networkId": 23812,
  "redFlags": [],
  "rpc": [
    "https://kjcohan-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://23812.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/d2b6bd35-89f7-4019-bc88-643c31221e5c"
  ],
  "shortName": "kjCohan Testnet",
  "slug": "kjcohan-testnet",
  "testnet": true
} as const satisfies Chain;