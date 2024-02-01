import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 91558,
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
  "name": "Shelby's Testnet 1-18",
  "nativeCurrency": {
    "name": "Shelby's Testnet 1-18 Token",
    "symbol": "LIE",
    "decimals": 18
  },
  "networkId": 91558,
  "redFlags": [],
  "rpc": [
    "https://shelby-s-testnet-1-18.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://91558.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Shelby's Testnet 1-18",
  "slug": "shelby-s-testnet-1-18",
  "testnet": true
} as const satisfies Chain;