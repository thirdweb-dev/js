import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 24347,
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
  "name": "Tnet 02-27",
  "nativeCurrency": {
    "name": "Tnet 02-27 Token",
    "symbol": "TJO",
    "decimals": 18
  },
  "networkId": 24347,
  "redFlags": [],
  "rpc": [
    "https://24347.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Tnet 02-27",
  "slug": "tnet-02-27",
  "testnet": true
} as const satisfies Chain;