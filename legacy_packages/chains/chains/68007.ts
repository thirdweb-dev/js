import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68007,
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
  "name": "infra Testnet",
  "nativeCurrency": {
    "name": "infra Testnet Token",
    "symbol": "ZPO",
    "decimals": 18
  },
  "networkId": 68007,
  "redFlags": [],
  "rpc": [
    "https://68007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/infratestn/testnet/rpc"
  ],
  "shortName": "infra Testnet",
  "slug": "infra-testnet",
  "testnet": true
} as const satisfies Chain;