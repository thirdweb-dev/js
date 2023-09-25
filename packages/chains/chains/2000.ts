import type { Chain } from "../src/types";
export default {
  "chainId": 2000,
  "chain": "DC",
  "name": "Dogechain Mainnet",
  "rpc": [
    "https://dogechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dogechain.dog",
    "https://rpc01-sg.dogechain.dog",
    "https://rpc.ankr.com/dogechain"
  ],
  "slug": "dogechain",
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "infoURL": "https://dogechain.dog",
  "shortName": "dc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "dogechain explorer",
      "url": "https://explorer.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;