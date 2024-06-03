import type { Chain } from "../src/types";
export default {
  "chain": "Forma",
  "chainId": 984123,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sketchpad-1.forma.art",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
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
    "url": "ipfs://QmQkjcadjAEefa4HLG26pKFvCaNZeZ7wWNxMkCVarW9tiU",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://forma.art",
  "name": "Forma Sketchpad",
  "nativeCurrency": {
    "name": "TIA",
    "symbol": "TIA",
    "decimals": 18
  },
  "networkId": 984123,
  "rpc": [
    "https://984123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sketchpad-1.forma.art"
  ],
  "shortName": "sketchpad",
  "slug": "forma-sketchpad",
  "testnet": false
} as const satisfies Chain;