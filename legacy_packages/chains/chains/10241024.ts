import type { Chain } from "../src/types";
export default {
  "chain": "AlienX Mainnet",
  "chainId": 10241024,
  "explorers": [
    {
      "name": "AlienXChain Explorer",
      "url": "https://explorer.alienxchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWAa7JayD8HCtAMXezzUNcUoi2Rikqpu2WmrHpFBmDEez",
    "width": 480,
    "height": 480,
    "format": "png"
  },
  "infoURL": "https://alienxchain.io/home",
  "name": "AlienX Mainnet",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 10241024,
  "rpc": [
    "https://10241024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alienxchain.io/http"
  ],
  "shortName": "AlienX",
  "slug": "alienx",
  "testnet": false
} as const satisfies Chain;