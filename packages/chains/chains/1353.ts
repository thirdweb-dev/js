import type { Chain } from "../src/types";
export default {
  "chain": "CIC",
  "chainId": 1353,
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://cicscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
        "width": 1024,
        "height": 768,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "infoURL": "https://www.cicchain.net",
  "name": "CIC Chain Mainnet",
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CIC",
    "decimals": 18
  },
  "networkId": 1353,
  "rpc": [
    "https://cic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1353.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xapi.cicscan.com"
  ],
  "shortName": "CIC",
  "slug": "cic-chain",
  "testnet": false
} as const satisfies Chain;