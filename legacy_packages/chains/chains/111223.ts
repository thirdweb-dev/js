import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 111223,
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
  "name": "Chennai Testnet",
  "nativeCurrency": {
    "name": "Chennai Testnet Token",
    "symbol": "ZOD",
    "decimals": 18
  },
  "networkId": 111223,
  "redFlags": [],
  "rpc": [
    "https://111223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/chennai/testnet/rpc"
  ],
  "shortName": "Chennai Testnet",
  "slug": "chennai-testnet",
  "testnet": true
} as const satisfies Chain;