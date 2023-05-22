import type { Chain } from "../src/types";
export default {
  "name": "Dexilla Testnet",
  "chain": "Dexilla",
  "rpc": [
    "https://dexilla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dexilla.com"
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUBveetVibvSEWQrjyxySgUphLuoMGSVLGmYnobt5FgEZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "Dexilla Native Token",
    "symbol": "DXZ",
    "decimals": 18
  },
  "infoURL": "https://dexilla.com",
  "shortName": "Dexilla",
  "chainId": 1954,
  "networkId": 1954,
  "explorers": [
    {
      "name": "dos-mainnet",
      "url": "https://exp.dexilla.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.dexilla.com"
      }
    ]
  },
  "testnet": true,
  "slug": "dexilla-testnet"
} as const satisfies Chain;