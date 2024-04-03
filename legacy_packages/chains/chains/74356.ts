import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 74356,
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
  "name": "S Testnet 1-5-24",
  "nativeCurrency": {
    "name": "S Testnet 1-5-24 Token",
    "symbol": "ZLQ",
    "decimals": 18
  },
  "networkId": 74356,
  "redFlags": [],
  "rpc": [
    "https://74356.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "S Testnet 1-5-24",
  "slug": "s-testnet-1-5-24",
  "testnet": true
} as const satisfies Chain;