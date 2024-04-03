import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 13396,
  "explorers": [
    {
      "name": "Masa Explorer",
      "url": "https://subnets.avax.network/masa",
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
  "name": "Masa Network ",
  "nativeCurrency": {
    "name": "Masa Network  Token",
    "symbol": "MASA",
    "decimals": 18
  },
  "networkId": 13396,
  "redFlags": [],
  "rpc": [
    "https://13396.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/masanetwork/mainnet/rpc"
  ],
  "shortName": "Masa Network ",
  "slug": "masa-network",
  "testnet": false
} as const satisfies Chain;