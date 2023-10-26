import type { Chain } from "../src/types";
export default {
  "chain": "DM2 Verse",
  "chainId": 68770,
  "explorers": [
    {
      "name": "DM2Verse Explorer",
      "url": "https://explorer.dm2verse.dmm.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPMqjf5XKZ4Cxa1u8qc8Zj9mmVLBoqK7N5h2zFr3Rsyzw",
    "width": 260,
    "height": 260,
    "format": "png"
  },
  "infoURL": "https://seamoon.dmm.com",
  "name": "DM2 Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 68770,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://dm2-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://68770.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dm2verse.dmm.com"
  ],
  "shortName": "dm2",
  "slug": "dm2-verse",
  "testnet": false
} as const satisfies Chain;