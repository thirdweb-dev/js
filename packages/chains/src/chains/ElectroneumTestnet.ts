import type { Chain } from "../types";
export default {
  "chain": "Electroneum",
  "chainId": 5201420,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockexplorer.thesecurityteam.rocks",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVgFqXA3kkCrVYGcWFF7Mhx8JUSe9vSCauNamuKWSvCym",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmVgFqXA3kkCrVYGcWFF7Mhx8JUSe9vSCauNamuKWSvCym",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://electroneum.com",
  "name": "Electroneum Testnet",
  "nativeCurrency": {
    "name": "Electroneum",
    "symbol": "ETN",
    "decimals": 18
  },
  "networkId": 5201420,
  "rpc": [
    "https://electroneum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5201420.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.electroneum.com"
  ],
  "shortName": "etn-testnet",
  "slug": "electroneum-testnet",
  "testnet": true
} as const satisfies Chain;