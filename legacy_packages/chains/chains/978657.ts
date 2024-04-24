import type { Chain } from "../src/types";
export default {
  "chain": "treasure",
  "chainId": 978657,
  "explorers": [
    {
      "name": "Treasurescan",
      "url": "https://testnet.treasurescan.io/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbzZk23owb7grDEbEJLuxgUAqQVcHmdjsEkkCD7E9C5R9/Treasure_Primary_Icon%20-%20Karel%20Vuong.png",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://portal.treasure.lol/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmQYRpJAMyPt1DKz1iAuseX3puBZYmdGgFeaZCFDPhixXp",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://portal.treasure.lol",
  "name": "Treasure Ruby",
  "nativeCurrency": {
    "name": "Testnet MAGIC",
    "symbol": "MAGIC",
    "decimals": 18
  },
  "networkId": 978657,
  "redFlags": [],
  "rpc": [
    "https://978657.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.treasure.lol/http",
    "wss://rpc-testnet.treasure.lol/ws"
  ],
  "shortName": "MAGIC",
  "slug": "treasure-ruby",
  "testnet": true
} as const satisfies Chain;