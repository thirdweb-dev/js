import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 2828,
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
  "name": "Cohan's Testnet 1",
  "nativeCurrency": {
    "name": "Cohan's Testnet 1 Token",
    "symbol": "FQC",
    "decimals": 18
  },
  "networkId": 2828,
  "redFlags": [],
  "rpc": [
    "https://2828.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/a6eec829-2c08-4264-b0d7-6d393997e9a6"
  ],
  "shortName": "Cohan's Testnet 1",
  "slug": "cohan-s-testnet-1",
  "testnet": true
} as const satisfies Chain;