import type { Chain } from "../src/types";
export default {
  "name": "Yooldo Verse Mainnet",
  "chain": "Yooldo Verse",
  "icon": {
    "url": "ipfs://QmWvfA2usnYp1ktzLcqFS8eTLgdp4ifrxjiify46KyG9NZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://yooldo-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yooldo-verse.xyz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://yooldo.gg/",
  "shortName": "YVM",
  "chainId": 345,
  "networkId": 345,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "testnet": false,
  "slug": "yooldo-verse"
} as const satisfies Chain;