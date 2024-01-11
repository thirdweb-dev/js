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
  "networkId": 1954,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.dexilla.com"
      }
    ]
  },
  "rpc": [
    "https://dexilla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1954.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dexilla.com"
  ],
  "shortName": "Dexilla",
  "slip44": 1,
  "slug": "dexilla-testnet",
  "testnet": true
} as const satisfies Chain;