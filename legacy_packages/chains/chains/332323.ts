import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 332323,
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
  "name": "QI0408s3dev Testnet",
  "nativeCurrency": {
    "name": "QI0408s3dev Testnet Token",
    "symbol": "REQ",
    "decimals": 18
  },
  "networkId": 332323,
  "redFlags": [],
  "rpc": [
    "https://332323.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0408s3dev Testnet",
  "slug": "qi0408s3dev-testnet",
  "testnet": true
} as const satisfies Chain;