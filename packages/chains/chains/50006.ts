import type { Chain } from "../src/types";
export default {
  "chain": "Yooldo Verse",
  "chainId": 50006,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.testnet.yooldo-verse.xyz",
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
  "name": "Yooldo Verse Testnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 50006,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://yooldo-verse-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://50006.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.yooldo-verse.xyz/"
  ],
  "shortName": "YVT",
  "slip44": 1,
  "slug": "yooldo-verse-testnet",
  "testnet": true
} as const satisfies Chain;