import type { Chain } from "../src/types";
export default {
  "chain": "VRC",
  "chainId": 713,
  "explorers": [
    {
      "name": "vrcscan",
      "url": "https://vrcscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dxbscan",
      "url": "https://dxb.vrcscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmasMkZJ6m7y77fgY6SooNnrH3Y4a3vVYNDWe9T3KusxeU",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://vrccoin.com",
  "name": "Vrcscan Mainnet",
  "nativeCurrency": {
    "name": "VRC Chain",
    "symbol": "VRC",
    "decimals": 18
  },
  "networkId": 713,
  "rpc": [
    "https://713.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-5.vrcscan.com",
    "https://rpc-mainnet-6.vrcscan.com",
    "https://rpc-mainnet-7.vrcscan.com",
    "https://rpc-mainnet-8.vrcscan.com"
  ],
  "shortName": "vrc",
  "slug": "vrcscan",
  "testnet": false
} as const satisfies Chain;