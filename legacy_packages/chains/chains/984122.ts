import type { Chain } from "../src/types";
export default {
  "chain": "Forma",
  "chainId": 984122,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.forma.art",
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
  "name": "Forma",
  "nativeCurrency": {
    "name": "TIA",
    "symbol": "TIA",
    "decimals": 18
  },
  "networkId": 984122,
  "rpc": [
    "https://984122.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.forma.art"
  ],
  "shortName": "forma",
  "slug": "forma",
  "testnet": false
} as const satisfies Chain;