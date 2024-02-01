import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 103454,
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
  "name": "Masa Testnet",
  "nativeCurrency": {
    "name": "Masa Testnet Token",
    "symbol": "tMASA",
    "decimals": 18
  },
  "networkId": 103454,
  "redFlags": [],
  "rpc": [
    "https://masa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://103454.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/masatestne/testnet/rpc"
  ],
  "shortName": "Masa Testnet",
  "slug": "masa-testnet",
  "testnet": true
} as const satisfies Chain;