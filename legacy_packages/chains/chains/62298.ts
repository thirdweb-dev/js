import type { Chain } from "../src/types";
export default {
  "chain": "Citrea",
  "chainId": 62298,
  "explorers": [
    {
      "name": "Citrea Devnet Explorer",
      "url": "https://explorer.devnet.citrea.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmTfgH4X7ZWkHprKgjUZ7SDcCGtS5f2CBuaTEtQYMsydmJ",
        "width": 480,
        "height": 480,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://citrea.xyz/bridge"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmTfgH4X7ZWkHprKgjUZ7SDcCGtS5f2CBuaTEtQYMsydmJ",
    "width": 480,
    "height": 480,
    "format": "png"
  },
  "infoURL": "https://citrea.xyz",
  "name": "Citrea Devnet",
  "nativeCurrency": {
    "name": "Citrea BTC",
    "symbol": "cBTC",
    "decimals": 18
  },
  "networkId": 62298,
  "rpc": [
    "https://62298.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.devnet.citrea.xyz"
  ],
  "shortName": "citrea-devnet",
  "slug": "citrea-devnet",
  "testnet": false
} as const satisfies Chain;