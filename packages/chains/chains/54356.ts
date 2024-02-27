import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 54356,
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
  "name": "Jambon's Testnet",
  "nativeCurrency": {
    "name": "Jambon's Testnet Token",
    "symbol": "ZEG",
    "decimals": 18
  },
  "networkId": 54356,
  "redFlags": [],
  "rpc": [
    "https://54356.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/e6f00b45-8486-445d-b3b8-815708aab379"
  ],
  "shortName": "Jambon's Testnet",
  "slug": "jambon-s-testnet-jambon's testnet-54356",
  "testnet": true
} as const satisfies Chain;