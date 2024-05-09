import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 12781,
  "explorers": [
    {
      "name": "Playdapp Testnet Explorer",
      "url": "https://subnets-test.avax.network/playdappte",
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
  "name": "playdapp Testnet",
  "nativeCurrency": {
    "name": "playdapp Testnet Token",
    "symbol": "PDA",
    "decimals": 18
  },
  "networkId": 12781,
  "redFlags": [],
  "rpc": [
    "https://12781.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/playdappte/testnet/rpc"
  ],
  "shortName": "playdapp Testnet",
  "slug": "playdapp-testnet",
  "testnet": true
} as const satisfies Chain;