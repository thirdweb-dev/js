import type { Chain } from "../src/types";
export default {
  "chain": "CICT",
  "chainId": 1252,
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://testnet.cicscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
        "width": 1024,
        "height": 768,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://cicfaucet.com"
  ],
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
  "networkId": 1252,
  "rpc": [
    "https://1252.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testapi.cicscan.com"
  ],
  "shortName": "CICT",
  "slip44": 1,
  "slug": "cic-chain-testnet",
  "testnet": true
} as const satisfies Chain;