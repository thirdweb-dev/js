import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10850,
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
  "name": "Lamina1 Identity",
  "nativeCurrency": {
    "name": "Lamina1 Identity Token",
    "symbol": "LID",
    "decimals": 18
  },
  "networkId": 10850,
  "redFlags": [],
  "rpc": [
    "https://10850.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lamina1id/mainnet/rpc"
  ],
  "shortName": "Lamina1 Identity",
  "slug": "lamina1-identity",
  "testnet": false
} as const satisfies Chain;