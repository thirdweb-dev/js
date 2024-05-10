import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 504441,
  "explorers": [
    {
      "name": "Playdapp Explorer",
      "url": "https://subnets.avax.network/playdappne",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Playdapp Network",
  "nativeCurrency": {
    "name": "Playdapp Network Token",
    "symbol": "PDA",
    "decimals": 18
  },
  "networkId": 504441,
  "redFlags": [],
  "rpc": [
    "https://504441.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/playdappne/mainnet/rpc"
  ],
  "shortName": "Playdapp Network",
  "slug": "playdapp-network",
  "testnet": false
} as const satisfies Chain;