import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2710,
  "explorers": [
    {
      "name": "Morph Testnet Explorer",
      "url": "https://explorer-testnet.morphl2.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://morphl2.io",
  "name": "Morph Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2710,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge-testnet.morphl2.io"
      }
    ]
  },
  "rpc": [
    "https://2710.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.morphl2.io"
  ],
  "shortName": "tmorph",
  "slip44": 1,
  "slug": "morph-testnet",
  "testnet": true
} as const satisfies Chain;