import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 328527,
  "explorers": [
    {
      "name": "Nal Network Explorer",
      "url": "https://scan.nal.network",
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
  "name": "Nal Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 328527,
  "rpc": [
    "https://328527.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.nal.network",
    "wss://wss.nal.network"
  ],
  "shortName": "nal",
  "slug": "nal",
  "testnet": false
} as const satisfies Chain;