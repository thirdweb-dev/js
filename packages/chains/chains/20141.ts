import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 20141,
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
  "name": "Shelby's Testnet",
  "nativeCurrency": {
    "name": "Shelby's Testnet Token",
    "symbol": "FUC",
    "decimals": 18
  },
  "networkId": 20141,
  "redFlags": [],
  "rpc": [
    "https://20141.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/c6fcfa18-e711-4f91-b8d4-ad59cfd30316"
  ],
  "shortName": "Shelby's Testnet",
  "slug": "shelby-s-testnet",
  "testnet": true
} as const satisfies Chain;