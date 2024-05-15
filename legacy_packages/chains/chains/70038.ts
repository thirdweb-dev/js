import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70038,
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
  "name": "John's Testnet",
  "nativeCurrency": {
    "name": "John's Testnet Token",
    "symbol": "FLG",
    "decimals": 18
  },
  "networkId": 70038,
  "redFlags": [],
  "rpc": [
    "https://70038.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "John's Testnet",
  "slug": "john-s-testnet",
  "testnet": true
} as const satisfies Chain;