import type { Chain } from "../src/types";
export default {
  "chain": "Azra Testnet",
  "chainId": 5106,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorerl2new-azra-testnet-6hz86owb1n.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://azragames.com",
  "name": "Azra Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5106,
  "rpc": [
    "https://5106.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-azra-testnet-6hz86owb1n.t.conduit.xyz"
  ],
  "shortName": "azra-testnet",
  "slug": "azra-testnet",
  "testnet": true
} as const satisfies Chain;