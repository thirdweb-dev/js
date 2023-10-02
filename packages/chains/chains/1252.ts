import type { Chain } from "../src/types";
export default {
  "chain": "CICT",
  "chainId": 1252,
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://testnet.cicscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://cicfaucet.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "infoURL": "https://www.cicchain.net",
  "name": "CIC Chain Testnet",
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CICT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cic-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testapi.cicscan.com"
  ],
  "shortName": "CICT",
  "slug": "cic-chain-testnet",
  "testnet": true
} as const satisfies Chain;