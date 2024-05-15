import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 30915,
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
  "name": "Deboard's Testnet",
  "nativeCurrency": {
    "name": "Deboard's Testnet Token",
    "symbol": "DEVAX",
    "decimals": 18
  },
  "networkId": 30915,
  "redFlags": [],
  "rpc": [
    "https://30915.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/deboardste/testnet/rpc"
  ],
  "shortName": "Deboard's Testnet",
  "slug": "deboard-s-testnet",
  "testnet": true
} as const satisfies Chain;