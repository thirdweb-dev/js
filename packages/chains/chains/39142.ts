import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 39142,
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
  "name": "ST Found 1-05-24",
  "nativeCurrency": {
    "name": "ST Found 1-05-24 Token",
    "symbol": "LGT",
    "decimals": 18
  },
  "networkId": 39142,
  "redFlags": [],
  "rpc": [
    "https://st-found-1-05-24.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://39142.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "ST Found 1-05-24",
  "slug": "st-found-1-05-24",
  "testnet": true
} as const satisfies Chain;