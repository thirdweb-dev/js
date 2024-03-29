import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 99308,
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
  "name": "Borne Gaming Testnet",
  "nativeCurrency": {
    "name": "Borne Gaming Testnet Token",
    "symbol": "BORNE",
    "decimals": 18
  },
  "networkId": 99308,
  "redFlags": [],
  "rpc": [
    "https://99308.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/bornegamin/testnet/rpc"
  ],
  "shortName": "Borne Gaming Testnet",
  "slug": "borne-gaming-testnet",
  "testnet": true
} as const satisfies Chain;