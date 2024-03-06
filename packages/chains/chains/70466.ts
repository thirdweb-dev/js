import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70466,
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
  "name": "Cohan test3",
  "nativeCurrency": {
    "name": "Cohan test3 Token",
    "symbol": "HYN",
    "decimals": 18
  },
  "networkId": 70466,
  "redFlags": [],
  "rpc": [
    "https://70466.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f44b72ee-0574-44d2-a10b-363a74964145"
  ],
  "shortName": "Cohan test3",
  "slug": "cohan-test3",
  "testnet": true
} as const satisfies Chain;