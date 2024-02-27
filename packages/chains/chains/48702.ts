import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 48702,
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
  "name": "Testnet",
  "nativeCurrency": {
    "name": "Testnet Token",
    "symbol": "LUG",
    "decimals": 18
  },
  "networkId": 48702,
  "redFlags": [],
  "rpc": [
    "https://48702.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Testnet",
  "slug": "testnet-testnet-48702",
  "testnet": true
} as const satisfies Chain;