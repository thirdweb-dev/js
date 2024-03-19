import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 65044,
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
  "name": "EXR0314 Testnet",
  "nativeCurrency": {
    "name": "EXR0314 Testnet Token",
    "symbol": "BPR",
    "decimals": 18
  },
  "networkId": 65044,
  "redFlags": [],
  "rpc": [
    "https://65044.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "EXR0314 Testnet",
  "slug": "exr0314-testnet",
  "testnet": true
} as const satisfies Chain;