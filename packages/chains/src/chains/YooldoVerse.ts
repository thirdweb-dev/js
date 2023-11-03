import type { Chain } from "../types";
export default {
  "chain": "Yooldo Verse",
  "chainId": 345,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWvfA2usnYp1ktzLcqFS8eTLgdp4ifrxjiify46KyG9NZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://yooldo.gg/",
  "name": "Yooldo Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 345,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://yooldo-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://345.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yooldo-verse.xyz/"
  ],
  "shortName": "YVM",
  "slug": "yooldo-verse",
  "testnet": false
} as const satisfies Chain;