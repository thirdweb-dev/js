import type { Chain } from "../src/types";
export default {
  "chainId": 1954,
  "chain": "Dexilla",
  "name": "Dexilla Testnet",
  "rpc": [
    "https://dexilla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dexilla.com"
  ],
  "slug": "dexilla-testnet",
  "icon": {
    "url": "ipfs://QmUBveetVibvSEWQrjyxySgUphLuoMGSVLGmYnobt5FgEZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Dexilla Native Token",
    "symbol": "DXZ",
    "decimals": 18
  },
  "infoURL": "https://dexilla.com",
  "shortName": "Dexilla",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "dos-mainnet",
      "url": "https://exp.dexilla.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;