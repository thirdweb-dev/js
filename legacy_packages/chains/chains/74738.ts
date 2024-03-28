import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 74738,
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
    "symbol": "CWA",
    "decimals": 18
  },
  "networkId": 74738,
  "redFlags": [],
  "rpc": [
    "https://74738.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Testnet",
  "slug": "testnet-testnet-74738",
  "testnet": true
} as const satisfies Chain;