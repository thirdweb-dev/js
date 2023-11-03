import type { Chain } from "../types";
export default {
  "chain": "Electroneum",
  "chainId": 52014,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockexplorer.electroneum.com",
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
  "name": "Electroneum Mainnet",
  "nativeCurrency": {
    "name": "Electroneum",
    "symbol": "ETN",
    "decimals": 18
  },
  "networkId": 52014,
  "rpc": [
    "https://electroneum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://52014.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.electroneum.com"
  ],
  "shortName": "etn-mainnet",
  "slug": "electroneum",
  "testnet": false
} as const satisfies Chain;