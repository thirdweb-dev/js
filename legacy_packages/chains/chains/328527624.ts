import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 328527624,
  "explorers": [
    {
      "name": "Nal Sepolia Testnet Network Explorer",
      "url": "https://testnet-scan.nal.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZLZHX18YUswejxo1JFNPx5EwMsVhUwBeBWEcd1JUHAK5",
    "width": 640,
    "height": 640,
    "format": "png"
  },
  "infoURL": "https://www.nal.network",
  "name": "Nal Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 328527624,
  "rpc": [
    "https://328527624.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.nal.network"
  ],
  "shortName": "nalsep",
  "slug": "nal-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;