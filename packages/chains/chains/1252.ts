import type { Chain } from "../src/types";
export default {
  "chainId": 1252,
  "chain": "CICT",
  "name": "CIC Chain Testnet",
  "rpc": [
    "https://cic-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testapi.cicscan.com"
  ],
  "slug": "cic-chain-testnet",
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "faucets": [
    "https://cicfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CICT",
    "decimals": 18
  },
  "infoURL": "https://www.cicchain.net",
  "shortName": "CICT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://testnet.cicscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;