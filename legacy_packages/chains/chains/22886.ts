import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 22886,
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
  "name": "Will's Testnet",
  "nativeCurrency": {
    "name": "Will's Testnet Token",
    "symbol": "MBM",
    "decimals": 18
  },
  "networkId": 22886,
  "redFlags": [],
  "rpc": [
    "https://22886.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Will's Testnet",
  "slug": "will-s-testnet-will's testnet",
  "testnet": true
} as const satisfies Chain;