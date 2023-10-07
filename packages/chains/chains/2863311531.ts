import type { Chain } from "../src/types";
export default {
  "chain": "Ancient8",
  "chainId": 2863311531,
  "explorers": [
    {
      "name": "a8scan-testnet",
      "url": "https://testnet.a8scan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSX8sHToRzyFupT8BvPQjVsegRWFYz2mdnLkVnqBFKohY",
    "width": 901,
    "height": 901,
    "format": "png"
  },
  "infoURL": "https://ancient8.gg/",
  "name": "Ancient8 Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ancient8-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.ancient8.gg"
  ],
  "shortName": "a8",
  "slug": "ancient8-testnet",
  "testnet": true
} as const satisfies Chain;