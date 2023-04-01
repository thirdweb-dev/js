import type { Chain } from "../src/types";
export default {
  "name": "Dos Fuji Subnet",
  "chain": "DOS",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dos Native Token",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "http://doschain.io/",
  "shortName": "TDOS",
  "chainId": 1311,
  "networkId": 1311,
  "explorers": [
    {
      "name": "dos-testnet",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dos-fuji-subnet"
} as const satisfies Chain;