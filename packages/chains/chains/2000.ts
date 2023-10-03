import type { Chain } from "../src/types";
export default {
  "chain": "DC",
  "chainId": 2000,
  "explorers": [
    {
      "name": "dogechain explorer",
      "url": "https://explorer.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "infoURL": "https://dogechain.dog",
  "name": "Dogechain Mainnet",
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dogechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dogechain.dog",
    "https://rpc01-sg.dogechain.dog",
    "https://rpc.ankr.com/dogechain"
  ],
  "shortName": "dc",
  "slug": "dogechain",
  "testnet": false
} as const satisfies Chain;