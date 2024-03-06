import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 210815,
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
  "name": "Stavax Testnet",
  "nativeCurrency": {
    "name": "Stavax Testnet Token",
    "symbol": "STA",
    "decimals": 18
  },
  "networkId": 210815,
  "redFlags": [],
  "rpc": [
    "https://210815.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/stavaxtest/testnet/rpc"
  ],
  "shortName": "Stavax Testnet",
  "slug": "stavax-testnet",
  "testnet": true
} as const satisfies Chain;