import type { Chain } from "../src/types";
export default {
  "chain": "Dexilla",
  "chainId": 1954,
  "explorers": [
    {
      "name": "dos-mainnet",
      "url": "https://exp.dexilla.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmUBveetVibvSEWQrjyxySgUphLuoMGSVLGmYnobt5FgEZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://dexilla.com",
  "name": "Dexilla Testnet",
  "nativeCurrency": {
    "name": "Dexilla Native Token",
    "symbol": "DXZ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dexilla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dexilla.com"
  ],
  "shortName": "Dexilla",
  "slug": "dexilla-testnet",
  "testnet": true
} as const satisfies Chain;