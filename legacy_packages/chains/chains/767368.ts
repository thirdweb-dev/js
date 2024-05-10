import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 767368,
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
  "name": "Lamina1 Identity Testnet",
  "nativeCurrency": {
    "name": "Lamina1 Identity Testnet Token",
    "symbol": "L1IDT",
    "decimals": 18
  },
  "networkId": 767368,
  "redFlags": [],
  "rpc": [
    "https://767368.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lamina1id/testnet/rpc"
  ],
  "shortName": "Lamina1 Identity Testnet",
  "slug": "lamina1-identity-testnet",
  "testnet": true
} as const satisfies Chain;