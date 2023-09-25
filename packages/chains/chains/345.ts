import type { Chain } from "../src/types";
export default {
  "chainId": 345,
  "chain": "Yooldo Verse",
  "name": "Yooldo Verse Mainnet",
  "rpc": [
    "https://yooldo-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yooldo-verse.xyz/"
  ],
  "slug": "yooldo-verse",
  "icon": {
    "url": "ipfs://QmWvfA2usnYp1ktzLcqFS8eTLgdp4ifrxjiify46KyG9NZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://yooldo.gg/",
  "shortName": "YVM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;