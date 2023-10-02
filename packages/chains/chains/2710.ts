import type { Chain } from "../src/types";
export default {
  "name": "Morphism Testnet",
  "chain": "ETH",
  "rpc": [
    "https://morphism-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.morphism.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://morphism.xyz",
  "shortName": "tmorph",
  "chainId": 2710,
  "networkId": 2710,
  "explorers": [
    {
      "name": "Morphism Testnet Explorer",
      "url": "https://explorer-testnet.morphism.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge-testnet.morphism.xyz"
      }
    ]
  },
  "testnet": true,
  "slug": "morphism-testnet"
} as const satisfies Chain;