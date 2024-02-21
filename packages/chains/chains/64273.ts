import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 64273,
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
  "name": "REALLY",
  "nativeCurrency": {
    "name": "REALLY Token",
    "symbol": "FAN",
    "decimals": 18
  },
  "networkId": 64273,
  "redFlags": [],
  "rpc": [
    "https://64273.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/really/mainnet/rpc"
  ],
  "shortName": "REALLY",
  "slug": "really-really",
  "testnet": false
} as const satisfies Chain;