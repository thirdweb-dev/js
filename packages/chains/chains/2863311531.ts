import type { Chain } from "../src/types";
export default {
  "chainId": 2863311531,
  "chain": "Ancient8",
  "name": "Ancient8 Testnet",
  "rpc": [
    "https://ancient8-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.ancient8.gg"
  ],
  "slug": "ancient8-testnet",
  "icon": {
    "url": "ipfs://QmSX8sHToRzyFupT8BvPQjVsegRWFYz2mdnLkVnqBFKohY",
    "width": 901,
    "height": 901,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ancient8.gg/",
  "shortName": "a8",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "a8scan-testnet",
      "url": "https://testnet.a8scan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;