import type { Chain } from "../src/types";
export default {
  "chain": "DOS",
  "chainId": 1311,
  "explorers": [
    {
      "name": "dos-testnet",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "http://doschain.io/",
  "name": "Dos Fuji Subnet",
  "nativeCurrency": {
    "name": "Dos Native Token",
    "symbol": "DOS",
    "decimals": 18
  },
  "networkId": 1311,
  "rpc": [
    "https://dos-fuji-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1311.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com/jsonrpc"
  ],
  "shortName": "TDOS",
  "slug": "dos-fuji-subnet",
  "testnet": true
} as const satisfies Chain;