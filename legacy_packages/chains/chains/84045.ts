import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 84045,
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
  "name": "Jovica's Testnet",
  "nativeCurrency": {
    "name": "Jovica's Testnet Token",
    "symbol": "ZQG",
    "decimals": 18
  },
  "networkId": 84045,
  "redFlags": [],
  "rpc": [
    "https://84045.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jovicax/testnet/rpc"
  ],
  "shortName": "Jovica's Testnet",
  "slug": "jovica-s-testnet",
  "testnet": true
} as const satisfies Chain;