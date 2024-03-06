import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 94918,
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
  "name": "Sample Testnet",
  "nativeCurrency": {
    "name": "Sample Testnet Token",
    "symbol": "INS",
    "decimals": 18
  },
  "networkId": 94918,
  "redFlags": [],
  "rpc": [
    "https://94918.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/sampletest/testnet/rpc"
  ],
  "shortName": "Sample Testnet",
  "slug": "sample-testnet",
  "testnet": true
} as const satisfies Chain;