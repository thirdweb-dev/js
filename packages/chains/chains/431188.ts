import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 431188,
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
  "name": "Foundation Testnet",
  "nativeCurrency": {
    "name": "Foundation Testnet Token",
    "symbol": "TFND",
    "decimals": 18
  },
  "networkId": 431188,
  "redFlags": [],
  "rpc": [
    "https://431188.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/foundation/testnet/rpc"
  ],
  "shortName": "Foundation Testnet",
  "slug": "foundation-testnet",
  "testnet": true
} as const satisfies Chain;