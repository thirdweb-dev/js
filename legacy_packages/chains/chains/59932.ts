import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 59932,
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
  "name": "Insomnia Testnet",
  "nativeCurrency": {
    "name": "Insomnia Testnet Token",
    "symbol": "TECH",
    "decimals": 18
  },
  "networkId": 59932,
  "redFlags": [],
  "rpc": [
    "https://59932.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/instest/testnet/rpc"
  ],
  "shortName": "Insomnia Testnet",
  "slug": "insomnia-testnet",
  "testnet": true
} as const satisfies Chain;