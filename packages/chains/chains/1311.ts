import type { Chain } from "../src/types";
export default {
  "chainId": 1311,
  "chain": "DOS",
  "name": "Dos Fuji Subnet",
  "rpc": [
    "https://dos-fuji-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com/jsonrpc"
  ],
  "slug": "dos-fuji-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Dos Native Token",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "http://doschain.io/",
  "shortName": "TDOS",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "dos-testnet",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;