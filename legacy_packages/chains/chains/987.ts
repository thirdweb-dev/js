import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 987,
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
  "name": "Orange Testnet",
  "nativeCurrency": {
    "name": "Orange Testnet Token",
    "symbol": "JUICE",
    "decimals": 18
  },
  "networkId": 987,
  "redFlags": [],
  "rpc": [
    "https://987.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/orangetest/testnet/rpc"
  ],
  "shortName": "Orange Testnet",
  "slug": "orange-testnet",
  "testnet": true
} as const satisfies Chain;