import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 41077,
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
  "networkId": 41077,
  "redFlags": [],
  "rpc": [
    "https://41077.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/really/testnet/rpc"
  ],
  "shortName": "REALLY",
  "slug": "really",
  "testnet": true
} as const satisfies Chain;