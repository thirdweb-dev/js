import type { Chain } from "../src/types";
export default {
  "chain": "tGRAM",
  "chainId": 131,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://tokioscan-v2.engram.tech",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreidn7dolavrzgqxthydb6rt5iwuzm6cvkxqirzh2szarjspsdp4kyu",
        "width": 400,
        "height": 400,
        "format": "svg"
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
    "url": "ipfs://bafkreidn7dolavrzgqxthydb6rt5iwuzm6cvkxqirzh2szarjspsdp4kyu",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "infoURL": "https://engramnet.io",
  "name": "Engram Testnet",
  "nativeCurrency": {
    "name": "Engram Tokio Testnet",
    "symbol": "tGRAM",
    "decimals": 18
  },
  "networkId": 131,
  "rpc": [
    "https://engram-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://131.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tokioswift.engram.tech",
    "https://tokio-archive.engram.tech"
  ],
  "shortName": "tgram",
  "slug": "engram-testnet",
  "testnet": true
} as const satisfies Chain;