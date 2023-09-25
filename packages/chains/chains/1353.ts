import type { Chain } from "../src/types";
export default {
  "chainId": 1353,
  "chain": "CIC",
  "name": "CIC Chain Mainnet",
  "rpc": [
    "https://cic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xapi.cicscan.com"
  ],
  "slug": "cic-chain",
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CICT",
    "decimals": 18
  },
  "infoURL": "https://www.cicchain.net",
  "shortName": "CIC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://cicscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;