import type { Chain } from "../src/types";
export default {
  "name": "Ancient8 Testnet",
  "chain": "Ancient8",
  "icon": {
    "url": "ipfs://QmSX8sHToRzyFupT8BvPQjVsegRWFYz2mdnLkVnqBFKohY",
    "width": 901,
    "height": 901,
    "format": "png"
  },
  "rpc": [
    "https://ancient8-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.ancient8.gg"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ancient8.gg/",
  "shortName": "a8",
  "chainId": 2863311531,
  "networkId": 2863311531,
  "explorers": [
    {
      "name": "a8scan-testnet",
      "url": "https://testnet.a8scan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ancient8-testnet"
} as const satisfies Chain;