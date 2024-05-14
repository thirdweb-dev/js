import type { Chain } from "../src/types";
export default {
  "chain": "Vizing Testnet",
  "chainId": 28516,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-sepolia.vizing.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPgpWfGsAZ5UHekWFR8rioadVe3Wox8idFyeVxuv9N4Vo",
        "width": 200,
        "height": 200,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPgpWfGsAZ5UHekWFR8rioadVe3Wox8idFyeVxuv9N4Vo",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://vizing.com",
  "name": "Vizing Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28516,
  "rpc": [
    "https://28516.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sepolia.vizing.com"
  ],
  "shortName": "Vizing-Testnet",
  "slug": "vizing-testnet",
  "testnet": true,
  "title": "Vizing Testnet"
} as const satisfies Chain;