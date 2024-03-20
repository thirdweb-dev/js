import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 69743,
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
  "name": "SCG-K",
  "nativeCurrency": {
    "name": "SCG-K Token",
    "symbol": "REC",
    "decimals": 18
  },
  "networkId": 69743,
  "redFlags": [],
  "rpc": [
    "https://69743.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/scgk/mainnet/rpc"
  ],
  "shortName": "SCG-K",
  "slug": "scg-k-scg-k",
  "testnet": false
} as const satisfies Chain;