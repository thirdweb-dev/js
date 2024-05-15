import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 91132,
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
  "name": "New Will's Testnet",
  "nativeCurrency": {
    "name": "New Will's Testnet Token",
    "symbol": "MBM",
    "decimals": 18
  },
  "networkId": 91132,
  "redFlags": [],
  "rpc": [
    "https://91132.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "New Will's Testnet",
  "slug": "new-will-s-testnet",
  "testnet": true
} as const satisfies Chain;